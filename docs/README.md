# AI Bhoomi — Master Documentation Index

**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0 (Pre-Production Release)  
**Last Updated**: October 2026  
**Test Suite Status**: **29 / 29 PASSED (100%)**  

---

## Central Documentation Portal

Welcome to the central technical documentation and project handover package for **AI Bhoomi**. This repository contains complete architectural specifications, product requirements, API references, machine learning governance cards, quality assurance reports, and deployment guides.

---

## 0. Master Implementation Workflow & Technology Specifications

| Document | File Path | Description |
|:---|:---|:---|
| **Technology Stack & Functions** | [`docs/TECHSTACK.md`](TECHSTACK.md) | Complete frontend/backend tech stack, libraries, and core function reference manual. |
| **Workflow Architecture** | [`docs/AI_BHOOMI_WORKFLOW.md`](AI_BHOOMI_WORKFLOW.md) | Complete end-to-end platform workflow based on the master prompt diagram. |
| **Soil Report Pipeline** | [`docs/SOIL_REPORT_PIPELINE.md`](SOIL_REPORT_PIPELINE.md) | Boundary capture, area calculation, reverse geocoding, and PDF generation. |
| **NPK & Micronutrient Engine** | [`docs/NPK_MICRONUTRIENT_ENGINE.md`](NPK_MICRONUTRIENT_ENGINE.md) | 12-nutrient diagnostic standards, units, and ICAR baseline calibrations. |
| **Crop Recommendation Engine**| [`docs/CROP_RECOMMENDATION_ENGINE.md`](CROP_RECOMMENDATION_ENGINE.md)| Kharif, Rabi, and Summer crop suitability scoring algorithms. |
| **Treatment Planning** | [`docs/TREATMENT_PLANNING.md`](TREATMENT_PLANNING.md) | Organic soil conditioning and balanced STCR chemical dosing with 50kg bag counts. |
| **Data Genuineness & Provenance**| [`docs/DATA_GENUINENESS_AND_VALIDATION.md`](DATA_GENUINENESS_AND_VALIDATION.md)| STL certification, benchmark reference standards, and coordinate integrity. |
| **Hallucination Prevention** | [`docs/HALLUCINATION_PREVENTION.md`](HALLUCINATION_PREVENTION.md) | Rule-grounded upper limits, contradiction prevention, and resilient Gemini integration. |
| **REST API Reference** | [`docs/API_REFERENCE.md`](API_REFERENCE.md) | Complete REST API contracts, endpoints, schemas, and payload examples. |
| **Implementation Status** | [`docs/IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md) | Feature matrix, verification checklist, and model version audit. |
| **Testing Report** | [`docs/TESTING_REPORT.md`](TESTING_REPORT.md) | Automated testing traces, static analysis outputs, and E2E pass logs. |

---

## 1. Product & Executive Documentation

Target Audience: Product Managers, Executive Leadership, Investors, Solution Architects

| Document | File Path | Description |
|:---|:---|:---|
| **Executive Summary** | [`docs/company/EXECUTIVE_SUMMARY.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/company/EXECUTIVE_SUMMARY.md) | High-level summary of business opportunity, product capabilities, and strategic roadmap. |
| **Product Requirements Document (PRD)** | [`docs/product/PRODUCT_REQUIREMENTS_DOCUMENT.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/product/PRODUCT_REQUIREMENTS_DOCUMENT.md) | Complete user personas, functional (FR-001–FR-011) and non-functional requirements. |
| **Software Requirements Specification (SRS)** | [`docs/product/SOFTWARE_REQUIREMENTS_SPECIFICATION.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/product/SOFTWARE_REQUIREMENTS_SPECIFICATION.md) | Formal IEEE 29148-aligned software requirements baseline across all system modules. |
| **User Stories & Acceptance Criteria** | [`docs/product/USER_STORIES_AND_ACCEPTANCE_CRITERIA.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/product/USER_STORIES_AND_ACCEPTANCE_CRITERIA.md) | User journeys, preconditions, error flows, and acceptance criteria across four epics. |
| **Product Roadmap** | [`docs/product/PRODUCT_ROADMAP.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/product/PRODUCT_ROADMAP.md) | Completed milestones (1–3) and scheduled feature releases for 2026–2027. |
| **Risk Register** | [`docs/product/RISK_REGISTER.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/product/RISK_REGISTER.md) | Categorized risks, severity levels, and active agronomic, ML, and technical mitigations. |
| **Assumptions & Dependencies** | [`docs/product/ASSUMPTIONS_AND_DEPENDENCIES.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/product/ASSUMPTIONS_AND_DEPENDENCIES.md) | Technical, agronomic, framework, and cloud service dependency definitions. |
| **Decision Log** | [`docs/product/DECISION_LOG.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/product/DECISION_LOG.md) | Formal records (DEC-001–DEC-006) of key architectural and product decisions. |

---

## 2. Architecture & Technical Specifications

Target Audience: Principal Software Architects, Senior Full-Stack Engineers, DevOps Leads

| Document | File Path | Description |
|:---|:---|:---|
| **System Architecture** | [`docs/architecture/SYSTEM_ARCHITECTURE.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/architecture/SYSTEM_ARCHITECTURE.md) | Complete C4 level 1, 2, and 3 diagrams, container specifications, and subsystem assessments. |
| **Codebase Reference** | [`docs/architecture/CODEBASE_REFERENCE.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/architecture/CODEBASE_REFERENCE.md) | Repository tree, module-by-module breakdown, and core workflow sequence diagrams. |
| **API Reference Manual** | [`docs/technical/API_REFERENCE.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/technical/API_REFERENCE.md) | Full endpoint directory covering all 35 implemented REST routes, bodies, and status codes. |
| **Database Design** | [`docs/technical/DATABASE_DESIGN.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/technical/DATABASE_DESIGN.md) | Mermaid ER diagram, table schemas, spatial columns, and cascading deletion rules. |
| **Data Dictionary** | [`docs/technical/DATA_DICTIONARY.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/technical/DATA_DICTIONARY.md) | Definitions, units, ranges, and provenance categories for all 8 soil parameters and geometries. |
| **GIS & Geospatial Pipeline** | [`docs/technical/GIS_AND_GEOSPATIAL_PIPELINE.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/technical/GIS_AND_GEOSPATIAL_PIPELINE.md) | WGS84 geodesic algorithms, Shapely validation, and Geoapify geocoding integration. |
| **Observability & Monitoring** | [`docs/technical/OBSERVABILITY_AND_MONITORING.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/technical/OBSERVABILITY_AND_MONITORING.md) | Structured audit logging schema, health probes, and production monitoring strategies. |
| **Non-Functional Requirements** | [`docs/technical/NON_FUNCTIONAL_REQUIREMENTS.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/technical/NON_FUNCTIONAL_REQUIREMENTS.md) | Measurable targets for latency, throughput, security, and sub-meter geospatial accuracy. |

---

## 3. AI, Machine Learning & Agronomy

Target Audience: Machine Learning Engineers, Data Scientists, Agronomists, Extension Officers

| Document | File Path | Description |
|:---|:---|:---|
| **ML System Architecture** | [`docs/ml/ML_SYSTEM_ARCHITECTURE.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/ml/ML_SYSTEM_ARCHITECTURE.md) | Feature pipeline, training scripts, R² = 0.942 evaluation, and 80% confidence intervals. |
| **Model Card** | [`docs/ml/MODEL_CARD.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/ml/MODEL_CARD.md) | Governance card for the AI Bhoomi Soil Fertility Regressor v1.0.0. |
| **Dataset Card** | [`docs/ml/DATASET_CARD.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/ml/DATASET_CARD.md) | Summary of the 200,000-row Maharashtra Regional Soil Fertility Dataset. |
| **Demo & Production Data Policy**| [`docs/ml/DEMO_AND_PRODUCTION_DATA_POLICY.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/ml/DEMO_AND_PRODUCTION_DATA_POLICY.md) | Policy governing synthetic demonstration samples vs. validated model inference. |
| **Soil Benchmarks & Rules** | [`docs/domain/SOIL_BENCHMARKS_AND_AGRICULTURAL_RULES.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/domain/SOIL_BENCHMARKS_AND_AGRICULTURAL_RULES.md) | ICAR Table 4.2 fertility ranges, crop nutrient requirements, and stage-wise split dosages. |

---

## 4. Security & Privacy

Target Audience: Security Auditors, Compliance Officers, Lead Developers

| Document | File Path | Description |
|:---|:---|:---|
| **Security Architecture** | [`docs/security/SECURITY_ARCHITECTURE.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/security/SECURITY_ARCHITECTURE.md) | Authentication guards, bcrypt hashing, multi-tenant RBAC, and SHA-256 report digests. |
| **STRIDE Threat Model** | [`docs/security/THREAT_MODEL.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/security/THREAT_MODEL.md) | Formal threat analysis covering spoofing, tampering, information disclosure, and mitigations. |
| **Privacy & Data Handling** | [`docs/security/PRIVACY_AND_DATA_HANDLING.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/security/PRIVACY_AND_DATA_HANDLING.md) | Farmer data minimization, GPS permission behaviors, and zero-monetization guarantees. |

---

## 5. Quality Assurance & Verification

Target Audience: QA Automation Engineers, Release Managers, Due Diligence Evaluators

| Document | File Path | Description |
|:---|:---|:---|
| **Test Strategy** | [`docs/qa/TEST_STRATEGY.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/qa/TEST_STRATEGY.md) | Quality philosophy, test pyramid, test level scopes, and release exit criteria. |
| **Test Cases Specification** | [`docs/qa/TEST_CASES.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/qa/TEST_CASES.md) | Directory of all 29 automated test cases across geospatial, ML, and E2E integration suites. |
| **Test Execution Report** | [`docs/qa/TEST_EXECUTION_REPORT.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/qa/TEST_EXECUTION_REPORT.md) | Formally verified pytest execution results (29/29 passed in 74.20s). |
| **Requirements Traceability Matrix**| [`docs/qa/TRACEABILITY_MATRIX.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/qa/TRACEABILITY_MATRIX.md) | End-to-end matrix mapping requirements to user stories, API routes, and test cases. |

---

## 6. Deployment & Operations

Target Audience: DevOps Engineers, Site Reliability Engineers, System Administrators

| Document | File Path | Description |
|:---|:---|:---|
| **Installation & Setup Guide** | [`docs/deployment/INSTALLATION_AND_SETUP.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/deployment/INSTALLATION_AND_SETUP.md) | Local development instructions for Windows PowerShell, Linux, and macOS. |
| **Production Deployment Guide** | [`docs/deployment/DEPLOYMENT_GUIDE.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/deployment/DEPLOYMENT_GUIDE.md) | Containerized deployment using Docker Compose, PostgreSQL 15, and PostGIS. |
| **Operations Runbook** | [`docs/deployment/OPERATIONS_RUNBOOK.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/deployment/OPERATIONS_RUNBOOK.md) | Backup procedures, service health checks, and emergency incident triage playbooks. |
| **Environment Variables Reference**| [`docs/deployment/ENVIRONMENT_VARIABLES.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/deployment/ENVIRONMENT_VARIABLES.md) | Exhaustive directory of all configuration variables, sensitivity ratings, and defaults. |
| **CI/CD & Release Process** | [`docs/deployment/CI_CD_AND_RELEASE_PROCESS.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/deployment/CI_CD_AND_RELEASE_PROCESS.md) | Automated build, test gating, container packaging, and deployment pipeline. |
| **Release Readiness Checklist** | [`docs/deployment/RELEASE_CHECKLIST.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/deployment/RELEASE_CHECKLIST.md) | Verification checklist and engineering sign-offs for production release v1.0.0. |

---

## 7. User & Developer Guides

Target Audience: End Users, Agronomists, Software Developers, Open-Source Contributors

| Document | File Path | Description |
|:---|:---|:---|
| **User Guide** | [`docs/user/USER_GUIDE.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/user/USER_GUIDE.md) | Illustrated farmer guide for parcel drawing, soil testing, and report downloading. |
| **Developer Guide** | [`docs/developer/DEVELOPER_GUIDE.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/developer/DEVELOPER_GUIDE.md) | Architecture patterns, repository standards, async database rules, and test workflows. |
| **Contributing Guidelines** | [`docs/developer/CONTRIBUTING.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/developer/CONTRIBUTING.md) | Git branching conventions, commit message standards, and pull request requirements. |
| **Troubleshooting Guide** | [`docs/developer/TROUBLESHOOTING.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/developer/TROUBLESHOOTING.md) | Step-by-step solutions to common environment, map tile, and database issues. |
| **Agricultural & Tech Glossary**| [`docs/developer/GLOSSARY.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/developer/GLOSSARY.md) | Definitions for agronomic terms (ICAR, Vertisols, DAP, CRI) and technical geospatial concepts. |

