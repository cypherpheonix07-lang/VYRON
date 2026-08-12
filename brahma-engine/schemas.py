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
