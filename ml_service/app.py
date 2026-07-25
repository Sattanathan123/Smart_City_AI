"""
Smart City AI — ML Prediction Service
Serves two endpoints consumed by the Spring Boot backend:
  POST /predict/conflict  → { conflictPrediction, conflictProbability }
  POST /predict/priority  → { priorityPrediction }

Models live in: ../smart_city_models/ML_Model_Comparison/
"""

import os
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify

app = Flask(__name__)

BASE = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR_CANDIDATES = [
    r"C:\Users\Sattanathan\Desktop\smart_city_models\ML_Model_Comparison",
    r"C:\Users\Sattanathan\Desktop\smart_city_models",
    os.path.abspath(os.path.join(BASE, "..", "smart_city_models", "ML_Model_Comparison")),
]
MODEL_DIR = next((path for path in MODEL_DIR_CANDIDATES if os.path.isdir(path)), MODEL_DIR_CANDIDATES[0])


def _load_model_artifacts():
    conflict_model = None
    conflict_threshold = 0.5
    priority_model = None
    priority_encoders = None

    conflict_path = os.path.join(MODEL_DIR, "xgboost_conflict_model.pkl")
    priority_path = os.path.join(MODEL_DIR, "priority_model.pkl")
    encoder_path = os.path.join(MODEL_DIR, "priority_label_encoders.pkl")

    if os.path.exists(conflict_path):
        try:
            conflict_bundle = joblib.load(conflict_path)
            conflict_model = conflict_bundle.get("model")
            conflict_threshold = conflict_bundle.get("threshold", 0.5)
        except Exception:
            conflict_model = None

    if os.path.exists(priority_path):
        try:
            priority_model = joblib.load(priority_path)
        except Exception:
            priority_model = None

    if os.path.exists(encoder_path):
        try:
            priority_encoders = joblib.load(encoder_path)
        except Exception:
            priority_encoders = None

    return conflict_model, conflict_threshold, priority_model, priority_encoders
conflict_model, conflict_threshold, priority_model, priority_encoders = _load_model_artifacts()

# ── Priority feature order (matches training) ─────────────────────────────────
PRIORITY_FEATURES = [
    "department", "project_type", "zone",
    "budget_lakhs", "duration_days", "traffic_density",
    "weather_risk", "utility_dependency", "population_density",
    "critical_infrastructure", "citizen_impact",
    "resource_requirement", "contractor_availability",
    "conflict_probability",          # filled with conflict model output
]

# ── Conflict feature order (matches training) ─────────────────────────────────
# The conflict model was trained on pairwise data.
# For a single project we self-pair (A == B) to get a self-conflict score.
CONFLICT_FEATURES = [
    "department_A", "department_B",
    "project_type_A", "project_type_B",
    "zone_A", "zone_B",
    "contractor_A", "contractor_B",
    "resource_A", "resource_B",
    "duration_A", "duration_B",
    "location_overlap",
    "timeline_overlap",
    "resource_overlap",
    "department_dependency",
    "traffic_density",
    "weather_risk",
    "project_priority",
    "utility_dependency",
    "contractor_availability",
    "budget_ratio",
    "duration_diff",
    "overlap_score",
    "same_zone",
    "same_resource",
]

# ── Helper: encode a categorical value safely ─────────────────────────────────
def safe_encode(encoder, value, default=0):
    try:
        return int(encoder.transform([value])[0])
    except Exception:
        return default


def _fallback_conflict_prediction(payload):
    weather = float(payload.get("weatherRisk", 5)) / 10.0
    utility = int(payload.get("utilityDependency", 5))
    contractor = int(payload.get("contractorAvailability", 5))
    resource = int(payload.get("resourceRequirement", 5))

    score = 0.18 + (weather * 0.25) + (utility * 0.05) + (contractor * 0.03) + (resource * 0.04)
    probability = min(0.99, max(0.05, score))
    prediction = "Conflict" if probability >= 0.5 else "No Conflict"
    return prediction, round(probability, 4)


def _fallback_priority_prediction(payload):
    budget = float(payload.get("budgetLakhs", 0))
    duration = int(payload.get("durationDays", 30))
    traffic = int(payload.get("trafficDensity", 5))
    weather = float(payload.get("weatherRisk", 5)) / 10.0
    utility = int(payload.get("utilityDependency", 5))
    population = int(payload.get("populationDensity", 5))
    critical = int(payload.get("criticalInfrastructure", 5))
    citizen = int(payload.get("citizenImpact", 5))
    resource = int(payload.get("resourceRequirement", 5))
    contractor = int(payload.get("contractorAvailability", 5))

    score = 0.35 + (budget / 1000.0) * 0.15 + (duration / 365.0) * 0.1 + (traffic / 10.0) * 0.10 + (weather * 0.10)
    score += (utility / 10.0) * 0.08 + (population / 10.0) * 0.08 + (critical / 10.0) * 0.08 + (citizen / 10.0) * 0.08
    score += (resource / 10.0) * 0.04 + (contractor / 10.0) * 0.03
    score = min(0.95, max(0.05, score))

    if score >= 0.75:
        return "High"
    if score >= 0.55:
        return "Medium"
    return "Low"


