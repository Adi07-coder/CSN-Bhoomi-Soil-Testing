# Crop Recommendation Engine Across Seasons

## 1. Seasonal Coverage
The recommendation engine evaluates crop viability across all 3 Indian agro-climatic cropping seasons:
- **Kharif Season (Monsoon, June - October)**: Cotton, Soybean, Kharif Maize, Tur/Pigeonpea, Paddy, Bajra.
- **Rabi Season (Winter, October - March)**: Wheat, Gram/Chickpea, Rabi Jowar, Mustard, Safflower, Onion.
- **Summer Season (Zaid, February - May)**: Summer Groundnut, Summer Moong (Green Gram), Summer Urad (Black Gram), Summer Fodder Maize, Sesame/Til.

## 2. Multi-Factor Suitability Scoring
The suitability score (0 to 10 scale) evaluates:
1. **Soil Texture & pH Matching**: Ensures acid-sensitive or alkaline-sensitive crops are correctly aligned.
2. **Nutrient Demand Matrix**: Assesses availability of primary N-P-K reserves relative to peak crop demands.
3. **Water Requirements**: Classifies seasonal rainfall and irrigation access (Low: 300-400mm, Medium: 450-650mm, High: 700-1200mm).
4. **Agro-Climatic Thermal Tolerances**: Accounts for regional frost or heat stress during critical flowering/grain-filling phases.
