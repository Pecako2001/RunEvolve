from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey
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
