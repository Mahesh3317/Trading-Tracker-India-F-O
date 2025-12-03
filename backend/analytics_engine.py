from sqlalchemy.orm import Session
from models import Trade
from typing import List, Dict
from datetime import datetime
import pandas as pd

def calculate_kpis(trades: List[Trade]) -> Dict:
    if not trades:
        return {
            "total_pnl": 0,
            "win_rate": 0,
            "profit_factor": 0,
            "total_trades": 0,
            "avg_win": 0,
            "avg_loss": 0
        }

    df = pd.DataFrame([t.__dict__ for t in trades])
    
    # Ensure pnl is numeric
    df['pnl'] = pd.to_numeric(df['pnl'], errors='coerce').fillna(0)
    
    total_trades = len(df)
    winning_trades = df[df['pnl'] > 0]
    losing_trades = df[df['pnl'] <= 0]
    
    total_pnl = df['pnl'].sum()
    win_rate = (len(winning_trades) / total_trades) * 100 if total_trades > 0 else 0
    
    gross_profit = winning_trades['pnl'].sum()
    gross_loss = abs(losing_trades['pnl'].sum())
    
    if gross_loss > 0:
        profit_factor = gross_profit / gross_loss
    else:
        profit_factor = gross_profit if gross_profit > 0 else 0 # Return gross profit or 0 if no loss
    
    avg_win = winning_trades['pnl'].mean() if not winning_trades.empty else 0
    avg_loss = losing_trades['pnl'].mean() if not losing_trades.empty else 0
    
    return {
        "total_pnl": round(total_pnl, 2),
        "win_rate": round(win_rate, 2),
        "profit_factor": round(profit_factor, 2),
        "total_trades": total_trades,
        "avg_win": round(avg_win, 2),
        "avg_loss": round(avg_loss, 2)
    }

def calculate_equity_curve(trades: List[Trade]) -> List[Dict]:
    if not trades:
        return []
        
    df = pd.DataFrame([t.__dict__ for t in trades])
    df['exit_date'] = pd.to_datetime(df['exit_date'])
    df['pnl'] = pd.to_numeric(df['pnl'], errors='coerce').fillna(0)
    
    # Filter closed trades only
    closed_trades = df.dropna(subset=['exit_date']).sort_values('exit_date')
    
    if closed_trades.empty:
        return []

    closed_trades['cumulative_pnl'] = closed_trades['pnl'].cumsum()
    
    equity_curve = []
    for _, row in closed_trades.iterrows():
        equity_curve.append({
            "date": row['exit_date'].strftime('%Y-%m-%d'),
            "value": row['cumulative_pnl']
        })
        
    return equity_curve
