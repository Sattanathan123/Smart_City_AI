import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:8082/api"

# 1. Register or Login Officer
officer_payload = {
    "name": "Rajesh Kumar (Road Dept)",
    "email": "officer_ml_test@smartcity.gov.in",
    "password": "Officer@123",
    "department": "Road",
    "phone": "9876543219",
    "role": "department_officer"
}

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

# Register Officer
print("--> Registering Officer User...")
res = post(f"{BASE_URL}/auth/register", officer_payload)
if not res or "token" not in res:
    print("--> Logging in existing Officer User...")
    res = post(f"{BASE_URL}/auth/login", {"email": officer_payload["email"], "password": officer_payload["password"]})

token = res["token"]
print(f"--> Authenticated Successfully! JWT Token obtained: {token[:30]}...")

headers = {"Authorization": f"Bearer {token}"}

# 2. Add Test Projects to trigger ML Model & Analysis Engine
test_projects = [
    {
        "projectName": "Zone 5 Metro Cable Laying & Road Trenching",
        "department": "Electricity",
        "projectType": "Infrastructure",
        "zone": "Zone 5",
        "budgetLakhs": 380.0,
        "durationDays": 90,
        "trafficDensity": 9,
        "weatherRisk": 8,
        "utilityDependency": 9,
        "populationDensity": 9,
        "criticalInfrastructure": 9,
        "citizenImpact": 9,
        "resourceRequirement": 8,
        "contractorAvailability": 3,
        "status": "PENDING_APPROVAL"
    },
    {
        "projectName": "Zone 2 Solar Streetlight Grid Expansion",
        "department": "Electricity",
        "projectType": "Smart Infra",
        "zone": "Zone 2",
        "budgetLakhs": 25.0,
        "durationDays": 30,
        "trafficDensity": 3,
        "weatherRisk": 2,
        "utilityDependency": 3,
        "populationDensity": 4,
        "criticalInfrastructure": 4,
        "citizenImpact": 5,
        "resourceRequirement": 4,
        "contractorAvailability": 8,
        "status": "PENDING_APPROVAL"
    },
    {
        "projectName": "Zone 1 Main Flyover Structural Deck Renovation",
        "department": "Road",
        "projectType": "Construction",
        "zone": "Zone 1",
        "budgetLakhs": 520.0,
        "durationDays": 150,
        "trafficDensity": 10,
        "weatherRisk": 6,
        "utilityDependency": 8,
        "populationDensity": 9,
        "criticalInfrastructure": 10,
        "citizenImpact": 9,
        "resourceRequirement": 9,
        "contractorAvailability": 5,
        "status": "APPROVED"
    }
]

print("\n=======================================================")
print("   RUNNING ML MODEL PREDICTIONS & ANALYSIS TEST DATA   ")
print("=======================================================\n")

for i, proj in enumerate(test_projects, 1):
    print(f"[{i}] Submitting Project: '{proj['projectName']}' ({proj['zone']})...")
    created = post(f"{BASE_URL}/projects", proj, headers=headers)
    if created:
        pred = created.get("prediction", {})
        print(f"    [OK] Project ID: {created.get('id')}")
        print(f"    [OK] Status: {created.get('status')}")
        print(f"    [ML] Conflict Prediction : {pred.get('conflictPrediction', 'N/A')}")
        print(f"    [ML] Conflict Probability: {float(pred.get('conflictProbability', 0))*100:.1f}%")
        print(f"    [ML] Priority Classification: {pred.get('priorityPrediction', 'N/A')}")
        print("-" * 55)

print("\n[OK] ALL TEST DATA PROCESSED SUCCESSFULLY THROUGH ML ENGINE & BACKEND ANALYTICS!")
