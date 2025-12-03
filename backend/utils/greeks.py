import numpy as np
from scipy.stats import norm
from datetime import datetime

# Risk-free rate (approximate for India)
RISK_FREE_RATE = 0.07

def calculate_greeks(S, K, T, r, sigma, option_type):
    """
    Calculate Greeks for a European option using Black-Scholes model.
    
    S: Spot Price
    K: Strike Price
    T: Time to Expiry (in years)
    r: Risk-free interest rate
    sigma: Volatility (IV)
    option_type: 'CE' (Call) or 'PE' (Put)
    """
    
    if T <= 0:
        return {
            "delta": 0,
            "gamma": 0,
            "theta": 0,
            "vega": 0,
            "price": max(0, S - K) if option_type == "CE" else max(0, K - S)
        }

    d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    
    if option_type == "CE":
        price = S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
        delta = norm.cdf(d1)
        theta = (- (S * norm.pdf(d1) * sigma) / (2 * np.sqrt(T)) - r * K * np.exp(-r * T) * norm.cdf(d2)) / 365
    else:
        price = K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
        delta = norm.cdf(d1) - 1
        theta = (- (S * norm.pdf(d1) * sigma) / (2 * np.sqrt(T)) + r * K * np.exp(-r * T) * norm.cdf(-d2)) / 365

    gamma = norm.pdf(d1) / (S * sigma * np.sqrt(T))
    vega = (S * norm.pdf(d1) * np.sqrt(T)) / 100 # Vega per 1% change in IV

    return {
        "price": round(price, 2),
        "delta": round(delta, 2),
        "gamma": round(gamma, 4),
        "theta": round(theta, 2),
        "vega": round(vega, 2)
    }
