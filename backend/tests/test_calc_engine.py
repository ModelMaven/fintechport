import pytest
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

def test_liquidity_ratios():
    # Test Current Ratio
    assert calculate_current_ratio(150000, 100000) == 1.5
    assert calculate_current_ratio(50000, 100000) == 0.5
    assert calculate_current_ratio(100000, 0) == 0.0

    # Test Quick Ratio
    assert calculate_quick_ratio(150000, 50000, 100000) == 1.0
    assert calculate_quick_ratio(80000, 20000, 100000) == 0.6
    assert calculate_quick_ratio(100000, 30000, 0) == 0.0

def test_debt_equity():
    assert calculate_debt_equity(200000, 100000) == 2.0
    assert calculate_debt_equity(50000, 150000) == 0.33
    assert calculate_debt_equity(100000, 0) == 0.0

def test_dscr():
    # pat=100, depreciation=30, interest=20, principal=40
    # EBITDA-equivalent = 100 + 30 + 20 = 150
    # Debt service = 40 + 20 = 60
    # DSCR = 150 / 60 = 2.5
    assert calculate_dscr(100000, 30000, 20000, 40000) == 2.5
    assert calculate_dscr(50000, 10000, 15000, 0) == 5.0
    assert calculate_dscr(50000, 10000, 0, 0) == 0.0

def test_npv_and_irr():
    # Simple investment: -100, 50, 70
    cash_flows = [-100.0, 50.0, 70.0]
    # NPV at 10%
    # -100 + 50/1.1 + 70/1.21 = -100 + 45.4545 + 57.8512 = 3.31
    assert calculate_npv(0.10, cash_flows) == 3.31
    
    # IRR calculation
    # npv_f(r) = -100 + 50/(1+r) + 70/(1+r)^2 = 0
    # Solving quadratic: 100(1+r)^2 - 50(1+r) - 70 = 0 => 10x^2 - 5x - 7 = 0 where x=1+r
    # x = (5 + sqrt(25 - 4*10*(-7)))/20 = (5 + sqrt(305))/20 = (5 + 17.464)/20 = 1.1232
    # r = 1.1232 - 1 = 0.1232 => 12.32%
    irr = calculate_irr(cash_flows)
    assert irr is not None
    assert abs(irr - 0.1232) < 0.001

def test_working_capital_norms():
    # Current Assets = 200, Liabilities other than bank = 80
    # WC Gap = 120
    # Method I: MPBF = 75% of 120 = 90. Margin = 30
    res_m1 = calculate_tandon_method_1(200000, 80000)
    assert res_m1["working_capital_gap"] == 120000
    assert res_m1["borrower_margin"] == 30000
    assert res_m1["mpbf"] == 90000

    # Method II: Margin = 25% of Current Assets = 50. MPBF = WC Gap - Margin = 120 - 50 = 70
    res_m2 = calculate_tandon_method_2(200000, 80000)
    assert res_m2["working_capital_gap"] == 120000
    assert res_m2["borrower_margin"] == 50000
    assert res_m2["mpbf"] == 70000

    # Nayak Turnover Method
    # Projected Turnover = 1000
    # WC requirement = 250 (25%)
    # MPBF (Bank finance) = 200 (20%)
    # Margin = 50 (5%)
    res_nayak = calculate_nayak_method(1000000)
    assert res_nayak["working_capital_requirement"] == 250000
    assert res_nayak["mpbf"] == 200000
    assert res_nayak["borrower_margin"] == 50000

def test_break_even():
    # Fixed cost = 40, Sales = 100, Variable Cost = 60
    # Contribution = 40. BEP Value = 40 / (40/100) = 100. BEP % = 100%
    res_be = calculate_break_even(40000, 100000, 60000)
    assert res_be["bep_value"] == 100000
    assert res_be["bep_percentage"] == 100.0

    res_be_2 = calculate_break_even(20000, 100000, 50000) # Contribution = 50
    assert res_be_2["bep_value"] == 40000
    assert res_be_2["bep_percentage"] == 40.0
