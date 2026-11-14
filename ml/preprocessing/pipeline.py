"""
Feature engineering and preprocessing pipeline for soil health prediction.
"""
import numpy as np
from typing import Dict, Any, List

FEATURE_COLUMNS = ["pH", "EC", "OC", "N", "P", "K", "Zn", "Fe"]

def extract_features(sample_dict: Dict[str, float]) -> np.ndarray:
    """
    Extracts raw features and computes derived agronomic ratios:
    - N_to_P ratio: N / (P + 1e-4)
    - N_to_K ratio: N / (K + 1e-4)
    - P_to_K ratio: P / (K + 1e-4)
    - C_N_proxy: OC * 1000 / (N + 1e-4)
    """
    raw_vals = [sample_dict.get(col, 0.0) for col in FEATURE_COLUMNS]
    n_val = sample_dict.get("N", 250.0)
    p_val = sample_dict.get("P", 18.0)
    k_val = sample_dict.get("K", 280.0)
    oc_val = sample_dict.get("OC", 0.6)

    np_ratio = n_val / (p_val + 1e-4)
    nk_ratio = n_val / (k_val + 1e-4)
    pk_ratio = p_val / (k_val + 1e-4)
    cn_proxy = (oc_val * 1000.0) / (n_val + 1e-4)

    features = raw_vals + [np_ratio, nk_ratio, pk_ratio, cn_proxy]
    return np.array(features, dtype=float)

def get_all_feature_names() -> List[str]:
    return FEATURE_COLUMNS + ["NP_Ratio", "NK_Ratio", "PK_Ratio", "CN_Proxy"]