# ── /predict/conflict ─────────────────────────────────────────────────────────
@app.route("/predict/conflict", methods=["POST"])
def predict_conflict():
    data = request.get_json(force=True)

    # Map camelCase → snake_case
    dept        = data.get("department", "Road")
    ptype       = data.get("projectType", "Infrastructure")
    zone        = data.get("zone", "Zone 1")
    budget      = float(data.get("budgetLakhs", 0))
    duration    = int(data.get("durationDays", 30))
    weather     = float(data.get("weatherRisk", 5)) / 10.0   # normalise 1-10 → 0-1
    utility     = int(data.get("utilityDependency", 5))
    contractor  = int(data.get("contractorAvailability", 5))
    resource    = int(data.get("resourceRequirement", 5))

    if conflict_model is None or priority_encoders is None:
        pred, proba = _fallback_conflict_prediction(data)
        return jsonify({
            "conflictPrediction": pred,
            "conflictProbability": proba,
        })

    # Encode categoricals using the priority encoders (same classes)
    dept_enc  = safe_encode(priority_encoders["department"],    dept)
    ptype_enc = safe_encode(priority_encoders["project_type"],  ptype)
    zone_enc  = safe_encode(priority_encoders["zone"],          zone)

    # Self-pair: A == B (worst-case conflict scenario for a single project)
    row = {
        "department_A":           dept_enc,
        "department_B":           dept_enc,
        "project_type_A":         ptype_enc,
        "project_type_B":         ptype_enc,
        "zone_A":                 zone_enc,
        "zone_B":                 zone_enc,
        "contractor_A":           contractor,
        "contractor_B":           contractor,
        "resource_A":             resource,
        "resource_B":             resource,
        "duration_A":             duration,
        "duration_B":             duration,
        "location_overlap":       1,          # same zone → full overlap
        "timeline_overlap":       1,          # same duration → full overlap
        "resource_overlap":       1,          # same resource → full overlap
        "department_dependency":  1,          # same dept → dependent
        "traffic_density":        data.get("trafficDensity", 5),
        "weather_risk":           weather,
        "project_priority":       3,          # neutral default
        "utility_dependency":     utility,
        "contractor_availability": contractor,
        "budget_ratio":           1.0,
        "duration_diff":          0,
        "overlap_score":          3,
        "same_zone":              1,
        "same_resource":          1,
    }

    X = pd.DataFrame([row])[CONFLICT_FEATURES]
    proba = float(conflict_model.predict_proba(X)[0, 1])
    pred  = "Conflict" if proba >= conflict_threshold else "No Conflict"

    return jsonify({
        "conflictPrediction":  pred,
        "conflictProbability": round(proba, 4),
    })


# ── /predict/priority ─────────────────────────────────────────────────────────
@app.route("/predict/priority", methods=["POST"])
def predict_priority():
    data = request.get_json(force=True)

    dept       = data.get("department", "Road")
    ptype      = data.get("projectType", "Infrastructure")
    zone       = data.get("zone", "Zone 1")
    budget     = float(data.get("budgetLakhs", 0))
    duration   = int(data.get("durationDays", 30))
    traffic    = int(data.get("trafficDensity", 5))
    weather    = float(data.get("weatherRisk", 5)) / 10.0
    utility    = int(data.get("utilityDependency", 5))
    population = int(data.get("populationDensity", 5))
    critical   = int(data.get("criticalInfrastructure", 5))
    citizen    = int(data.get("citizenImpact", 5))
    resource   = int(data.get("resourceRequirement", 5))
    contractor = int(data.get("contractorAvailability", 5))

    if priority_model is None or priority_encoders is None or conflict_model is None:
        return jsonify({"priorityPrediction": _fallback_priority_prediction(data)})

    # Get conflict probability first (reuse conflict endpoint logic inline)
    dept_enc  = safe_encode(priority_encoders["department"],   dept)
    ptype_enc = safe_encode(priority_encoders["project_type"], ptype)
    zone_enc  = safe_encode(priority_encoders["zone"],         zone)

    conflict_row = {
        "department_A": dept_enc, "department_B": dept_enc,
        "project_type_A": ptype_enc, "project_type_B": ptype_enc,
        "zone_A": zone_enc, "zone_B": zone_enc,
        "contractor_A": contractor, "contractor_B": contractor,
        "resource_A": resource, "resource_B": resource,
        "duration_A": duration, "duration_B": duration,
        "location_overlap": 1,
        "timeline_overlap": 1,
        "resource_overlap": 1,
        "department_dependency": 1,
        "traffic_density": traffic,
        "weather_risk": weather,
        "project_priority": 3,
        "utility_dependency": utility,
        "contractor_availability": contractor,
        "budget_ratio": 1.0,
        "duration_diff": 0,
        "overlap_score": 3,
        "same_zone": 1,
        "same_resource": 1,
    }
    Xc = pd.DataFrame([conflict_row])[CONFLICT_FEATURES]
    conflict_prob = float(conflict_model.predict_proba(Xc)[0, 1])

    # Build priority feature row
    row = {
        "department":             dept_enc,
        "project_type":           ptype_enc,
        "zone":                   zone_enc,
        "budget_lakhs":           budget,
        "duration_days":          duration,
        "traffic_density":        traffic,
        "weather_risk":           weather,
        "utility_dependency":     utility,
        "population_density":     population,
        "critical_infrastructure": critical,
        "citizen_impact":         citizen,
        "resource_requirement":   resource,
        "contractor_availability": contractor,
        "conflict_probability":   round(conflict_prob, 4),
    }

    X = pd.DataFrame([row])[PRIORITY_FEATURES]
    pred_encoded = priority_model.predict(X)[0]
    pred_label   = priority_encoders["priority"].inverse_transform([pred_encoded])[0]

    return jsonify({"priorityPrediction": pred_label})


# ── Health check ──────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=False)
