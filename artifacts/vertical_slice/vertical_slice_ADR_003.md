# Architectural Decision Record: ADR-003

**Title:** Boundary Enforcement for PaymentService Database Access  
**Status:** REJECTED (Pending Remediation)  
**Date:** 2026-10-07T02:28:13.256Z  
**Reviewer:** Dr. Sarah Connor (Faculty)  
**Cryptographic Seal:** `4b4181359b5123c11304d352c2cb016c99bc535050c99548c752da78d6b62db9`  

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
`sha256:4b4181359b5123c11304d352c2cb016c99bc535050c99548c752da78d6b62db9`
