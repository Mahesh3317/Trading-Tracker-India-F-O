from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.market_data import market_service
from datetime import datetime, timedelta
import asyncio
import json

router = APIRouter(
    prefix="/market",
    tags=["market"],
)

@router.get("/option-chain/{symbol}")
def get_option_chain(symbol: str):
    # Default to next Thursday expiry for simulation
    today = datetime.now()
    days_ahead = 3 - today.weekday()
    if days_ahead <= 0: 
        days_ahead += 7
    next_thursday = today + timedelta(days=days_ahead)
    
    return market_service.get_option_chain(symbol, next_thursday)

@router.websocket("/ws/{symbol}")
async def websocket_endpoint(websocket: WebSocket, symbol: str):
    await websocket.accept()
    try:
        while True:
            # Simulate real-time updates every second
            today = datetime.now()
            days_ahead = 3 - today.weekday()
            if days_ahead <= 0: 
                days_ahead += 7
            next_thursday = today + timedelta(days=days_ahead)
            
            data = market_service.get_option_chain(symbol, next_thursday)
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print(f"Client disconnected from {symbol}")
