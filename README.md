# Brahma Insights

Build a production-ready, modern, responsive frontend for PROJECT BRAHMA.

PROJECT NAME:

PROJECT BRAHMA

Blueprint-driven Requirements Architecture Health Monitoring Agent

CORE IDEOLOGY:

Every software project should begin with an intelligent, validated blueprint and continuously connect engineering quality to business impact. The frontend must feel like a serious enterprise SaaS platform for software engineering intelligence. It must not look like a generic AI chatbot or a basic student CRUD app.

PRODUCT PURPOSE:

PROJECT BRAHMA helps users convert a project idea or requirement into a structured software blueprint, analyze code quality and security, predict delivery risk, and map technical issues to business impact.

TARGET USERS:

Engineering students, startup founders, software teams, faculty reviewers, and engineering managers.

DESIGN DIRECTION:

- Modern enterprise SaaS.

- Dark theme by default with optional light theme.

- Primary background: deep navy, near black, for example #0B1220.

- Surface background: dark slate with subtle transparency and border glow.

- Accent colors: cyan #22D3EE, indigo #6366F1, amber #F59E0B for warnings, green #22C55E for success, red #EF4444 for critical issues.

- Typography: Inter or similar clean professional font.

- Rounded cards, soft borders, subtle shadows, clean spacing, strong data visualization.

- Minimal glassmorphism, not overly flashy.

- Professional, intelligent, precise, trustworthy.

- Fully responsive for desktop, tablet, and mobile.

- Accessibility-conscious: readable contrast, focus states, keyboard-friendly navigation.

- No lorem ipsum. Use realistic sample data related to software projects, code analysis, security issues, and risk scoring.

TECH STACK EXPECTATION:

Use React, TypeScript, Tailwind CSS, shadcn/ui style components, React Router, Lucide icons, Recharts for charts, and React Flow for architecture visualization. Use mock data and mock API functions. Do not implement a real backend. All data should be deterministic and realistic.

INFORMATION ARCHITECTURE:

Create the following route structure:

PUBLIC PAGES:

/ → Landing page

/login → Login page

/register → Register page

APP PAGES:

/app → Dashboard

/app/projects → Project list

/app/projects/new → New project wizard

/app/projects/:id → Project overview

/app/projects/:id/requirements → Requirement analysis

/app/projects/:id/blueprint → Architecture blueprint

/app/projects/:id/code-health → Code health analysis

/app/projects/:id/security → Security analysis

/app/projects/:id/risk-business → Risk and business impact

/app/projects/:id/reports → Reports and export

/app/settings → Settings

/app/admin → Admin dashboard, visible only for admin role

LANDING PAGE REQUIREMENTS:

Create a high-converting professional landing page with:

1. Navbar with logo, Features, How it works, Technology, Login, Get Started.

2. Hero section with headline: “From raw idea to validated software blueprint.”

3. Subheadline explaining AI-powered requirement analysis, architecture generation, code health, security, risk prediction, and business impact mapping.

4. Primary CTA: “Create Project”.

5. Secondary CTA: “View Demo Dashboard”.

6. Problem section showing fragmented tools and missing validation.

7. Solution section showing BRAHMA as one unified engineering intelligence platform.

8. Feature grid with 8 features:

   - Requirement Intelligence

   - Architecture Generator

   - Business KPI Mapper

   - Code Health Engine

   - Security Reviewer

   - Delivery Risk Predictor

   - Report Generator

   - Engineering Dashboard

9. Workflow section with 5 steps:

   - Input idea or requirement

   - AI extracts structured requirements

   - Generate architecture blueprint

   - Analyze code and security

   - Predict risk and business impact

10. Technology stack section.

11. Final CTA section.

12. Footer with product, resources, documentation, GitHub, contact.

AUTH PAGES REQUIREMENTS:

Login and register pages must be clean and centered.

Fields:

- Login: email, password.

- Register: name, email, password, role selection: Student, Faculty, Startup, Admin.

Include validation states, loading state, error state, and success toast.

Include mock authentication behavior.

APP SHELL REQUIREMENTS:

Create a reusable authenticated app layout with:

- Collapsible sidebar.

- Top bar with project selector, search, notifications, theme toggle, user profile menu.

- Breadcrumbs.

- Responsive mobile drawer navigation.

