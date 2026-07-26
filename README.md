# Intelligent Smart City Management System

**AI-Based Predictive Analytics & Inter-Departmental Data Interoperability OS**

Unified municipal platform connecting Road, Water, Electricity, Drainage, and Waste Management divisions with official employee verification and decision support.

---

## 🏛️ Enterprise System Architecture

```
smart_city_ai/
│
├── ☕ backend/                 # Java Spring Boot 3.2.12 REST API Server (Port 8082)
│   ├── src/main/java/com/smartcity/
│   │   ├── controller/         # Auth, Complaints, Projects, Analytics REST Endpoints
│   │   ├── entity/             # JPA Hibernate Relational Database Schemas (User, Complaint, Project)
│   │   ├── service/            # Business Logic & Automated SMTP Mail Dispatch
│   │   └── security/           # JWT Token Authorization Filter & Password Encoders
│   └── pom.xml
│
├── 🐍 ml_service/              # Python Flask Machine Learning Microservice (Port 8000)
│   ├── app.py                  # Endpoints (/predict/conflict, /predict/priority, /predict/recommendations)
│   ├── verify_all_ml_models.py # Live Integration & Endpoint Verification Script
│   └── requirements.txt        # Flask, XGBoost, Scikit-Learn, Pandas Dependencies
│
└── 🎨 src/                     # React 18 + TypeScript + Vite Municipal Web Application (Port 8080)
    ├── components/             # Municipal Command Shell, Navigation, & Notification Popovers
    ├── lib/                    # Typed REST API Client & Session Manager
    ├── routes/                 # File-based TanStack Router Governance Pages
    └── styles.css              # Custom Municipal Design Tokens & High-Contrast Styles
```

---

## 🚀 Services Quickstart

### 1. Python ML Service (Port 8000)
```bash
cd ml_service
.venv\Scripts\python.exe app.py
```

### 2. Spring Boot Backend (Port 8082)
```bash
cd backend
mvn spring-boot:run
```

### 3. React Municipal Frontend (Port 8080)
```bash
npm run dev
```
