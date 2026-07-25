import json
import urllib.request
import urllib.error

payload = {
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "secret123",
    "department": "Traffic",
    "phone": "9876543210",
    "role": "citizen"
}

data = json.dumps(payload).encode("utf-8")
req = urllib.request.Request(
    "http://localhost:8082/api/auth/register",
    data=data,
    headers={"Content-Type": "application/json"},
    method="POST"
)

try:
    with urllib.request.urlopen(req, timeout=30) as r:
        print("STATUS", r.status)
        print(r.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print("HTTP", e.code)
    print(e.read().decode("utf-8"))
except Exception as e:
    print("ERR", repr(e))
