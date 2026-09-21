import os
import json
import logging
from google import genai
from google.genai import types
from schemas import RequirementsOutput, RequirementItem, ModuleItem, ActorItem

logger = logging.getLogger("brahma-engine")

# Fallback generator when API key is missing or calls fail
def rule_based_fallback(prompt: str) -> RequirementsOutput:
    logger.info("Running rule-based requirement extraction fallback.")
    lower = prompt.lower()
    
    modules = []
    actors = []
    functional = []
    non_functional = []
    constraints = []
    
    # Simple rule matching
    if "login" in lower or "auth" in lower or "user" in lower or "register" in lower:
        modules.append(ModuleItem(name="Authentication & Authorization", desc="Handles secure login, register, and JWT/session management."))
        actors.append(ActorItem(name="Registered User", desc="Standard user with workspace credentials access."))
        functional.append(RequirementItem(id="FR-01", title="Secure User Login", desc="System must authenticate users via encrypted credential verification."))
        functional.append(RequirementItem(id="FR-02", title="Session Tokens", desc="Generate JWT session authorization tokens upon successful verification."))
        non_functional.append(RequirementItem(id="NFR-01", title="Password Hashing", desc="Store passwords using strong salted hashing algorithms (e.g. bcrypt)."))
        
    if "payment" in lower or "stripe" in lower or "checkout" in lower or "billing" in lower:
        modules.append(ModuleItem(name="Payment Integration Engine", desc="Orchestrates acquring, settlement, and Stripe transaction logs."))
        actors.append(ActorItem(name="Payer/Merchant", desc="Entity executing credit checkout pipelines."))
        functional.append(RequirementItem(id="FR-03", title="Stripe Checkout Integration", desc="Connect Stripe webhooks to listen for completed checkout payment events."))
        functional.append(RequirementItem(id="FR-04", title="Idempotent Settlements", desc="Must verify settlement transaction retry tokens to prevent double billing."))
        constraints.append(RequirementItem(id="CON-01", title="PCI-DSS Compliance", desc="Payment details must not touch local storage disk registers."))
        non_functional.append(RequirementItem(id="NFR-02", title="Transaction Latency", desc="Process gateway handshake handovers in under 400ms."))

    if "admin" in lower or "dashboard" in lower or "manage" in lower or "report" in lower:
        modules.append(ModuleItem(name="Admin Control Panel", desc="Workspace console for managing templates, audits, and configuration parameters."))
        actors.append(ActorItem(name="Workspace Administrator", desc="Root user with permissions to assign roles and override features."))
        functional.append(RequirementItem(id="FR-05", title="Export PDF Reports", desc="Allows admins to compile design specification templates to PDF format."))
        functional.append(RequirementItem(id="FR-06", title="Audit Trail Logging", desc="Log all administrative settings changes to a read-only system ledger."))

    # Default elements if prompt is too brief
    if not modules:
        modules.append(ModuleItem(name="Core Application Module", desc="Central business logic handler for user prompt requirements."))
    if not actors:
        actors.append(ActorItem(name="End User", desc="General platform operator."))
    if not functional:
        functional.append(RequirementItem(id="FR-01", title="Process prompt inputs", desc="System must parse user request parameters and match schema filters."))
    if not non_functional:
        non_functional.append(RequirementItem(id="NFR-01", title="Engine Response Time", desc="Respond to requirements extraction requests in under 2 seconds."))
    if not constraints:
        constraints.append(RequirementItem(id="CON-01", title="API Key Required", desc="Access is subject to authorization parameter limits."))

    return RequirementsOutput(
        modules=modules,
        actors=actors,
        functional=functional,
        non_functional=non_functional,
        constraints=constraints,
        confidence=0.75
    )

def extract_requirements(prompt: str) -> RequirementsOutput:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return rule_based_fallback(prompt)

    try:
        client = genai.Client(api_key=api_key)
        
        system_instruction = (
            "You are the BRAHMA AI requirement extraction engine. "
            "Analyze the user's requirements description and return a structured JSON response "
            "complying EXACTLY with the schemas: modules, actors, functional, non_functional, and constraints."
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"Extract structured requirements from this prompt:\n\n{prompt}",
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=RequirementsOutput,
                system_instruction=system_instruction
            )
        )
        
        data = json.loads(response.text.strip())
        
        # Parse and return valid schema object
        return RequirementsOutput(
            modules=[ModuleItem(**m) for m in data.get("modules", [])],
            actors=[ActorItem(**a) for a in data.get("actors", [])],
            functional=[RequirementItem(**f) for f in data.get("functional", [])],
            non_functional=[RequirementItem(**nf) for nf in data.get("non_functional", [])],
            constraints=[RequirementItem(**c) for c in data.get("constraints", [])],
            confidence=float(data.get("confidence", 0.95))
        )
    except Exception as e:
        logger.error(f"Gemini API requirement extraction failed: {e}")
        return rule_based_fallback(prompt)
