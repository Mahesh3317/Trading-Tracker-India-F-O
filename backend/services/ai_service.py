from typing import List, Dict
import random

class AIService:
    def __init__(self):
        pass

    def generate_summary(self, trades: List[Dict]) -> str:
        """
        Generate a mock AI summary based on trade data.
        In a real implementation, this would call OpenAI/Anthropic API.
        """
        if not trades:
            return "No trades found for today. The market is waiting for your move!"

        # Calculate basic stats for the prompt context
        total_pnl = sum(t.get('pnl', 0) or 0 for t in trades)
        win_count = sum(1 for t in trades if (t.get('pnl', 0) or 0) > 0)
        loss_count = sum(1 for t in trades if (t.get('pnl', 0) or 0) <= 0)
        
        # Mock responses based on P&L
        if total_pnl > 0:
            responses = [
                f"Great job! You're up ₹{total_pnl:.2f} today. Your win rate is looking solid with {win_count} wins. Keep managing your risk and don't get overconfident.",
                f"Green day! You made ₹{total_pnl:.2f}. It seems you followed your plan well. Remember to review your winning trades to understand what worked.",
                f"Excellent execution. Profitable by ₹{total_pnl:.2f}. Your psychology seems stable. Ensure you lock in profits and don't overtrade."
            ]
        elif total_pnl < 0:
            responses = [
                f"Tough day. You're down ₹{abs(total_pnl):.2f}. It happens. Take a break and review your {loss_count} losing trades. Did you follow your rules?",
                f"Red day today (-₹{abs(total_pnl):.2f}). Don't chase losses. Analyze your entries and exits. Was it a strategy failure or execution error?",
                f"Market was choppy for you. Loss: ₹{abs(total_pnl):.2f}. Focus on capital preservation. Tomorrow is another day."
            ]
        else:
            responses = [
                "Breakeven day so far. You're preserving capital, which is key. Waiting for high-probability setups is a skill.",
                "Flat P&L. No major damage. Review your watchlist and stay patient."
            ]
            
        return random.choice(responses)

ai_service = AIService()
