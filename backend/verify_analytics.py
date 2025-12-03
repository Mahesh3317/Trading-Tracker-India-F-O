import requests

BASE_URL = "http://localhost:8000"
EMAIL = "verify@example.com"
PASSWORD = "password123"

def verify():
    # 1. Login
    print("Logging in...")
    resp = requests.post(f"{BASE_URL}/token", data={"username": EMAIL, "password": PASSWORD})
    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        return
    
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful")

    # 2. Get KPIs
    print("Fetching KPIs...")
    resp = requests.get(f"{BASE_URL}/analytics/kpis", headers=headers)
    if resp.status_code == 200:
        print("KPIs:", resp.json())
    else:
        print(f"KPI fetch failed: {resp.text}")

    # 3. Get Equity Curve
    print("Fetching Equity Curve...")
    resp = requests.get(f"{BASE_URL}/analytics/equity-curve", headers=headers)
    if resp.status_code == 200:
        print("Equity Curve Points:", len(resp.json()))
        print(resp.json())
    else:
        print(f"Equity Curve fetch failed: {resp.text}")

if __name__ == "__main__":
    verify()
