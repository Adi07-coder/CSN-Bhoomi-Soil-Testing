# -*- coding: utf-8 -*-
"""
AI Bhoomi — Central Master Test Suite Runner
Executes all testing suites and prints a consolidated pass/fail report.
"""
import subprocess
import sys
import os

TESTS = [
    ("Master Workflow (8 Pillars & Gemini)", "test_master_workflow_e2e.py"),
    ("Map Polygon 15 Acceptance Tests", "test_map_polygon_acceptance.py"),
    ("System Integrity & Symbols", "test_system_integrity.py"),
    ("ML Model Inference & Bounds", "test_ml_model_inference.py"),
    ("Crop & Benchmark Validation Fix (9 Tests)", "test_crop_benchmark_validation_fix.py"),
]

def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    print("=" * 70)
    print("AI BHOOMI — EXECUTING CENTRAL TEST SUITE")
    print("=" * 70)
    
    passed = 0
    failed = 0
    
    for name, script_name in TESTS:
        script_path = os.path.join(current_dir, script_name)
        if not os.path.exists(script_path):
            print(f"[SKIP] {name}: {script_name} not found.")
            continue
            
        print(f"\n>>> Running: {name} ({script_name})...")
        proc = subprocess.run([sys.executable, script_path], capture_output=True, text=True)
        print(proc.stdout)
        if proc.returncode == 0:
            print(f"[PASS] {name}")
            passed += 1
        else:
            print(proc.stderr)
            print(f"[FAIL] {name} (Exited with code {proc.returncode})")
            failed += 1
            
    print("=" * 70)
    print(f"TEST RUN COMPLETED: {passed} PASSED, {failed} FAILED (Total: {passed + failed})")
    print("=" * 70)
    sys.exit(0 if failed == 0 else 1)

if __name__ == "__main__":
    main()
