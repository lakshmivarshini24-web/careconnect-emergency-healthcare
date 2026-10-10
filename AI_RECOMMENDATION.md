# 🏥 CareConnect – Hospital Recommendation & Matching Engine

This document details the multi-criteria decision-support algorithm powering **CareConnect's Emergency Hospital Recommendation Engine** (`aiRecommendationService.ts`).

---

## 🎯 Objective

During medical emergencies, recommending solely the **closest** hospital frequently fails when that hospital's ICU is saturated, its cardiologists are in surgery, or its trauma beds are full.

CareConnect's recommendation engine evaluates multi-factorial clinical and logistical parameters to rank hospital suitability.

---

## 📐 Scoring Formula & Weight Allocation

The suitability score \(S_h \in [0, 100]\) for a hospital \(h\) is defined as:

$$S_h = W_{\text{spec}} \cdot S_{\text{spec}} + W_{\text{icu}} \cdot S_{\text{icu}} + W_{\text{bed}} \cdot S_{\text{bed}} + W_{\text{travel}} \cdot S_{\text{travel}} + W_{\text{resource}} \cdot S_{\text{resource}}$$

### Weight Parameters:

| Parameter | Weight | Description |
|---|---|---|
| **Specialist Match ($W_{\text{spec}}$)** | **30%** | On-duty availability of required doctor (e.g. Cardiologist for Heart Attack) |
| **ICU Capacity ($W_{\text{icu}}$)** | **20%** | Open critical care & ventilator bed availability |
| **Travel Time & Distance ($W_{\text{travel}}$)** | **15%** | Estimated vehicle ETA calculated via Haversine distance matrix |
| **Emergency Bed Availability ($W_{\text{bed}}$)** | **15%** | Open trauma & general bed capacity |
| **Oxygen & Blood Stock ($W_{\text{resource}}$)** | **10%** | High-flow oxygen beds, cylinders & compatible blood units |
| **Ambulance Stationed ($W_{\text{resource}}$)** | **10%** | Nearby ready ALS/BLS ambulance units |

---

## 💡 Transparent Decision Support ("WHY THIS HOSPITAL?")

CareConnect output is 100% transparent and explainable to patients and emergency workers. Each recommendation result outputs specific justification flags:

- `✓ Required specialist (Cardiologist) available on emergency duty`
- `✓ ICU capacity available (8 beds open)`
- `✓ Emergency bed available (35 beds ready)`
- `✓ Rapid emergency response distance (8 min ETA, 3.4 km)`
- `✓ Stationed ambulance unit available for dispatch`

---

## 🔮 Future Machine Learning Demand Prediction Model Roadmap

CareConnect includes a future-ready interface (`predictHospitalDemand`) for predictive ML modeling.

### Predictive Variables:
1. **Historical Admission Rates** by hour of day and day of week.
2. **City Traffic Congestion Index** for dynamic travel time projection.
3. **Seasonal Respiratory/Epidemic Disease Surge Indicators**.

### Projected Output:
- **Surge Risk Level**: `LOW` | `MODERATE` | `HIGH` | `CRITICAL`
- **Estimated Depletion Time**: Hours remaining before 100% saturation.
- **Preemptive Patient Diversion Advisory**: Suggesting ambulance rerouting before bottleneck occurs.
