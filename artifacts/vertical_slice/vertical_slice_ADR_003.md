# Architectural Decision Record: ADR-003

**Title:** Boundary Enforcement for PaymentService Database Access  
**Status:** REJECTED (Pending Remediation)  
**Date:** 2026-10-05T20:18:26.543Z  
**Reviewer:** Dr. Sarah Connor (Faculty)  
**Cryptographic Seal:** `ebd2e5779cb9737a4906a675c1b1b66c91b9d32e218a4ec06a685c6096e60a11`  

## Context
A pull request injected a direct dependency on `@/db/rawConnectionPool` into `PaymentProcessor.ts`.

## Observed Finding
- **Type:** BOUNDARY_VIOLATION
- **Severity:** HIGH
- **CWE:** CWE-285
- **Evidence:** `import { rawConnection } from "@/db/rawConnectionPool";`
- **Health Impact:** Score decreased from 95 to 80.

## Reviewer Decision
**Outcome:** REJECTED_REMEDIATION_REQUIRED  
**Remediation Required:** Architecture violation: PaymentProcessor directly imports raw connection pool. Route all queries through BillingAdapter to preserve tenant isolation.

## Verification Proof
This document is bound to verifiable release dossier hash:
`sha256:ebd2e5779cb9737a4906a675c1b1b66c91b9d32e218a4ec06a685c6096e60a11`
