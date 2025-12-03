import requests

BASE_URL = "http://localhost:8000"
EMAIL = "verify@example.com"
PASSWORD = "password123"

def verify():
    # 1. Register
    print("Registering...")
    try:
        resp = requests.post(f"{BASE_URL}/register", json={"email": EMAIL, "password": PASSWORD})
        if resp.status_code == 200:
            print("Registration successful")
        elif resp.status_code == 400 and "already registered" in resp.text:
            print("User already registered")
        else:
            print(f"Registration failed: {resp.text}")
            return
    except Exception as e:
        print(f"Connection failed: {e}")
        return

    # 2. Login
    print("Logging in...")
    resp = requests.post(f"{BASE_URL}/token", data={"username": EMAIL, "password": PASSWORD})
    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        return
    
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful")

    # 3. Create Trade
    print("Creating Trade...")
    trade_data = {
        "symbol": "NIFTY",
        "instrument_type": "OPT",
        "side": "BUY",
        "quantity": 50,
        "entry_price": 100.0,
        "entry_date": "2023-10-27T10:00:00",
        "strike_price": 19000,
        "option_type": "CE",
        "expiry_date": "2023-10-26T15:30:00"
    }
    resp = requests.post(f"{BASE_URL}/trades/", json=trade_data, headers=headers)
    if resp.status_code == 200:
        print("Trade created successfully")
        print(resp.json())
    else:
        print(f"Trade creation failed: {resp.text}")
        return

    # 4. Get Trades
    print("Fetching Trades...")
    resp = requests.get(f"{BASE_URL}/trades/", headers=headers)
    if resp.status_code == 200:
        trades = resp.json()
        print(f"Found {len(trades)} trades")
    else:
        print(f"Fetch failed: {resp.text}")

if __name__ == "__main__":
    verify()
