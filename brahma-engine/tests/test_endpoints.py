from fastapi.testclient import TestClient
import sys
import os

# Append backend root path for relative imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_analyze_requirements_validation():
    # Empty prompt validation
    response = client.post("/analyze/requirements", json={"prompt": ""})
    assert response.status_code == 400

    # Successful fallback parsing
    response = client.post("/analyze/requirements", json={"prompt": "Build a stripe checkout system with database storage."})
    assert response.status_code == 200
    json_data = response.json()
    assert "modules" in json_data
    assert "functional" in json_data

def test_evaluate():
    response = client.post("/evaluate", json={
        "generated": ["Auth Login", "Payments Stripe", "Database postgres"],
        "ground_truth": ["Auth Login", "Payments stripe", "Notification SMS"]
    })
    assert response.status_code == 200
    metrics = response.json()
    assert metrics["precision"] > 0.0
    assert metrics["recall"] > 0.0
    assert metrics["f1"] > 0.0
    assert "auth login" in metrics["matches"]

def test_generate_report_pdf():
    payload = {
        "title": "Test Project Title",
        "description": "This is a test project description designed to check PDF generation integration.",
        "health_score": 95,
        "requirements": {
            "modules": [{"name": "Auth Module", "desc": "Handles login"}],
            "actors": [{"name": "User", "desc": "Standard operator"}],
            "functional": [{"id": "FR-01", "title": "Secure Login", "desc": "Authenticate users"}],
            "non_functional": [{"id": "NFR-01", "title": "Hashing", "desc": "Use bcrypt"}],
            "constraints": [{"id": "CON-01", "title": "Stripe Limit", "desc": "PCI constraints"}],
            "confidence": 0.95
        },
        "security_issues": [
            {
                "file": "main.py",
                "line": 42,
                "severity": "High",
                "rule_id": "hardcoded-credentials",
                "msg": "Hardcoded secret key detected."
            }
        ],
        "complexity_summary": {
            "avg_complexity": 3.5,
            "total_lines": 1500
        }
    }
    response = client.post("/report/test-project-123/pdf", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert "content-disposition" in response.headers
    assert "attachment; filename=brahma-report-test-project-123.pdf" in response.headers["content-disposition"]
    # PDF should start with PDF signature bytes
    assert response.content.startswith(b"%PDF")


def test_tool_health_summary():
    response = client.get("/api/v1/tools/health/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "catalog_health" in data
    assert data["catalog_health"]["ssrf_protection_active"] is True
    assert data["catalog_health"]["monitored_tools_count"] > 0


def test_tool_recheck_ssrf_blocked_localhost():
    # Attempt SSRF targeting localhost
    response = client.post(
        "/api/v1/tools/malicious-test/recheck",
        json={"url": "http://127.0.0.1:8000/admin"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["telemetry"]["error_code"] == "SSRF_BLOCKED"
    assert data["telemetry"]["status"] == "critical"
    assert data["telemetry"]["is_ssrf_safe"] is False


def test_tool_recheck_ssrf_blocked_cloud_metadata():
    # Attempt SSRF targeting AWS/GCP metadata endpoint
    response = client.post(
        "/api/v1/tools/metadata-test/recheck",
        json={"url": "http://169.254.169.254/latest/meta-data/"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["telemetry"]["error_code"] == "SSRF_BLOCKED"
    assert data["telemetry"]["is_ssrf_safe"] is False


