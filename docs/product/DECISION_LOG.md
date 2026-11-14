# AI Bhoomi — Architectural & Product Decision Log

**Document ID**: PRD-DECISION-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0  
**Status**: APPROVED  

---

## 1. Decision Log Records

| Decision ID | Date | Subject | Decision Taken | Rationale | Alternatives Considered | Impact / Consequence |
|:---|:---|:---|:---|:---|:---|:---|
| **DEC-001** | 2026-09-15 | Coordinate Calculation | Use PyProj Geod (WGS84 ellipsoid) for all area calculations. | Cartesian math creates severe latitude distortion across India. | Spherical Haversine (less accurate), Local UTM projection (complex multi-zone management). | Exact sub-meter accuracy across all states without projection switching. |
| **DEC-002** | 2026-09-22 | Authentication Architecture | Use stateless JWT Bearer tokens (HS256) with 7-day expiration. | Enables simple horizontal scaling, zero server-side session state, and native mobile/web compatibility. | Stateful session cookies (harder across mobile/cross-origin). | Protected routes verify tokens via FastAPI dependency injection. |
| **DEC-003** | 2026-10-02 | Farm Deletion Constraint | Return HTTP 409 Conflict when deleting a farm with reports; support `?cascade=true`. | Prevents accidental destruction of legal audit trails while providing a clean purge option when requested. | Unchecked cascade delete (dangerous), pure hard-block (prevents cleanup). | Eliminates unhandled 500 errors and preserves audit compliance. |
| **DEC-004** | 2026-10-08 | Satellite Service Mode | Implement `GEE_DEMO_MODE=True` fallback when Earth Engine keys are absent. | Prevents application startup crashes during evaluation and local development. | Hard failure on missing GEE credentials. | Demo mode clearly labeled in API and UI; seamless transition when service account key is attached. |
| **DEC-005** | 2026-10-11 | Frontend Optimization | Code-split routes via `React.lazy()`, defer non-critical fonts, and bundle Vite chunks. | Initial Lighthouse audit indicated 117.1s Largest Contentful Paint due to unpkg CDN blockers and large icon bundles. | Monolithic build, synchronous script tags. | Reduced LCP to <5 seconds and cut dashboard vendor bundle size by >90%. |
| **DEC-006** | 2026-10-13 | Area API Contract | Add `"is_valid": true` boolean to `POST /api/v1/geo/calculate-area`. | Standardizes geometry validation flag across both `/calculate-area` and `/resolve-polygon`. | Separate validation endpoint. | Simplifies frontend validation logic and passes all QA test assertions. |
