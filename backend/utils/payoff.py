import numpy as np

def calculate_payoff(legs, spot_price=None):
    """
    Calculate payoff diagram coordinates for a multi-leg strategy.
    
    legs: List of dicts with keys:
        - type: 'CE', 'PE', 'FUT'
        - strike: float (for options)
        - side: 'BUY', 'SELL'
        - quantity: int
        - entry_price: float
    
    Returns: List of {'x': price, 'y': pnl}
    """
    if not legs:
        return []

    # Determine range for x-axis
    strikes = [leg['strike'] for leg in legs if leg.get('strike')]
    if not strikes:
        center = spot_price if spot_price else legs[0]['entry_price']
    else:
        center = sum(strikes) / len(strikes)
        
    lower_bound = center * 0.8
    upper_bound = center * 1.2
    
    prices = np.linspace(lower_bound, upper_bound, 100)
    payoff = []

    for price in prices:
        total_pnl = 0
        for leg in legs:
            qty = leg['quantity']
            side = 1 if leg['side'] == 'BUY' else -1
            entry = leg['entry_price']
            
            if leg['type'] == 'FUT':
                pnl = (price - entry) * qty * side
            elif leg['type'] == 'CE':
                strike = leg['strike']
                intrinsic = max(0, price - strike)
                pnl = (intrinsic - entry) * qty * side
            elif leg['type'] == 'PE':
                strike = leg['strike']
                intrinsic = max(0, strike - price)
                pnl = (intrinsic - entry) * qty * side
            
            total_pnl += pnl
            
        payoff.append({'x': round(price, 2), 'y': round(total_pnl, 2)})
        
    return payoff
