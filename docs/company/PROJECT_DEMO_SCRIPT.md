# AI Bhoomi — Live Product Demonstration Script

**Document ID**: COMP-DEMO-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Target Duration**: 5 to 7 Minutes  
**Audience**: Executive Reviewers, Technical Evaluators, Agronomists  
**Version**: 1.0.0  

---

## 1. Demonstration Sequence & Walkthrough

### Step 1: Introduction & Landing Page (1 Minute)
- **Action**: Open `http://localhost:5173` in browser.
- **Talking Point**:
  > *"Welcome to AI Bhoomi — our AI-powered sustainable agriculture intelligence platform. AI Bhoomi solves the weeks-long turnaround of soil testing by delivering instant, satellite-assisted soil fertility analytics and ICAR-calibrated fertilizer recommendations to smallholder farmers."*
- **Action**: Click **"Sign In"** and authenticate with demo credentials (`farmer.ramesh@example.com` / `SecurePassword#2026`).

---

### Step 2: Interactive Field Parcel Drawing (2 Minutes)
- **Action**: Navigate to **"Farms"** from the left navigation drawer.
- **Action**: Click the **"Locate Me"** crosshair icon or search for `"Wagholi, Pune"` in the search bar.
- **Action**: Click **"Draw Parcel"** and click 4 vertices around a field on the satellite canvas.
- **Talking Point**:
  > *"Notice how the system validates the polygon geometry in real-time. Instead of simple flat math, AI Bhoomi computes true geodesic area over the WGS84 ellipsoid. We can see our field is exactly 2.96 acres (1.20 hectares). Furthermore, the centroid is automatically reverse-geocoded to Wagholi village, Haveli taluka, Pune district."*
- **Action**: Click **"Save Farm Parcel"**. A confirmation toast confirms persistent database storage.

---

### Step 3: AI Soil Intelligence Analysis (2 Minutes)
- **Action**: From the parcel card, click **"Run Soil Analysis"**.
- **Talking Point**:
  > *"Behind the scenes, our FastAPI engine invokes our trained multi-target regressor calibrated to Maharashtra Vertisols. In under 50 milliseconds, the farmer receives an estimate across 8 chemical properties: Soil pH, Electrical Conductivity, Organic Carbon, Nitrogen, Phosphorus, Potassium, Zinc, and Iron."*
- **Talking Point on Provenance**:
  > *"Crucially, note the transparency badges. The model output is explicitly marked 'model_estimate' with an 80% confidence interval, rather than pretending to be an ungrounded physical measurement. If synthetic demonstration mode is active, an explicit amber banner is displayed."*

---

### Step 4: ICAR Fertilizer Recommendations & PDF Report (2 Minutes)
- **Action**: Navigate to **"Recommendations"** and select **"Wheat"**.
- **Talking Point**:
  > *"AI Bhoomi translates raw soil metrics into actionable agronomic practice based on official ICAR tables. Here, the farmer sees the exact bags of DAP, Urea, and MOP required for their 2.96 acres, broken down into Basal, Tillering, and Heading split applications."*
- **Action**: Navigate to **"Reports"** and click **"Download Soil Health Card"**.
- **Action**: Open the downloaded vector PDF file.
- **Talking Point**:
  > *"The platform compiles a complete vector PDF Soil Health Card. Notice the cryptographic SHA-256 hash printed at the bottom — this allows banks and crop insurance assessors to verify document authenticity against our API records."*

---

### Step 5: Wrap-up & Q&A
- **Action**: Conclude demo by summarizing that 29 out of 29 automated tests pass with 100% test coverage.
