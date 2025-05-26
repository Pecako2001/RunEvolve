import random
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

# Use relative imports for running as a module within the 'app' package
from models import Run, Base
from database import SessionLocal, engine


RUN_NAMES = ["Morning Run", "Evening Jog", "Lunch Break Run", "Weekend Long Run", "Trail Adventure", "Speed Work"]
SHOE_BRANDS = ["Nike", "Adidas", "Brooks", "Saucony", "Asics", "New Balance", "Hoka"]
WEATHER_CONDITIONS = ["Sunny", "Cloudy", "Rainy", "Windy", "Clear Night", "Overcast"]

def generate_mock_runs(db: Session, num_runs: int):
    """Generates and adds mock run data to the database."""
    run_types = ["Interval", "Long Run", "Tempo Run", "Easy/Recovery Run"]
    run_counts = {rt: 0 for rt in run_types}
    
    # First, generate the initial num_runs
    for i in range(num_runs):
        name = random.choice(RUN_NAMES)
        distance_km = random.uniform(1.0, 20.0)
        time_sec = random.randint(300, 7200)  # 5 mins to 2 hours
        
        if time_sec > 0:
            average_speed_kph = (distance_km / (time_sec / 3600.0))
        else:
            average_speed_kph = 0.0
            
        heart_rate_bpm = random.randint(100, 180)
        
        # Generate a random datetime in the last year
        days_ago = random.randint(0, 365)
        hours_ago = random.randint(0, 23)
        minutes_ago = random.randint(0, 59)
        created_at_dt = datetime.now() - timedelta(days=days_ago, hours=hours_ago, minutes=minutes_ago)
        
        settings_snapshot_data = {
            "shoe": random.choice(SHOE_BRANDS),
            "weather": random.choice(WEATHER_CONDITIONS),
            "notes": f"Mock run #{i+1}"
        }
        
        run_instance = Run(
            name=name,
            distance=round(distance_km, 2),
            time=time_sec,
            average_speed=round(average_speed_kph, 2),
            heart_rate=heart_rate_bpm,
            created_at=created_at_dt,
            settings_snapshot=settings_snapshot_data
        )
        db.add(run_instance)
        
        # Determine run type based on the same logic as in ai_model.py
        if "interval" in name.lower() or (distance_km < 3 and average_speed_kph > 12):
            run_type = "Interval"
        elif distance_km > 10:
            run_type = "Long Run"
        elif 5 <= distance_km <= 10 and 10 <= average_speed_kph <= 12:
            run_type = "Tempo Run"
        else:
            run_type = "Easy/Recovery Run"
        run_counts[run_type] += 1
    
    # Ensure each run type has at least 2 samples
    for rt in run_types:
        while run_counts[rt] < 2:
            # Generate an additional run for this type
            if rt == "Interval":
                distance_km = random.uniform(1.0, 3.0)
                avg_speed = random.uniform(12.1, 15.0)
            elif rt == "Long Run":
                distance_km = random.uniform(10.1, 20.0)
                avg_speed = random.uniform(8.0, 12.0)
            elif rt == "Tempo Run":
                distance_km = random.uniform(5.0, 10.0)
                avg_speed = random.uniform(10.0, 12.0)
            else:  # Easy/Recovery Run
                distance_km = random.uniform(3.0, 5.0)
                avg_speed = random.uniform(8.0, 10.0)
            
            time_sec = int((distance_km / avg_speed) * 3600)
            heart_rate_bpm = random.randint(100, 180)
            days_ago = random.randint(0, 365)
            hours_ago = random.randint(0, 23)
            minutes_ago = random.randint(0, 59)
            created_at_dt = datetime.now() - timedelta(days=days_ago, hours=hours_ago, minutes=minutes_ago)
            
            settings_snapshot_data = {
                "shoe": random.choice(SHOE_BRANDS),
                "weather": random.choice(WEATHER_CONDITIONS),
                "notes": f"Additional {rt} run"
            }
            
            run_instance = Run(
                name=f"Additional {rt} Run",
                distance=round(distance_km, 2),
                time=time_sec,
                average_speed=round(avg_speed, 2),
                heart_rate=heart_rate_bpm,
                created_at=created_at_dt,
                settings_snapshot=settings_snapshot_data
            )
            db.add(run_instance)
            run_counts[rt] += 1
    
    db.commit()
    print(f"Successfully added {num_runs} initial mock runs plus additional runs to ensure at least 2 samples per run type.")

def main():
    """Main function to set up DB and generate mock data."""
    print("Creating database tables if they don't exist...")
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    print("Tables created (or already exist).")

    db = SessionLocal()
    try:
        print("Generating mock runs...")
        generate_mock_runs(db, num_runs=50)
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()  # Rollback in case of error
    finally:
        db.close()
        print("Database session closed.")

if __name__ == "__main__":
    main()
