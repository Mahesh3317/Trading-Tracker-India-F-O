from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class TradeBase(BaseModel):
    symbol: str
    instrument_type: str # FUT, OPT, EQ
    expiry_date: Optional[datetime] = None
    strike_price: Optional[float] = None
    option_type: Optional[str] = None # CE, PE
    side: str # BUY, SELL
    quantity: int
    entry_price: float
    entry_date: Optional[datetime] = None
    notes: Optional[str] = None
    emotions: Optional[str] = None
    confidence: Optional[int] = None

class TradeCreate(TradeBase):
    pass

class TradeUpdate(BaseModel):
    exit_price: float
    exit_date: Optional[datetime] = None
    fees: Optional[float] = 0.0
    pnl: Optional[float] = None
    emotions: Optional[str] = None
    confidence: Optional[int] = None

class Trade(TradeBase):
    id: int
    exit_price: Optional[float] = None
    exit_date: Optional[datetime] = None
    fees: float
    pnl: Optional[float] = None
    emotions: Optional[str] = None
    confidence: Optional[int] = None
    owner_id: int

    class Config:
        from_attributes = True

class StrategyBase(BaseModel):
    name: str
    description: Optional[str] = None
    legs: str # JSON string

class StrategyCreate(StrategyBase):
    pass

class Strategy(StrategyBase):
    id: int
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True

class CapitalTransactionBase(BaseModel):
    date: datetime
    type: str # DEPOSIT, WITHDRAWAL
    amount: float
    notes: Optional[str] = None

class CapitalTransactionCreate(CapitalTransactionBase):
    pass

class CapitalTransaction(CapitalTransactionBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True
