from sqlalchemy.orm import Session
import models, schemas
from datetime import datetime

def get_trades(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Trade).filter(models.Trade.owner_id == user_id).offset(skip).limit(limit).all()

def create_user_trade(db: Session, trade: schemas.TradeCreate, user_id: int):
    db_trade = models.Trade(**trade.dict(), owner_id=user_id)
    db.add(db_trade)
    db.commit()
    db.refresh(db_trade)
    return db_trade

def get_trade(db: Session, trade_id: int, user_id: int):
    return db.query(models.Trade).filter(models.Trade.id == trade_id, models.Trade.owner_id == user_id).first()

def update_trade(db: Session, trade_id: int, trade_update: schemas.TradeUpdate, user_id: int):
    db_trade = get_trade(db, trade_id, user_id)
    if not db_trade:
        return None
    
    update_data = trade_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_trade, key, value)
    
    # Auto-calculate P&L if exit price is provided
    if db_trade.exit_price is not None and db_trade.entry_price is not None:
        multiplier = 1 if db_trade.side == "BUY" else -1
        gross_pnl = (db_trade.exit_price - db_trade.entry_price) * db_trade.quantity * multiplier
        db_trade.pnl = gross_pnl - (db_trade.fees or 0)
        
    db.commit()
    db.refresh(db_trade)
    return db_trade

    return db_trade

def delete_trade(db: Session, trade_id: int, user_id: int):
    db_trade = get_trade(db, trade_id, user_id)
    if db_trade:
        db.delete(db_trade)
        db.commit()
    return db_trade

# Strategy CRUD
def get_strategies(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Strategy).filter(models.Strategy.owner_id == user_id).offset(skip).limit(limit).all()

def create_strategy(db: Session, strategy: schemas.StrategyCreate, user_id: int):
    db_strategy = models.Strategy(**strategy.dict(), owner_id=user_id)
    db.add(db_strategy)
    db.commit()
    db.refresh(db_strategy)
    return db_strategy

def get_strategy(db: Session, strategy_id: int, user_id: int):
    return db.query(models.Strategy).filter(models.Strategy.id == strategy_id, models.Strategy.owner_id == user_id).first()

def delete_strategy(db: Session, strategy_id: int, user_id: int):
    db_strategy = get_strategy(db, strategy_id, user_id)
    if db_strategy:
        db.delete(db_strategy)
        db.commit()
    return db_strategy

# Capital CRUD
def get_capital_transactions(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.CapitalTransaction).filter(models.CapitalTransaction.owner_id == user_id).order_by(models.CapitalTransaction.date.desc()).offset(skip).limit(limit).all()

def create_capital_transaction(db: Session, transaction: schemas.CapitalTransactionCreate, user_id: int):
    db_transaction = models.CapitalTransaction(**transaction.dict(), owner_id=user_id)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction
