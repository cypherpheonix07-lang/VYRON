from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

# --- /analyze/requirements Schemas ---

class RequirementItem(BaseModel):
    id: str = Field(..., description="Unique code e.g. FR-01, NFR-01")
    title: str = Field(..., description="Short name of requirement")
    desc: str = Field(..., description="Detailed description")

class ModuleItem(BaseModel):
    name: str = Field(..., description="Name of the module")
    desc: str = Field(..., description="Purpose and functionality")

class ActorItem(BaseModel):
    name: str = Field(..., description="Name of the actor/persona")
    desc: str = Field(..., description="Permissions and system access")

class RequirementsInput(BaseModel):
    prompt: str = Field(..., description="User requirements text prompt")

class RequirementsOutput(BaseModel):
    modules: List[ModuleItem] = Field(default=[])
    actors: List[ActorItem] = Field(default=[])
    functional: List[RequirementItem] = Field(default=[])
    non_functional: List[RequirementItem] = Field(default=[])
    constraints: List[RequirementItem] = Field(default=[])
    confidence: float = Field(0.9, description="Confidence score from 0.0 to 1.0")

# --- /analyze/repo Schemas ---

class RepoInput(BaseModel):
    repo_url: str = Field(..., description="Public GitHub repository URL")

class FindingItem(BaseModel):
    file: str = Field(..., description="File path relative to repository root")
    line: int = Field(..., description="Line number of finding")
    severity: str = Field(..., description="Critical, High, Medium, or Low")
    rule_id: str = Field(..., description="Name/ID of lint or security rule")
    msg: str = Field(..., description="Description of the finding")

class ComplexityFileItem(BaseModel):
    file: str
    nloc: int
    functions_count: int
    avg_complexity: float

class RepoAnalysisOutput(BaseModel):
    repo_name: str
    complexity: List[ComplexityFileItem]
    security_findings: List[FindingItem]
    eslint_findings: List[FindingItem]
    semgrep_findings: List[FindingItem]
    overall_health_score: int

# --- Async Task Orchestration Schemas (Celery Decoupling) ---

class TaskAcceptedOutput(BaseModel):
    task_id: str = Field(..., description="Unique UUID tracking the asynchronous task")
    status: str = Field("ACCEPTED", description="ACCEPTED or PENDING")
    message: str = Field("Task queued successfully. Poll /analyze/status/{task_id} for results.")
    target_queue: str = Field("scans_queue", description="Name of the worker queue")
    enqueued_at: float = Field(..., description="Unix timestamp of task acceptance")

class TaskStatusOutput(BaseModel):
    task_id: str
    status: str = Field(..., description="PENDING, RUNNING, SUCCESS, FAILURE, NOT_FOUND")
    progress: int = Field(0, description="Completion percentage 0-100")
    result: Optional[Dict[str, Any]] = None
    memory_profile: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    completed_at: Optional[float] = None

# --- /evaluate Schemas ---

class EvaluateInput(BaseModel):
    generated: List[str] = Field(..., description="List of generated requirement titles or items")
    ground_truth: List[str] = Field(..., description="List of ground truth requirement titles or items")

class EvaluateOutput(BaseModel):
    precision: float
    recall: float
    f1: float
    matches: List[str]

# --- /report/{id}/pdf Schemas ---

class ReportInput(BaseModel):
    title: str
    description: str
    health_score: int
    requirements: Optional[RequirementsOutput] = None
    security_issues: Optional[List[FindingItem]] = None
    complexity_summary: Optional[Dict[str, Any]] = None

class PdfAcceptedOutput(BaseModel):
    task_id: str
    report_id: str
    status: str = "ACCEPTED"
    message: str = "PDF compilation queued on isolated pdf_queue with concurrency=1"
    target_queue: str = "pdf_queue"

# --- Phase 2: Optimistic Locking & Audit Schemas ---

class OptimisticProjectInput(BaseModel):
    id: str = Field(..., description="Project UUID")
    expected_version: int = Field(..., description="Current version number expected in DB")
    name: Optional[str] = None
    description: Optional[str] = None
    health_score: Optional[int] = None
    status: Optional[str] = None

class OptimisticProjectOutput(BaseModel):
    id: str
    version: int
    name: str
    description: Optional[str]
    health_score: int
    status: str
    updated_at: str
    optimistic_lock_status: str = "COMMITTED"
