"""
Evaluation script for evaluating model performance and cross-validation metrics.
"""
import json
import os

def run_evaluation():
    artifacts_dir = os.path.join(os.path.dirname(__file__), "..", "artifacts")
    metadata_path = os.path.join(artifacts_dir, "model_metadata.json")
    
    if not os.path.exists(metadata_path):
        print("Metadata file not found. Run training script first.")
        return

    with open(metadata_path, "r", encoding="utf-8") as f:
        meta = json.load(f)

    print("==================================================")
    print("AI Bhoomi Soil ML Model Evaluation Report")
    print("==================================================")
    print(f"Model: {meta.get('model_name')}")
    print(f"Version: {meta.get('version')}")
    print(f"Geography: {meta.get('geography')}")
    print("--------------------------------------------------")
    print("Metrics:")
    for k, v in meta.get("metrics", {}).items():
        print(f"  - {k}: {v}")
    print("--------------------------------------------------")
    print("Feature Importances:")
    for feat, imp in meta.get("feature_importances", {}).items():
        print(f"  - {feat:5s}: {imp * 100:.1f}%")
    print("==================================================")

if __name__ == "__main__":
    run_evaluation()
