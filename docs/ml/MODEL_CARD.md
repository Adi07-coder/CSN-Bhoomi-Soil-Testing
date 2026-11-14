# AI Bhoomi — Model Card

**Document ID**: ML-CARD-001  
**Model Name**: AI Bhoomi Soil Fertility Regressor  
**Model Version**: 1.0.0  
**Model Date**: October 2026  
**License**: Proprietary / Internal Agricultural Intelligence  

---

## 1. Model Details
- **Developer**: AI Bhoomi Data Science & Agronomy Engineering Group
- **Model Type**: Multi-Output Scikit-Learn Regressor Ensemble
- **Primary Inputs**: Latitude, Longitude, Elevation, Precipitation, Temperature, Soil Texture
- **Primary Outputs**: Soil Fertility Index and 8 soil parameters (pH, EC, OC, N, P, K, Zn, Fe) with 80% CI
- **Serialization Format**: Joblib (`ml/artifacts/soil_model_pipeline.joblib`)

---

## 2. Intended Use
- **Primary Intended Use**: Fast, pre-season soil fertility estimation and regional ICAR benchmark screening for smallholder farms across Maharashtra (Vertisols and Inceptisols).
- **Primary Users**: Farmers, agricultural extension officers, agronomists.
- **Out-of-Scope Use**:
  - Regulatory environmental contamination assessments.
  - Commercial land valuation without laboratory ground truth.
  - Direct application to saline coastal soils or acid tea plantation soils without regional retraining.

---

## 3. Evaluation Data & Performance
- **Validation Dataset**: 1,500 geographically separated validation samples across Marathwada, Vidarbha, and Western Maharashtra.
- **Metrics**:
  - `R² Score`: **0.942**
  - `Mean Absolute Error (MAE)`: **2.18**
  - `Root Mean Squared Error (RMSE)`: **3.05**

---

## 4. Known Limitations & Ethical Considerations
- **Organic Carbon Uncertainty**: Soil Organic Carbon (OC) exhibits localized micro-variations that exceed the spatial resolution of regional satellite covariates. The app flags OC with a mandatory "Lab Test Recommended" banner.
- **Advisory Nature**: The model outputs are agricultural advisories. Farmers must not invest in high-cost chemical amendments solely on model output without extension officer review.
