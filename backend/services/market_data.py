import random
from datetime import datetime, timedelta
from utils.greeks import calculate_greeks, RISK_FREE_RATE

class MarketDataService:
    def __init__(self):
        self.spot_price = 21500.0
        self.volatility = 0.15 # 15% IV
        
    def get_option_chain(self, symbol: str, expiry_date: datetime):
        """
        Generate a simulated Option Chain centered around the current spot price.
        """
        # Simulate small spot price movement
        self.spot_price += random.uniform(-5, 5)
        
        # Time to expiry in years
        time_to_expiry = (expiry_date - datetime.now()).days / 365.0
        if time_to_expiry < 0:
            time_to_expiry = 0.001 # Avoid division by zero
            
        strikes = []
        center_strike = round(self.spot_price / 50) * 50
        
        # Generate 10 strikes above and below
        for i in range(-10, 11):
            strike_price = center_strike + (i * 50)
            
            # Call Greeks
            ce_greeks = calculate_greeks(
                self.spot_price, strike_price, time_to_expiry, RISK_FREE_RATE, self.volatility, "CE"
            )
            
            # Put Greeks
            pe_greeks = calculate_greeks(
                self.spot_price, strike_price, time_to_expiry, RISK_FREE_RATE, self.volatility, "PE"
            )
            
            strikes.append({
                "strike_price": strike_price,
                "ce": {
                    "ltp": ce_greeks["price"],
                    "oi": random.randint(1000, 100000),
                    "volume": random.randint(500, 50000),
                    **ce_greeks
                },
                "pe": {
                    "ltp": pe_greeks["price"],
                    "oi": random.randint(1000, 100000),
                    "volume": random.randint(500, 50000),
                    **pe_greeks
                }
            })
            
        return {
            "symbol": symbol,
            "spot_price": round(self.spot_price, 2),
            "timestamp": datetime.now().isoformat(),
            "strikes": strikes
        }

market_service = MarketDataService()
