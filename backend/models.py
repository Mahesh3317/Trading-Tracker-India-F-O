from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    trades = relationship("Trade", back_populates="owner")

class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    instrument_type = Column(String) # FUT, OPT, EQ
    expiry_date = Column(DateTime, nullable=True)
    strike_price = Column(Float, nullable=True)
    option_type = Column(String, nullable=True) # CE, PE
    side = Column(String) # BUY, SELL
    
    entry_date = Column(DateTime, default=datetime.datetime.utcnow)
    exit_date = Column(DateTime, nullable=True)
    
    quantity = Column(Integer)
    entry_price = Column(Float)
    exit_price = Column(Float, nullable=True)
    
    fees = Column(Float, default=0.0)
    pnl = Column(Float, nullable=True)
    notes = Column(String, nullable=True)
    
    # Psychology
    emotions = Column(String, nullable=True) # Comma-separated string
    confidence = Column(Integer, nullable=True) # 1-10
    
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="trades")

class Strategy(Base):
    __tablename__ = "strategies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    legs = Column(String) # JSON string storing list of legs
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="strategies")

class CapitalTransaction(Base):
    __tablename__ = "capital_transactions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    type = Column(String) # DEPOSIT, WITHDRAWAL
    amount = Column(Float)
    notes = Column(String, nullable=True)
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="capital_transactions")

User.strategies = relationship("Strategy", back_populates="owner")
User.capital_transactions = relationship("CapitalTransaction", back_populates="owner")
