from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Float, Enum as SQLAlchemyEnum
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class RunStatus(str, enum.Enum):
    PLANNED = "planned"
    COMPLETED = "completed"
    # Add other statuses if needed in the future, e.g., CANCELED

class Run(Base):
    __tablename__ = "runs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    copied_from = Column(Integer, ForeignKey("runs.id"), nullable=True)
    settings_snapshot = Column(JSON)
    distance = Column(Float, nullable=True)
    time = Column(Integer, nullable=True) # Assuming in seconds
    average_speed = Column(Float, nullable=True)
    heart_rate = Column(Integer, nullable=True)
    status = Column(SQLAlchemyEnum(RunStatus), default=RunStatus.COMPLETED, nullable=False) # New field


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class StravaHeartRateZoneCache(Base):
    __tablename__ = "strava_heart_rate_zone_cache"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    data = Column(JSON, nullable=False)
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())


class StravaStatsCache(Base):
    __tablename__ = "strava_stats_cache"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    data = Column(JSON, nullable=False)
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())


class StravaActivitiesCache(Base):
    __tablename__ = "strava_activities_cache"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    data = Column(JSON, nullable=False)
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())