- Sidebar items:

  Dashboard

  Projects

  New Project

  Reports

  Settings

  Admin

- Active route highlighting.

- Empty notification state and loaded notification state.

DASHBOARD REQUIREMENTS:

The dashboard must show an executive overview of engineering intelligence.

Include:

1. KPI cards:

   - Total Projects

   - Average Health Score

   - Security Risk Level

   - Delivery Risk Level

   - Reports Generated

2. Recent projects table:

   - Project name

   - Status

   - Health score

   - Security score

   - Delivery risk

   - Last updated

3. Project health trend chart.

4. Risk distribution chart.

5. Recent activity feed.

6. Empty state when no projects exist.

7. Loading skeleton state.

8. Error state with retry button.

PROJECT LIST PAGE REQUIREMENTS:

Create a professional project list page with:

- Search input.

- Filters by status, risk level, health score.

- Grid and table view toggle.

- Project cards showing name, description, status badge, health score, risk score, security score.

- Create project button.

- Empty state.

- Loading state.

- Error state.

NEW PROJECT WIZARD REQUIREMENTS:

Create a 4-step wizard.

STEP 1: Project Information

Fields:

- Project name

- Description

- Domain

- Target users

- Team size

- Expected deadline

STEP 2: Requirement Input

Options:

- Textarea for raw project idea.

- Upload SRS or requirement document mock field.

- Optional voice input mock button.

- Example prompt button: “Load sample project idea”.

STEP 3: Repository Connection

Options:

- Connect GitHub repository mock.

- Paste repository URL.

- Use sample repository.

- Show connected/disconnected state.

STEP 4: Analysis Options

Toggles:

- Architecture generation

- Code health analysis

- Security review

- Risk prediction

- Business KPI mapping

Wizard requirements:

- Step indicator.

- Validation errors.

- Back and Next buttons.

- Final button: “Generate Blueprint”.

- On submit, show analysis progress state with steps:

  Parsing requirements

  Generating architecture

  Mapping business KPIs

  Analyzing code

  Calculating risk

  Preparing dashboard

PROJECT DETAIL PAGE REQUIREMENTS:

Create a tabbed project detail layout with:

- Overview

- Requirements

- Blueprint

- Code Health

- Security

- Risk & Business

- Reports

PROJECT OVERVIEW TAB:

Show:

- Project title and status.

- Health score gauge.

- Security score.

- Delivery risk score.

- Business impact score.

- Requirement clarity score.

- Last analysis timestamp.

- Quick actions:

  Run Analysis

  Export Report

  Connect Repository

  View Blueprint

REQUIREMENTS TAB:

Show structured AI-extracted requirements:

- Functional requirements list.

- Non-functional requirements list.

- Actors/users.

- Modules.

- Constraints.

- Assumptions.

- Data entities.

- Editable fields with save state.

- Confidence score for each extracted item.

- Warning state when requirement clarity is low.

BLUEPRINT TAB:

This is the most important visual page.

Create an architecture blueprint canvas.

Include:

1. React Flow graph showing system architecture:

   - Frontend

   - Backend

   - Database

   - AI service

   - Authentication

   - File storage

   - Background worker

   - External APIs

2. Node details panel when a node is selected.

3. Database schema table:

   - Table name

   - Fields

   - Type

   - Primary key

   - Relationships

4. API routes table:

   - Method

   - Endpoint

   - Purpose

   - Auth required

5. Architecture recommendations cards.

6. Download blueprint JSON mock button.

CODE HEALTH TAB:

Show code quality analysis:

- Overall health score.

- Maintainability chart.

- Complexity chart.

- Duplication percentage.

- Test coverage estimate.

- Dependency risk.

- File-level issues table:

  - File name

  - Complexity

  - Issues

  - Severity

  - Recommendation

- Loading state while analysis runs.

- Empty state if repository is not connected.

SECURITY TAB:

Show security analysis:

- Security score.

- Critical, high, medium, low vulnerability count cards.

- Vulnerability table:

  - Title

  - Severity

  - CWE ID

  - File/location

  - Description

  - Recommendation

- Severity badges.

- Remediation checklist.

- Empty state when no vulnerabilities found.

- Error state when security analysis fails.

RISK & BUSINESS TAB:

Show business impact mapping:

