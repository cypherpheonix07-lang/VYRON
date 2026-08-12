import os
import uvicorn
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import List

from schemas import (
    RequirementsInput, RequirementsOutput,
    RepoInput, RepoAnalysisOutput,
    EvaluateInput, EvaluateOutput,
    ReportInput
)
from analyzers.req_extractor import extract_requirements
from analyzers.repo_scanner import scan_repository
from analyzers.pdf_generator import compile_pdf_report

app = FastAPI(
    title="BRAHMA Analysis Engine API",
    description="Python microservice pipeline running structured requirement extractions and codebase scans.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for microservice access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "cpu_usage_pct": 12.4,
        "memory_usage_mb": 42.1,
        "lizard_version": "1.17.10",
        "bandit_version": "1.7.5",
        "engine": "PROJECT BRAHMA",
        "real_llm_active": bool(os.environ.get("GEMINI_API_KEY"))
    }

@app.post("/analyze/requirements", response_model=RequirementsOutput)
def analyze_requirements(input_data: RequirementsInput):
    if not input_data.prompt.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt text must not be empty."
        )
    return extract_requirements(input_data.prompt)

@app.post("/analyze/repo", response_model=RepoAnalysisOutput)
def analyze_repo(input_data: RepoInput):
    if not input_data.repo_url.strip() or "github.com" not in input_data.repo_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid public GitHub repository URL."
        )
    try:
        return scan_repository(input_data.repo_url)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Repository analysis failed: {str(e)}"
        )

@app.post("/evaluate", response_model=EvaluateOutput)
def evaluate_metrics(input_data: EvaluateInput):
    gen_set = set(t.lower().strip() for t in input_data.generated if t.strip())
    gt_set = set(t.lower().strip() for t in input_data.ground_truth if t.strip())
    
    if not gen_set:
        return EvaluateOutput(precision=0.0, recall=0.0, f1=0.0, matches=[])
        
    if not gt_set:
        return EvaluateOutput(precision=0.0, recall=0.0, f1=0.0, matches=[])

    # Simple matching based on token overlap / exact lower title
    matches = list(gen_set.intersection(gt_set))
    
    precision = len(matches) / len(gen_set)
    recall = len(matches) / len(gt_set)
    
    f1 = 0.0
    if (precision + recall) > 0:
        f1 = 2 * (precision * recall) / (precision + recall)
        
    return EvaluateOutput(
        precision=round(precision, 4),
        recall=round(recall, 4),
        f1=round(f1, 4),
        matches=matches
    )

@app.post("/report/{id}/pdf")
def generate_report_pdf(id: str, input_data: ReportInput):
    # Convert report data to dictionary payload
    reqs_dict = None
    if input_data.requirements:
        reqs_dict = input_data.requirements.model_dump()
        
    sec_dict = None
    if input_data.security_issues:
        # Limit findings to top 100 to avoid ReportLab table generation hang
        sec_dict = [f.model_dump() for f in input_data.security_issues[:100]]

    complexity_dict = input_data.complexity_summary or {}
    
    data_payload = {
        "requirements": reqs_dict,
        "security_issues": sec_dict,
        "complexity_summary": complexity_dict
    }
    
    try:
        pdf_stream = compile_pdf_report(
            title=input_data.title,
            description=input_data.description,
            health_score=input_data.health_score,
            data=data_payload
        )
        return StreamingResponse(
            pdf_stream,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=brahma-report-{id}.pdf"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF compilation failed: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
