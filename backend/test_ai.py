import urllib.request
import urllib.error
import json

def test_ai():
    # Login
    req = urllib.request.Request(
        "http://localhost:8000/api/v1/auth/login",
        data=json.dumps({"email": "admin@gmail.com", "password": "qwertyuiop"}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            resp_data = json.loads(response.read().decode())
            token = resp_data["data"]["access_token"]
            print("Logged in successfully.")
    except urllib.error.HTTPError as e:
        print("Login failed:", e.code, e.read().decode())
        return

    # Chat
    req = urllib.request.Request(
        "http://localhost:8000/api/v1/copilot/chat",
        data=json.dumps({"message": "Hello copilot"}).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}'
        }
    )
    try:
        with urllib.request.urlopen(req) as response:
            print("Chat status:", response.code)
            print("Chat response:", response.read().decode())
    except urllib.error.HTTPError as e:
        print("Chat failed:", e.code, e.read().decode())

if __name__ == "__main__":
    test_ai()