- Delivery risk score.

- Technical debt score.

- Release readiness score.

- Business impact matrix.

- KPI cards:

  Cost impact

  Time impact

  Quality impact

  Risk exposure

  Maintainability

- Chart: Technical issues vs business impact.

- Recommendation list:

  - Fix high-severity security issues first.

  - Reduce complexity in critical modules.

  - Add missing API tests.

  - Improve requirement clarity.

  - Prioritize modules with high business impact.

REPORTS TAB:

Show:

- Generated reports table.

- Report type:

  Academic report

  Technical report

  Executive summary

- Status:

  Generating

  Completed

  Failed

- Download PDF mock button.

- Generate new report button.

- Report preview modal with sections:

  Executive Summary

  Requirements

  Architecture

  Code Health

  Security

  Risk

  Business Impact

  Recommendations

SETTINGS PAGE REQUIREMENTS:

Create settings page with tabs:

- Profile

- Workspace

- Integrations

- Notifications

- Appearance

- API Keys

Include:

- Profile form with name, email, role.

- GitHub integration connect/disconnect mock.

- LLM API key input field.

- Notification toggles:

  Analysis completed

  Security alert

  Report ready

  Delivery risk warning

- Theme selector:

  Dark

  Light

  System

- Save button with success toast.

ADMIN PAGE REQUIREMENTS:

Create admin dashboard visible only for admin role.

Include:

- Total users.

- Total projects.

- Total analyses.

- Total reports.

- Usage chart.

- Recent users table.

- Audit log table.

- System health status.

COMPONENT HIERARCHY:

Create reusable components:

- AppShell

- Sidebar

- Topbar

- Breadcrumbs

- PageHeader

- StatCard

- ScoreGauge

- RiskBadge

- StatusBadge

- ProjectCard

- ProjectTable

- WizardStep

- RequirementCard

- ArchitectureCanvas

- SchemaTable

- ApiRouteTable

- CodeHealthChart

- SecurityVulnerabilityTable

- RiskMatrix

- BusinessImpactChart

- ReportTable

- EmptyState

- LoadingSkeleton

- ErrorState

- SuccessToast

- Modal

- Tabs

- SearchInput

- FilterBar

STATE MANAGEMENT:

Use clear UI state patterns:

- Authentication loading state.

- Project list loading state.

- Project creation loading state.

- Analysis running state.

- Analysis success state.

- Analysis failure state.

- Empty project state.

- No repository connected state.

- Report generating state.

- Settings saved state.

- Form validation error state.

USER FLOW:

Design the primary user flow:

1. User lands on homepage.

2. User clicks Get Started.

3. User registers or logs in.

4. User arrives at dashboard.

5. User clicks New Project.

6. User completes 4-step wizard.

7. System shows analysis progress.

8. User is redirected to project overview.

9. User explores Requirements, Blueprint, Code Health, Security, Risk & Business, and Reports.

10. User exports report.

MOCK DATA REQUIREMENTS:

Create realistic mock data for:

- 5 sample projects.

- At least 1 project with high health score.

- 1 project with medium risk.

- 1 project with critical security issues.

- 1 project with incomplete requirements.

- 1 project with repository not connected.

- Sample architecture graph nodes and edges.

- Sample database schema.

- Sample API routes.

- Sample code health metrics.

- Sample security vulnerabilities.

- Sample business KPI impact scores.

- Sample report history.

- Sample notifications.

RESPONSIVE REQUIREMENTS:

- Desktop: full sidebar, multi-column dashboard, large charts.

- Tablet: collapsible sidebar, stacked cards, responsive tables.

- Mobile: bottom navigation or drawer, simplified tables, card-based layouts, wizard becomes vertical stacked steps.

- Architecture canvas should support zoom, pan, and mobile-friendly fallback.

FINAL REQUIREMENTS:

- The UI must feel production-ready, clean, and enterprise-grade.

- Do not create childish or overly decorative visuals.

- Do not use placeholder text like “Lorem ipsum”.

- Every page must have loading, empty, error, and success states where relevant.

- The design should communicate software engineering intelligence, trust, clarity, and business alignment.

- The final frontend should be suitable for academic demo, investor review, hackathon presentation, and SaaS prototype.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/76b66fb0-f11c-4584-aa67-046562f7147f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
