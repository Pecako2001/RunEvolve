import os
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
# from sklearn.tree import DecisionTreeClassifier # Alternative model
# from sklearn.neural_network import MLPClassifier # Alternative model
from sklearn.metrics import classification_report

# Adjust imports based on actual project structure
# Assuming app.crud, app.database, app.models are accessible from this path
# If running as a standalone script, PYTHONPATH might need adjustment or use relative imports carefully.
try:
    from app import crud
    from app.database import SessionLocal, get_db # get_db for FastAPI, SessionLocal for standalone
    from app.models import RunStatus
except ImportError:
    # This block allows the script to run for linting/type-checking without direct FastAPI context
    # but will fail if database access is attempted without proper path setup.
    print("Warning: Running in a mode where FastAPI app components might not be fully available.")
    # Define dummy/placeholder types if needed for type checking, e.g.
    class crud: pass
    class SessionLocal: pass
    class get_db: pass
    class RunStatus: pass


MODEL_DIR = "backend/app/services/saved_models"
MODEL_PATH = os.path.join(MODEL_DIR, "run_type_predictor.joblib")
LABEL_ENCODER_PATH = os.path.join(MODEL_DIR, "run_type_label_encoder.joblib")

# Standalone DB session provider
def get_db_standalone():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def assign_run_type_label(run: pd.Series) -> str:
    """
    Assigns a run type label based on heuristics.
    'run' is expected to be a pandas Series with 'distance', 'average_speed', 'name'.
    """
    distance = run.get('distance', 0) or 0
    avg_speed = run.get('average_speed', 0) or 0
    name = str(run.get('name', '') or '').lower()

    if "interval" in name or (distance < 3 and avg_speed > 12):
        return "Interval"
    elif distance > 10:
        return "Long Run"
    elif 5 <= distance <= 10 and 10 <= avg_speed <= 12:
        return "Tempo Run"
    else:
        return "Easy/Recovery Run"

