import json
import urllib.request

ML_BASE = "http://localhost:8000"
BACKEND_BASE = "http://localhost:8082/api"

def test_ml_endpoint(path, payload=None, method="POST"):
    url = f"{ML_BASE}{path}"
    print(f"\n--- Testing ML Service: {method} {url} ---")
    req = urllib.request.Request(url, method=method)
    if payload:
        req.add_header("Content-Type", "application/json")
        data = json.dumps(payload).encode("utf-8")
    else:
        data = None

    try:
        with urllib.request.urlopen(req, data=data, timeout=5) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)
            print(f"Status: {response.status} OK")
            print("Response:", json.dumps(res_json, indent=2))
            return True, res_json
    except Exception as e:
        print(f"ERROR calling {url}: {e}")
        return False, None

def get_auth_token():
    url = f"{BACKEND_BASE}/auth/login"
    payload = {"email": "road.officer@smartcity.gov.in", "password": "password123"}
    req = urllib.request.Request(url, method="POST", data=json.dumps(payload).encode("utf-8"))
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            res_json = json.loads(response.read().decode("utf-8"))
            return res_json.get("token")
    except Exception as e:
        print("Login failed, registering new officer...")
        reg_url = f"{BACKEND_BASE}/auth/register"
        reg_payload = {
            "name": "Verification Officer",
            "email": "verify.officer@smartcity.gov.in",
            "password": "password123",
            "department": "Road",
            "role": "DEPARTMENT_OFFICER"
        }
        reg_req = urllib.request.Request(reg_url, method="POST", data=json.dumps(reg_payload).encode("utf-8"))
        reg_req.add_header("Content-Type", "application/json")
        with urllib.request.urlopen(reg_req, timeout=5) as reg_res:
            reg_json = json.loads(reg_res.read().decode("utf-8"))
            return reg_json.get("token")

def test_backend_predict():
    token = get_auth_token()
    url = f"{BACKEND_BASE}/predict"
    print(f"\n--- Testing Java Backend ML Proxy with Auth Token: POST {url} ---")
    payload = {
        "projectName": "Zone 5 Arterial Water Main & Road Overlay",
        "department": "Water",
        "projectType": "Infrastructure",
        "zone": "Zone 5",
        "budgetLakhs": 150,
        "durationDays": 45,
        "trafficDensity": 8,
        "weatherRisk": 8,
        "utilityDependency": 9,
        "populationDensity": 8,
        "criticalInfrastructure": 9,
        "citizenImpact": 9,
        "resourceRequirement": 8,
        "contractorAvailability": 4,
        "status": "PENDING"
    }
    req = urllib.request.Request(url, method="POST", data=json.dumps(payload).encode("utf-8"))
    req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)
            print(f"Status: {response.status} OK")
            print("Backend Full Prediction & XAI Result:", json.dumps(res_json, indent=2))
            return True
    except Exception as e:
        print(f"ERROR calling Backend {url}: {e}")
        return False

def main():
    print("==================================================")
    print("  VERIFYING LIVE ML MODELS & BACKEND INTEGRATION  ")
    print("==================================================")

    # 1. Health
    test_ml_endpoint("/health", method="GET")

    # 2. Conflict Model (XGBoost)
    test_ml_endpoint("/predict/conflict", {
        "department": "Road",
        "projectType": "Infrastructure",
        "zone": "Zone 5",
        "budgetLakhs": 120,
        "durationDays": 30,
        "weatherRisk": 8,
        "utilityDependency": 9,
        "contractorAvailability": 3,
        "resourceRequirement": 8
    })

    # 3. Priority Model (Random Forest)
    test_ml_endpoint("/predict/priority", {
        "department": "Road",
        "projectType": "Infrastructure",
        "zone": "Zone 5",
        "budgetLakhs": 120,
        "durationDays": 30,
        "trafficDensity": 8,
        "weatherRisk": 8,
        "utilityDependency": 9,
        "populationDensity": 8,
        "criticalInfrastructure": 9,
        "citizenImpact": 9,
        "resourceRequirement": 8,
        "contractorAvailability": 3
    })

    # 4. Recommendation Model
    test_ml_endpoint("/predict/recommendations", {
        "department": "Water",
        "zone": "Zone 5",
        "conflictProbability": 0.94,
        "priorityPrediction": "High"
    })

    # 5. Resource Optimization Model
    test_ml_endpoint("/predict/resource-optimization", {
        "department": "Water",
        "zone": "Zone 5",
        "budgetLakhs": 150
    })

    # 6. Backend Authenticated Integration Test
    test_backend_predict()

    print("\n==================================================")
    print("  ALL LIVE ML MODEL VERIFICATION CHECKS COMPLETED ")
    print("==================================================")

if __name__ == "__main__":
    main()
