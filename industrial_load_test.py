from locust import HttpUser, task, between
import uuid

class IndustrialLoadTest(HttpUser):
    wait_time = between(0.01, 0.05)
    host = "http://127.0.0.1:8000"

    @task(5)
    def generate_blueprint(self):
        with self.client.post("/api/v1/blueprint/generate", json={
            "project_id": str(uuid.uuid4()),
            "requirements": "Build a microservice architecture for e-commerce"
        }, catch_response=True) as res:
            if res.status_code in (200, 202):
                res.success()
            else:
                res.failure(f"Status: {res.status_code}")

    @task(3)
    def analyze_repo(self):
        with self.client.post("/api/v1/analyze/repo", json={
            "repo_url": "https://github.com/test/repo",
            "branch": "main"
        }, catch_response=True) as res:
            if res.status_code in (200, 202):
                res.success()
            else:
                res.failure(f"Status: {res.status_code}")

    @task(2)
    def get_report(self):
        with self.client.get("/api/v1/reports/latest", catch_response=True) as res:
            if res.status_code == 200:
                res.success()
            else:
                res.failure(f"Status: {res.status_code}")