# Placeholder for train_model and predict_run_type
def train_model():
    print("Starting model training process...")
    db = next(get_db_standalone()) # Get a database session

    # 1. Data Fetching
    print("Fetching completed runs...")
    try:
        # Fetch a reasonable number of runs for training, e.g., all of them if the dataset is not too large.
        # Adjust limit as necessary. For a small dataset, fetching all is fine.
        completed_runs = crud.get_completed_runs(db, limit=10000) # Fetch up to 10000 runs
    except Exception as e:
        print(f"Error fetching runs from database: {e}")
        return
    finally:
        db.close() # Ensure the session is closed

    if not completed_runs:
        print("No completed runs found to train the model.")
        return

    # 2. Data Preprocessing
    print("Preprocessing data...")
    runs_data = [{
        'id': run.id,
        'name': run.name,
        'distance': run.distance,
        'time': run.time, # in seconds
        'average_speed': run.average_speed, # km/h
        'status': run.status.value if isinstance(run.status, RunStatus) else run.status # Ensure status is string
    } for run in completed_runs if run.distance is not None and run.time is not None and run.average_speed is not None]
    
    if not runs_data:
        print("No runs with sufficient data (distance, time, average_speed) found.")
        return

    df = pd.DataFrame(runs_data)
    
    # Apply heuristic to assign run type labels
    df['run_type_label'] = df.apply(assign_run_type_label, axis=1)
    print(f"Value counts for run_type_label:\n{df['run_type_label'].value_counts()}")

    # 3. Feature Selection
    features = ['distance', 'time', 'average_speed']
    X = df[features]
    y = df['run_type_label']

    if X.empty or y.empty:
        print("Feature set X or target y is empty after preprocessing. Cannot train model.")
        return
        
    # 4. Encoding Labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    # 5. Data Splitting
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded if len(np.unique(y_encoded)) > 1 else None)

    # 6. Feature Scaling
    print("Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 7. Model Training
    print("Training Logistic Regression model...")
    # model = LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced')
    # Using MLPClassifier as per "Neural Network script" task title
    model = MLPClassifier(hidden_layer_sizes=(100, 50), max_iter=1000, random_state=42, early_stopping=True, n_iter_no_change=10)

    try:
        model.fit(X_train_scaled, y_train)
    except Exception as e:
        print(f"Error during model training: {e}")
        return

    # 8. Model Evaluation
    print("Evaluating model...")
    y_pred = model.predict(X_test_scaled)
    print(classification_report(y_test, y_pred, target_names=label_encoder.classes_, zero_division=0))

    # 9. Model Saving
    print("Saving model, scaler, and label encoder...")
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump({'model': model, 'scaler': scaler, 'label_encoder': label_encoder}, MODEL_PATH)
    print(f"Model artifacts saved to {MODEL_PATH}")

def predict_run_type(run_features: dict) -> str:
    print(f"Predicting for features: {run_features}")
    # Implementation will follow in the next step
    
    if not os.path.exists(MODEL_PATH):
        print(f"Model not found at {MODEL_PATH}. Please train the model first.")
        # Fallback to heuristic if model is not available
        # Create a pandas Series from the dict to use assign_run_type_label
        run_series = pd.Series(run_features)
        return assign_run_type_label(run_series)

    try:
        saved_data = joblib.load(MODEL_PATH)
        model = saved_data['model']
        scaler = saved_data['scaler']
        label_encoder = saved_data['label_encoder']
    except Exception as e:
        print(f"Error loading model artifacts: {e}")
        run_series = pd.Series(run_features)
        return assign_run_type_label(run_series) # Fallback to heuristic

    # Prepare features for prediction
    # Ensure order of features matches training: ['distance', 'time', 'average_speed']
    try:
        features_df = pd.DataFrame([run_features], columns=['distance', 'time', 'average_speed'])
        features_scaled = scaler.transform(features_df)
    except Exception as e:
        print(f"Error preparing features for prediction: {e}")
        run_series = pd.Series(run_features)
        return assign_run_type_label(run_series) # Fallback to heuristic

    # Predict
    try:
        prediction_numerical = model.predict(features_scaled)[0]
        predicted_label = label_encoder.inverse_transform([prediction_numerical])[0]
        return predicted_label
    except Exception as e:
        print(f"Error during prediction: {e}")
        run_series = pd.Series(run_features)
        return assign_run_type_label(run_series) # Fallback to heuristic

if __name__ == "__main__":
    print("Attempting to train model as a standalone script...")
    train_model()
    print("Standalone script execution finished.")
    
    # Example prediction call
    if os.path.exists(MODEL_PATH):
        print("\nExample Prediction:")
        sample_features_easy = {'name': 'Easy morning jog', 'distance': 5.0, 'time': 1800, 'average_speed': 10.0} # Time in seconds
        predicted_type_easy = predict_run_type(sample_features_easy)
        print(f"Predicted run type for Easy Run sample: {predicted_type_easy} (Heuristic: {assign_run_type_label(pd.Series(sample_features_easy))})")

        sample_features_long = {'name': 'Sunday Runday', 'distance': 15.0, 'time': 5400, 'average_speed': 10.0}
        predicted_type_long = predict_run_type(sample_features_long)
        print(f"Predicted run type for Long Run sample: {predicted_type_long} (Heuristic: {assign_run_type_label(pd.Series(sample_features_long))})")

        sample_features_interval = {'name': 'Track intervals', 'distance': 1.0, 'time': 240, 'average_speed': 15.0} # 4 min/km pace
        predicted_type_interval = predict_run_type(sample_features_interval)
        print(f"Predicted run type for Interval sample: {predicted_type_interval} (Heuristic: {assign_run_type_label(pd.Series(sample_features_interval))})")
    else:
        print("\nSkipping example prediction as model was not trained/found.")
