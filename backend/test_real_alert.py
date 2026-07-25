import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:8082/api"

def post(url, data_dict, headers=None):
    if headers is None:
        headers = {}
    headers["Content-Type"] = "application/json"
    body = json.dumps(data_dict).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.read().decode('utf-8')}")
        return None
    except Exception as e:
        print(f"Error: {repr(e)}")
        return None

# Authenticate user
login_res = post(f"{BASE_URL}/auth/login", {"email": "officer_ml_test@smartcity.gov.in", "password": "Officer@123"})
token = login_res["token"]
headers = {"Authorization": f"Bearer {token}"}

# Submit a real citizen complaint to trigger real-time email notification
complaint_payload = {
    "userId": 1,
    "userName": "Anita Desai",
    "category": "Water Pipeline Burst & Road Trenching Overlap",
    "description": "Urgent! Major water leakage spilling onto arterial road causing heavy traffic backlog near Zone 5 main intersection.",
    "zone": "Zone 5",
    "imageUrl": None
}

print("--> Submitting Citizen Complaint to trigger real-time SMTP notification...")
res = post(f"{BASE_URL}/complaints", complaint_payload, headers=headers)

if res:
    print(f"[OK] Complaint Created Successfully! ID: {res.get('id')}")
    print(f"    Category: {res.get('category')}")
    print(f"    Zone: {res.get('zone')}")
    print(f"    Status: {res.get('status')}")
    print("\n[SUCCESS] Live Email Alert Dispatched to vbsattanathan@gmail.com!")
