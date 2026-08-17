import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

db_url = settings.DATABASE_URL
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

connect_args = {}

# Test PostgreSQL connection; if it fails, auto-fallback to local SQLite
if db_url and "postgres" in db_url:
    try:
        # Short timeout test engine
        test_engine = create_engine(db_url, pool_pre_ping=True, connect_args={"connect_timeout": 5})
        with test_engine.connect() as conn:
            pass
        engine = test_engine
    except Exception as e:
        print(f"\n[DATABASE WARNING]: PostgreSQL connection failed: {e}. Falling back to SQLite database: sqlite:///./loancraft.db")
        db_url = "sqlite:///./loancraft.db"
        connect_args = {"check_same_thread": False}
        engine = create_engine(db_url, connect_args=connect_args)
else:
    if db_url and "sqlite" in db_url:
        connect_args = {"check_same_thread": False}
    engine = create_engine(db_url or "sqlite:///./loancraft.db", connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
