from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import database, auth, models, crud, schemas

router = APIRouter(
    prefix="/capital",
    tags=["capital"],
)

@router.get("/", response_model=List[schemas.CapitalTransaction])
def read_capital_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    transactions = crud.get_capital_transactions(db, user_id=current_user.id, skip=skip, limit=limit)
    return transactions

@router.post("/", response_model=schemas.CapitalTransaction)
def create_capital_transaction(transaction: schemas.CapitalTransactionCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_capital_transaction(db=db, transaction=transaction, user_id=current_user.id)

@router.get("/summary")
def get_capital_summary(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    transactions = crud.get_capital_transactions(db, user_id=current_user.id, limit=1000)
    
    total_deposits = sum(t.amount for t in transactions if t.type == "DEPOSIT")
    total_withdrawals = sum(t.amount for t in transactions if t.type == "WITHDRAWAL")
    net_capital = total_deposits - total_withdrawals
    
    # Calculate realized P&L from trades
    trades = crud.get_trades(db, user_id=current_user.id, limit=1000)
    realized_pnl = sum((t.pnl or 0) for t in trades)
    
    current_balance = net_capital + realized_pnl
    roi = (realized_pnl / net_capital * 100) if net_capital > 0 else 0
    
    return {
        "total_deposits": total_deposits,
        "total_withdrawals": total_withdrawals,
        "net_capital": net_capital,
        "realized_pnl": realized_pnl,
        "current_balance": current_balance,
        "roi": round(roi, 2)
    }
