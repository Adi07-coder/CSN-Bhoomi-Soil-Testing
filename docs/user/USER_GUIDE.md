# AI Bhoomi — Farmer and Agronomist User Guide

**Document ID**: USR-GUIDE-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Target Audience**: Farmers, Field Officers, Extension Agronomists  
**Version**: 1.0.0  

---

## 1. Getting Started

### 1.1 Creating an Account
1. Open the AI Bhoomi web application (`http://localhost:5173` or production URL).
2. Click **"Get Started"** or **"Register"** on the landing page.
3. Enter your **Full Name**, **Email Address**, and choose a secure **Password**.
4. Click **"Create Account"**. You will be automatically redirected to your personal dashboard.

### 1.2 Signing In
1. Navigate to the **Login** page.
2. Enter your registered email and password.
3. Click **"Sign In"**. Your session will remain active across browser restarts.

---

## 2. Registering Your Farm Parcel

### 2.1 Navigating to Your Field
1. Click **"Farms"** or **"New Parcel"** from the sidebar navigation.
2. You will see an interactive satellite map canvas.
3. To locate your current field:
   - Click the **"Locate Me"** crosshair icon on the map.
   - Grant browser location permissions when prompted.
   - The map will automatically zoom directly to your current field position.
4. Alternatively, use the **Search Bar** above the map to search by village, taluka, district, or PIN code (e.g., "Wagholi, Pune").

### 2.2 Drawing Field Boundaries
1. Click the **"Draw Polygon"** tool on the map toolbar.
2. Click on the first corner of your field boundary to place vertex **P1**.
3. Continue clicking around the perimeter of your field for corners **P2**, **P3**, etc.
4. Click the starting point **P1** to complete and close the boundary polygon.
5. The system will immediately compute and display your field's exact area in:
   - **Acres** (e.g., `2.96 acres`)
   - **Hectares** (e.g., `1.20 ha`)
   - **Square Meters** (e.g., `12,000 m²`)
6. Notice that the **State**, **District**, and **Taluka** fields are automatically filled in.
7. Enter a name for your parcel (e.g., "North Wheat Field") and click **"Save Farm Parcel"**.

---

## 3. Running Soil Intelligence & Viewing Recommendations

### 3.1 Initiating Soil Analysis
1. Select your registered farm from the dashboard or farm list.
2. Click **"Run Soil Analysis"**.
3. The AI Soil Intelligence Agent will analyze regional covariates and generate your field's soil parameters:
   - **Soil pH** (Acidity / Alkalinity)
   - **Electrical Conductivity (EC)** (Salinity)
   - **Organic Carbon (OC)**
   - **Available Macronutrients**: Nitrogen (N), Phosphorus (P), Potassium (K)
   - **Micronutrients**: Zinc (Zn), Iron (Fe)
4. Each parameter is classified into **Low (Deficient)**, **Medium (Optimal)**, or **High (Excess)**.

### 3.2 Reviewing Crop & Fertilizer Advisory
1. Navigate to the **"Recommendations"** tab.
2. Select your planned seasonal crop (e.g., **Wheat**).
3. The system will calculate the exact quantity of fertilizers needed for your field's acreage:
   - Total bags of **DAP**, **Urea**, and **MOP**.
   - A step-by-step **Stage Schedule**:
     - **At Sowing (Basal)**: Initial foundation application.
     - **First Irrigation (21–25 Days)**: Top-dressing application.
     - **Flowering / Heading (40–45 Days)**: Final nitrogen boost.

---

## 4. Downloading Your Official Soil Health Card

1. Navigate to **"Reports"** from the sidebar.
2. Locate your farm assessment and click **"Generate Official PDF Card"**.
3. Click **"Download Report"**.
4. A high-resolution, vector PDF Soil Health Card will download to your device, complete with your parcel map, soil test readings, stage-wise fertilizer table, and cryptographic verification hash for bank credit applications.
