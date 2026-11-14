# AI Bhoomi — Contribution Guidelines

**Document ID**: DEV-CONTRIB-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0  

---

## 1. Branching & Git Workflow

- **Main Branch**: `main` (Production-ready, protected, requires PR review).
- **Development Branch**: `develop` (Integration branch for ongoing sprint work).
- **Feature Branches**: `feature/<feature-name>` (e.g., `feature/sar-satellite-ingestion`).
- **Bugfix Branches**: `bugfix/<ticket-id>-<description>` (e.g., `bugfix/cascade-farm-delete`).

---

## 2. Commit Message Standards
We follow Conventional Commits:
- `feat: <description>`: Adds new user-facing functionality.
- `fix: <description>`: Resolves a defect or bug.
- `docs: <description>`: Documentation additions or updates.
- `test: <description>`: Adds or modifies test cases.
- `refactor: <description>`: Internal code refactoring without external behavior changes.

---

## 3. Pull Request Review Checklist
1. All 29 automated tests pass: `python -m pytest tests -v`.
2. Frontend builds cleanly: `npm run build`.
3. Zero secrets or API keys committed in code or configuration files.
4. New API endpoints documented in `docs/technical/API_REFERENCE.md`.
5. Code follows async database standards and repository patterns.
