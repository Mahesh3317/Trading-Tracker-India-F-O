from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import database, auth, models, crud, schemas
from utils.payoff import calculate_payoff
import json

router = APIRouter(
    prefix="/strategies",
    tags=["strategies"],
)

@router.get("/", response_model=List[schemas.Strategy])
def read_strategies(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    strategies = crud.get_strategies(db, user_id=current_user.id, skip=skip, limit=limit)
    return strategies

@router.post("/", response_model=schemas.Strategy)
def create_strategy(strategy: schemas.StrategyCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_strategy(db=db, strategy=strategy, user_id=current_user.id)

@router.get("/{strategy_id}", response_model=schemas.Strategy)
def read_strategy(strategy_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_strategy = crud.get_strategy(db, strategy_id=strategy_id, user_id=current_user.id)
    if db_strategy is None:
        raise HTTPException(status_code=404, detail="Strategy not found")
    return db_strategy

@router.delete("/{strategy_id}", response_model=schemas.Strategy)
def delete_strategy(strategy_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_strategy = crud.delete_strategy(db, strategy_id=strategy_id, user_id=current_user.id)
    if db_strategy is None:
        raise HTTPException(status_code=404, detail="Strategy not found")
    return db_strategy

@router.post("/payoff")
def get_payoff(legs: List[dict]):
    """
    Calculate payoff diagram for a given set of legs (not necessarily saved).
    """
    return calculate_payoff(legs)
