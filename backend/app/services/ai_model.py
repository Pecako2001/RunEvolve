import os
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neural_network import MLPClassifier, MLPRegressor
from sklearn.metrics import classification_report, mean_squared_error

from app import crud
from app.database import SessionLocal

MODEL_DIR    = "app/services/models"
CLASSIF_PATH = os.path.join(MODEL_DIR, "run_type_classifier.joblib")
REGRESS_PATH = os.path.join(MODEL_DIR, "run_feature_regressor.joblib")


def assign_run_type_label(run: pd.Series) -> str:
    distance  = run.get('distance', 0) or 0
    avg_speed = run.get('average_speed', 0) or 0
    name      = str(run.get('name', '')).lower()

    if "interval" in name or (distance < 3 and avg_speed > 12):
        return "Interval"
    elif distance > 10:
        return "Long Run"
    elif 5 <= distance <= 10 and 10 <= avg_speed <= 12:
        return "Tempo Run"
    else:
        return "Easy/Recovery Run"


def train_models(limit: int = 10000):
    """Fetch completed runs, train classifier & regressor, and save them."""
    os.makedirs(MODEL_DIR, exist_ok=True)
    db = SessionLocal()
    runs = crud.get_completed_runs(db, limit=limit)
    db.close()

    # build dataframe
    rows = []
    for r in runs:
        if None in (r.distance, r.time, r.average_speed):
            continue
        rows.append({
            "distance":       r.distance,
            "time":           r.time,
            "average_speed":  r.average_speed,
            "name":           r.name or ""
        })
    df = pd.DataFrame(rows)
    if df.empty:
        raise RuntimeError("No data to train on")

    df["run_type"] = df.apply(assign_run_type_label, axis=1)

    # Debug: Print class distribution
    print("Class distribution in training data:")
    print(df["run_type"].value_counts())

    # --- CLASSIFIER ---
    Xc = df[["distance", "time", "average_speed"]]
    yc = df["run_type"]
    le = LabelEncoder().fit(yc)
    y_enc = le.transform(yc)

    # Debug: Print encoded classes
    print("\nEncoded classes:")
    for i, class_name in enumerate(le.classes_):
        count = np.sum(y_enc == i)
        print(f"{class_name}: {count} samples")

    # Check that each class has at least 2 samples
    unique, counts = np.unique(y_enc, return_counts=True)
    if np.any(counts < 2):
        class_names = le.inverse_transform(unique[counts < 2])
        raise RuntimeError(f"Each class must have at least 2 samples to train. The following classes have too few samples: {dict(zip(class_names, counts[counts < 2]))}")

    scaler_clf = StandardScaler().fit(Xc)
    Xc_s = scaler_clf.transform(Xc)
    
    # Use stratification to ensure all classes are represented in both sets
    Xc_tr, Xc_te, yc_tr, yc_te = train_test_split(
        Xc_s, y_enc, 
        test_size=0.2, 
        random_state=42, 
        stratify=y_enc,
        shuffle=True
    )

    # Debug: Print class distribution in train and test sets
    print("\nClass distribution in training set:")
    train_classes = np.unique(yc_tr)
    for i in train_classes:
        count = np.sum(yc_tr == i)
        print(f"{le.inverse_transform([i])[0]}: {count} samples")
    
    print("\nClass distribution in test set:")
    test_classes = np.unique(yc_te)
    for i in test_classes:
        count = np.sum(yc_te == i)
        print(f"{le.inverse_transform([i])[0]}: {count} samples")

    clf = MLPClassifier(hidden_layer_sizes=(100, 50), max_iter=500, random_state=42)
    clf.fit(Xc_tr, yc_tr)
    preds = clf.predict(Xc_te)
    
    # Get the actual classes present in the test data
    test_classes = np.unique(yc_te)
    test_class_names = le.inverse_transform(test_classes)
    print(classification_report(yc_te, preds, target_names=test_class_names, zero_division=0))

    joblib.dump({"model": clf, "scaler": scaler_clf, "label_encoder": le}, CLASSIF_PATH)
    print(f"Saved classifier → {CLASSIF_PATH}")

    # --- REGRESSOR ---
    oh = pd.get_dummies(df["run_type"])
    Xr = oh.values
    yr = df[["distance", "time", "average_speed"]].values

    scaler_reg = StandardScaler().fit(yr)
    yr_s = scaler_reg.transform(yr)
    Xr_tr, Xr_te, yr_tr, yr_te = train_test_split(Xr, yr_s, test_size=0.2, random_state=42)

    reg = MLPRegressor(hidden_layer_sizes=(50, 25), max_iter=500, random_state=42)
    reg.fit(Xr_tr, yr_tr)
    yr_pred = reg.predict(Xr_te)
    print("Regressor MSE:", mean_squared_error(yr_te, yr_pred))

    joblib.dump({
        "model": reg,
        "target_scaler": scaler_reg,
        "onehot_columns": oh.columns.tolist()
    }, REGRESS_PATH)
    print(f"Saved regressor → {REGRESS_PATH}")


def predict_run_type(run_features: dict) -> str:
    """Load classifier and predict run_type (fallback to heuristic)."""
    if not os.path.exists(CLASSIF_PATH):
        return assign_run_type_label(pd.Series(run_features))

    pkg = joblib.load(CLASSIF_PATH)
    clf = pkg["model"]
    scl = pkg["scaler"]
    le  = pkg["label_encoder"]

    X = pd.DataFrame([run_features], columns=["distance", "time", "average_speed"])
    Xs = scl.transform(X)
    return le.inverse_transform(clf.predict(Xs))[0]


def predict_run_features(run_type: str) -> Dict[str, Any]:
    """Load regressor and predict (distance,time,avg_speed) for a run_type."""
    if not os.path.exists(REGRESS_PATH):
        raise RuntimeError("Models not trained yet")

    pkg = joblib.load(REGRESS_PATH)
    reg     = pkg["model"]
    scaler  = pkg["target_scaler"]
    columns = pkg["onehot_columns"]

    vec = np.zeros(len(columns))
    if run_type in columns:
        vec[columns.index(run_type)] = 1

    scaled_out = reg.predict([vec])[0]
    out = scaler.inverse_transform([scaled_out])[0]

    return {"distance": float(out[0]), "time": int(out[1]), "average_speed": float(out[2])}


def generate_training_plan(run_type: str, distance: float = 10.0) -> Dict[str, Any]:
    """
    Build a plan by pulling actual network outputs
    (here using predict_run_features to get real values).
    """
    rec = predict_run_features(run_type)
    return {
        "type": run_type,
        "description": f"Custom plan based on network for a {run_type}",
        "recommended": rec
    }


def get_run_plan(request: Dict[str, Any]) -> Dict[str, Any]:
    """
    Full pipeline: classify, then generate plan from regressor outputs.
    """
    features = {
        "distance": request.get("distance", 0.0),
        "time": request.get("time", 0),
        "average_speed": request.get("average_speed", 0.0),
    }
    rt  = predict_run_type(features)
    plan = generate_training_plan(rt, features["distance"])
    return {"predicted_run_type": rt, "training_plan": plan}
