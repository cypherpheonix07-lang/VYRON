import unittest
from fastapi.testclient import TestClient
import sys
import os

# Append backend root path for relative imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

class VyronEndpointTests(unittest.TestCase):
    def test_health(self):
        response = client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")

    def test_analyze_requirements_validation(self):
        # Empty prompt validation
        response = client.post("/analyze/requirements", json={"prompt": ""})
        self.assertEqual(response.status_code, 400)

        # Successful fallback parsing
        response = client.post("/analyze/requirements", json={"prompt": "Build a stripe checkout system with database storage."})
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertIn("modules", json_data)
        self.assertIn("functional", json_data)

    def test_evaluate(self):
        response = client.post("/evaluate", json={
            "generated": ["Auth Login", "Payments Stripe", "Database postgres"],
            "ground_truth": ["Auth Login", "Payments stripe", "Notification SMS"]
        })
        self.assertEqual(response.status_code, 200)
        metrics = response.json()
        self.assertGreater(metrics["precision"], 0.0)
        self.assertGreater(metrics["recall"], 0.0)
        self.assertGreater(metrics["f1"], 0.0)
        self.assertIn("auth login", metrics["matches"])

    def test_generate_report_pdf(self):
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
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["content-type"], "application/pdf")
        self.assertIn("content-disposition", response.headers)
        self.assertIn("attachment; filename=brahma-report-test-project-123.pdf", response.headers["content-disposition"])
        self.assertTrue(response.content.startswith(b"%PDF"))

    def test_tool_health_summary(self):
        response = client.get("/api/v1/tools/health/summary")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "SUCCESS")
        self.assertIn("catalog_health", data)
        self.assertTrue(data["catalog_health"]["ssrf_protection_active"])
        self.assertGreater(data["catalog_health"]["monitored_tools_count"], 0)

    def test_tool_recheck_ssrf_blocked_localhost(self):
        # Attempt SSRF targeting localhost
        response = client.post(
            "/api/v1/tools/malicious-test/recheck",
            json={"url": "http://127.0.0.1:8000/admin"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["telemetry"]["error_code"], "SSRF_BLOCKED")
        self.assertEqual(data["telemetry"]["status"], "critical")
        self.assertFalse(data["telemetry"]["is_ssrf_safe"])

    def test_tool_recheck_ssrf_blocked_cloud_metadata(self):
        # Attempt SSRF targeting AWS/GCP metadata endpoint
        response = client.post(
            "/api/v1/tools/metadata-test/recheck",
            json={"url": "http://169.254.169.254/latest/meta-data/"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["telemetry"]["error_code"], "SSRF_BLOCKED")
        self.assertFalse(data["telemetry"]["is_ssrf_safe"])

if __name__ == "__main__":
    unittest.main()
