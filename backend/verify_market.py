import requests
import json
import asyncio
import websockets

BASE_URL = "http://localhost:8000"
WS_URL = "ws://localhost:8000"

def verify_rest():
    print("Verifying REST Endpoint...")
    try:
        resp = requests.get(f"{BASE_URL}/market/option-chain/NIFTY")
        if resp.status_code == 200:
            data = resp.json()
            print(f"REST Success: Spot {data['spot_price']}, Strikes: {len(data['strikes'])}")
            print(f"Sample Strike: {data['strikes'][0]['strike_price']}")
            print(f"Sample CE Delta: {data['strikes'][0]['ce']['delta']}")
        else:
            print(f"REST Failed: {resp.text}")
    except Exception as e:
        print(f"REST Error: {e}")

async def verify_ws():
    print("Verifying WebSocket...")
    try:
        async with websockets.connect(f"{WS_URL}/market/ws/NIFTY") as websocket:
            msg = await websocket.recv()
            data = json.loads(msg)
            print(f"WS Success: Received update for {data['symbol']} Spot {data['spot_price']}")
    except Exception as e:
        print(f"WS Error: {e}")

if __name__ == "__main__":
    verify_rest()
    asyncio.run(verify_ws())
