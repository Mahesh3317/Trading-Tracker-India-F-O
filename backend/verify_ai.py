import requests

BASE_URL = "http://localhost:8000"
EMAIL = "verify@example.com"
PASSWORD = "password123"

def verify_ai():
    # 0. Register (ignore if exists)
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

    # 1.5 Create a Dummy Trade
    print("Creating dummy trade...")
    trade_data = {
        "symbol": "NIFTY",
        "instrument_type": "OPT",
        "side": "BUY",
        "quantity": 50,
        "entry_price": 100.0,
        "emotions": "Confident",
        "confidence": 8
    }
    resp = requests.post(f"{BASE_URL}/trades/", json=trade_data, headers=headers)
    if resp.status_code == 200:
        print("Trade created successfully")
    else:
        print(f"Trade creation failed: {resp.text}")

    # 2. Generate Summary
    print("Generating AI Summary...")
    resp = requests.post(f"{BASE_URL}/ai/generate-summary", headers=headers)
    if resp.status_code == 200:
        print("AI Summary:", resp.json()["summary"])
    else:
        print(f"AI Summary failed: {resp.text}")

if __name__ == "__main__":
    verify_ai()
