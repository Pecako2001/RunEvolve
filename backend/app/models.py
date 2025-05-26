from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Run(Base):
    __tablename__ = "runs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    copied_from = Column(Integer, ForeignKey("runs.id"), nullable=True)
    settings_snapshot = Column(JSON)
    distance = Column(Float, nullable=True)
    time = Column(Integer, nullable=True)
    average_speed = Column(Float, nullable=True)
    heart_rate = Column(Integer, nullable=True)
