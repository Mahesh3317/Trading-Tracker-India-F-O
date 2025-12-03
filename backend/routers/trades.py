from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, schemas, database, auth, models

router = APIRouter(
    prefix="/trades",
    tags=["trades"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Trade)
def create_trade(trade: schemas.TradeCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_user_trade(db=db, trade=trade, user_id=current_user.id)

@router.get("/", response_model=List[schemas.Trade])
def read_trades(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    trades = crud.get_trades(db, user_id=current_user.id, skip=skip, limit=limit)
    return trades

@router.get("/{trade_id}", response_model=schemas.Trade)
def read_trade(trade_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_trade = crud.get_trade(db, trade_id=trade_id, user_id=current_user.id)
    if db_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")
    return db_trade

@router.put("/{trade_id}", response_model=schemas.Trade)
def update_trade(trade_id: int, trade_update: schemas.TradeUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_trade = crud.update_trade(db, trade_id=trade_id, trade_update=trade_update, user_id=current_user.id)
    if db_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")
    return db_trade

@router.delete("/{trade_id}", response_model=schemas.Trade)
def delete_trade(trade_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_trade = crud.delete_trade(db, trade_id=trade_id, user_id=current_user.id)
    if db_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")
    return db_trade
