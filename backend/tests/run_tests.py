import sys
import os

# Add the parent directory to the path so we can import app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.calc_engine import (
    calculate_current_ratio,
    calculate_quick_ratio,
    calculate_debt_equity,
    calculate_dscr,
    calculate_npv,
    calculate_irr,
    calculate_tandon_method_1,
    calculate_tandon_method_2,
    calculate_nayak_method,
    calculate_break_even
)

def run_tests():
    print("Running financial calculation engine test suite...")
    
    # 1. Liquidity
    assert calculate_current_ratio(150000, 100000) == 1.5, "Current ratio failed"
    assert calculate_current_ratio(50000, 100000) == 0.5, "Current ratio failed"
    assert calculate_current_ratio(100000, 0) == 0.0, "Current ratio zero division failed"
    print("[PASS] Liquidity ratios verified.")

    # 2. Quick Ratio
    assert calculate_quick_ratio(150000, 50000, 100000) == 1.0, "Quick ratio failed"
    assert calculate_quick_ratio(100000, 30000, 0) == 0.0, "Quick ratio zero division failed"
    print("[PASS] Quick ratios verified.")

    # 3. Debt Equity
    assert calculate_debt_equity(200000, 100000) == 2.0, "Debt equity failed"
    print("[PASS] Debt-Equity ratio verified.")

    # 4. DSCR
    assert calculate_dscr(100000, 30000, 20000, 40000) == 2.5, "DSCR calculation failed"
    assert calculate_dscr(50000, 10000, 0, 0) == 0.0, "DSCR zero division failed"
    print("[PASS] DSCR equations verified.")

    # 5. NPV and IRR
    cash_flows = [-100.0, 50.0, 70.0]
    assert calculate_npv(0.10, cash_flows) == 3.31, "NPV calculation failed"
    irr = calculate_irr(cash_flows)
    assert irr is not None and abs(irr - 0.1232) < 0.001, f"IRR calculation failed: {irr}"
    print("[PASS] NPV and IRR numerical solutions verified.")

    # 6. Working Capital Norms
    res_m1 = calculate_tandon_method_1(200000, 80000)
    assert res_m1["working_capital_gap"] == 120000
    assert res_m1["mpbf"] == 90000
    
    res_m2 = calculate_tandon_method_2(200000, 80000)
    assert res_m2["mpbf"] == 70000
    
    res_nayak = calculate_nayak_method(1000000)
    assert res_nayak["mpbf"] == 200000
    print("[PASS] Working capital Tandon & Nayak norms verified.")

    # 7. Break Even
    res_be = calculate_break_even(40000, 100000, 60000)
    assert res_be["bep_value"] == 100000
    assert res_be["bep_percentage"] == 100.0
    print("[PASS] Break-even margins verified.")

    print("\nALL FINANCIAL ENGINE TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    try:
        run_tests()
        sys.exit(0)
    except AssertionError as e:
        print(f"TEST FAILURE: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"UNEXPECTED ERROR: {e}")
        sys.exit(1)
