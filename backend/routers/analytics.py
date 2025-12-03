from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import database, auth, models, crud, analytics_engine

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"],
    responses={404: {"description": "Not found"}},
)

@router.get("/kpis")
def get_kpis(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    trades = crud.get_trades(db, user_id=current_user.id, limit=10000) # Fetch all trades
    return analytics_engine.calculate_kpis(trades)

@router.get("/equity-curve")
def get_equity_curve(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    trades = crud.get_trades(db, user_id=current_user.id, limit=10000)
    return analytics_engine.calculate_equity_curve(trades)
