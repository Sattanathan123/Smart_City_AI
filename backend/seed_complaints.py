import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:8082/api"

def post(url, data_dict):
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data_dict).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read().decode("utf-8"))
    except Exception as e:
        print(f"Error: {e}")
        return None

sample_complaints = [
    {
        "userId": 1,
        "userName": "Anita Desai",
        "category": "Water",
        "description": "Major pipeline leakage spilling onto arterial road causing heavy traffic backlog near Zone 5 intersection.",
        "zone": "Zone 5",
        "imageUrl": "water_leakage_evidence.jpg"
    },
    {
        "userId": 1,
        "userName": "Anita Desai",
        "category": "Road",
        "description": "Deep potholes causing vehicle damage near Zone 1 flyover exit.",
        "zone": "Zone 1",
        "imageUrl": "road_pothole_video.mp4"
    },
    {
        "userId": 1,
        "userName": "Anita Desai",
        "category": "Electricity",
        "description": "Multiple streetlights non-functional near sector 4 park.",
        "zone": "Zone 2",
        "imageUrl": None
    },
    {
        "userId": 1,
        "userName": "Anita Desai",
        "category": "Waste Management",
        "description": "Uncollected waste bins causing foul smell near commercial market.",
        "zone": "Zone 3",
        "imageUrl": "garbage_overflow.png"
    }
]

print("--> Seeding Initial Citizen Complaints...")
for c in sample_complaints:
    res = post(f"{BASE_URL}/complaints", c)
    if res:
        print(f"  [OK] Created Complaint #{res.get('id')} - {res.get('category')} ({res.get('zone')})")
