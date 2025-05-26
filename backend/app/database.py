from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# We will import Base from models.py when needed, or it can be defined here
# and imported into models.py if that structure is preferred later.

SQLALCHEMY_DATABASE_URL = "postgresql://user:password@db/appdb"  # Placeholder for Docker Compose

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