---

## 8. Company Handover & Technical Review

Target Audience: Incoming Engineering Leads, CTO / VP Engineering, Technical Evaluators

| Document | File Path | Description |
|:---|:---|:---|
| **Project Handover Document** | [`docs/company/PROJECT_HANDOVER.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/company/PROJECT_HANDOVER.md) | Comprehensive engineering handover package summarizing architecture and immediate next steps. |
| **Technical Overview** | [`docs/company/TECHNICAL_OVERVIEW.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/company/TECHNICAL_OVERVIEW.md) | Architecture summary and key technical differentiators for technical due diligence. |
| **Executive Summary** | [`docs/company/EXECUTIVE_SUMMARY.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/company/EXECUTIVE_SUMMARY.md) | Strategic business opportunity, product achievements, and path to production. |
| **Live Product Demo Script** | [`docs/company/PROJECT_DEMO_SCRIPT.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/company/PROJECT_DEMO_SCRIPT.md) | Step-by-step 5–7 minute live demonstration script for presentations and reviews. |
| **Technical Review Checklist** | [`docs/company/TECHNICAL_REVIEW_CHECKLIST.md`](file:///c:/Users/Aditya/Downloads/Project/ai-bhoomi/docs/company/TECHNICAL_REVIEW_CHECKLIST.md) | Evidence-backed answers to the top 10 technical review and due diligence questions. |
