from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from services.ai_service import ai_service
import database, auth, models, crud, schemas
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/ai",
    tags=["ai"],
)

@router.post("/generate-summary")
def generate_summary(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Fetch today's trades for the summary
    today = datetime.utcnow().date()
    # Simple filter for all trades for now to demonstrate functionality, 
    # in prod we would filter by date
    trades = crud.get_trades(db, user_id=current_user.id, limit=20) 
    
    try:
        # Manual serialization to avoid Pydantic validation issues with ORM objects
        trades_data = []
        for t in trades:
            trades_data.append({
                "id": t.id,
                "symbol": t.symbol,
                "pnl": t.pnl,
                "entry_date": t.entry_date.isoformat() if t.entry_date else None,
                "exit_date": t.exit_date.isoformat() if t.exit_date else None,
                "emotions": t.emotions,
                "confidence": t.confidence
            })
        
        summary = ai_service.generate_summary(trades_data)
        return {"summary": summary}
    except Exception as e:
        print(f"AI Error: {e}")
        raise e
