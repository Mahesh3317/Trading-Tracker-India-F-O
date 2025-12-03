import requests
import json

BASE_URL = "http://localhost:8000"
EMAIL = "strategy_test@example.com"
PASSWORD = "password123"

def verify_strategy():
    # 0. Register
    print("Registering...")
    requests.post(f"{BASE_URL}/register", json={"email": EMAIL, "password": PASSWORD})

    # 1. Login
    print("Logging in...")
    resp = requests.post(f"{BASE_URL}/token", data={"username": EMAIL, "password": PASSWORD})
    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        return
    
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful")

    # 2. Test Payoff Calculation (No Auth needed strictly, but good to test)
    print("Testing Payoff Calculation...")
    legs = [
        {"type": "CE", "strike": 21500, "side": "BUY", "quantity": 50, "entry_price": 100},
        {"type": "CE", "strike": 21600, "side": "SELL", "quantity": 50, "entry_price": 60}
    ]
    resp = requests.post(f"{BASE_URL}/strategies/payoff", json=legs, headers=headers)
    if resp.status_code == 200:
        payoff = resp.json()
        print(f"Payoff calculated. Points: {len(payoff)}")
        print(f"Sample Point: {payoff[50]}")
    else:
        print(f"Payoff calculation failed: {resp.text}")

    # 3. Create Strategy
    print("Creating Strategy...")
    strategy_data = {
        "name": "Bull Call Spread",
        "description": "Long 21500 CE, Short 21600 CE",
        "legs": json.dumps(legs)
    }
    resp = requests.post(f"{BASE_URL}/strategies/", json=strategy_data, headers=headers)
    if resp.status_code == 200:
        print("Strategy created successfully")
        strategy_id = resp.json()["id"]
    else:
        print(f"Strategy creation failed: {resp.text}")
        return

    # 4. Get Strategies
    print("Fetching Strategies...")
    resp = requests.get(f"{BASE_URL}/strategies/", headers=headers)
    if resp.status_code == 200:
        strategies = resp.json()
        print(f"Found {len(strategies)} strategies")
    else:
        print(f"Fetch strategies failed: {resp.text}")

    # 5. Capital Transaction
    print("Adding Capital Deposit...")
    cap_data = {
        "date": "2024-01-01T10:00:00",
        "type": "DEPOSIT",
        "amount": 100000,
        "notes": "Initial Capital"
    }
    resp = requests.post(f"{BASE_URL}/capital/", json=cap_data, headers=headers)
    if resp.status_code == 200:
        print("Deposit successful")
    else:
        print(f"Deposit failed: {resp.text}")

    # 6. Capital Summary
    print("Fetching Capital Summary...")
    resp = requests.get(f"{BASE_URL}/capital/summary", headers=headers)
    if resp.status_code == 200:
        summary = resp.json()
        print(f"Capital Summary: {summary}")
    else:
        print(f"Capital Summary failed: {resp.text}")

if __name__ == "__main__":
    verify_strategy()
