from typing import List, Dict, Any, Optional

def calculate_current_ratio(current_assets: float, current_liabilities: float) -> float:
    if current_liabilities <= 0:
        return 0.0
    return round(current_assets / current_liabilities, 2)

def calculate_quick_ratio(current_assets: float, inventory: float, current_liabilities: float) -> float:
    if current_liabilities <= 0:
        return 0.0
    return round((current_assets - inventory) / current_liabilities, 2)

def calculate_debt_equity(total_debt: float, net_worth: float) -> float:
    if net_worth <= 0:
        return 0.0
    return round(total_debt / net_worth, 2)

def calculate_dscr(
    pat: float, 
    depreciation: float, 
    interest: float, 
    principal_repayment: float
) -> float:
    debt_service = principal_repayment + interest
    if debt_service <= 0:
        return 0.0
    ebitda_equivalent = pat + depreciation + interest
    return round(ebitda_equivalent / debt_service, 2)

def calculate_npv(rate: float, cash_flows: List[float]) -> float:
    """
    Calculates Net Present Value.
    cash_flows[0] is the initial investment (usually negative).
    """
    npv_val = 0.0
    for t, cf in enumerate(cash_flows):
        npv_val += cf / ((1 + rate) ** t)
    return round(npv_val, 2)

def calculate_irr(cash_flows: List[float], tol: float = 1e-6, max_iter: int = 2000) -> Optional[float]:
    """
    Calculates Internal Rate of Return using Secant/Bisection method.
    Returns the rate as a decimal (e.g. 0.15 for 15%).
    """
    # Check if there is at least one negative and one positive cash flow
    pos = any(cf > 0 for cf in cash_flows)
    neg = any(cf < 0 for cf in cash_flows)
    if not (pos and neg):
        return None

    def npv_f(r):
        return sum(cf / ((1 + r) ** t) for t, cf in enumerate(cash_flows))

    # Bisection search range
    low = -0.99
    high = 2.0
    
    # Evaluate at bounds
    f_low = npv_f(low)
    f_high = npv_f(high)
    
    # If the root isn't bracketed, expand bounds
    if f_low * f_high > 0:
        for i in range(10):
            high *= 2.0
            f_high = npv_f(high)
            if f_low * f_high < 0:
                break
        else:
            return None

    for _ in range(max_iter):
        mid = (low + high) / 2.0
        f_mid = npv_f(mid)
        
        if abs(f_mid) < tol:
            return round(mid, 4)
            
        if f_low * f_mid < 0:
            high = mid
            f_high = f_mid
        else:
            low = mid
            f_low = f_mid
            
    return round((low + high) / 2.0, 4)

def calculate_roce(ebit: float, total_assets: float, current_liabilities: float) -> float:
    capital_employed = total_assets - current_liabilities
    if capital_employed <= 0:
        return 0.0
    return round((ebit / capital_employed) * 100, 2)

def calculate_roe(pat: float, net_worth: float) -> float:
    if net_worth <= 0:
        return 0.0
    return round((pat / net_worth) * 100, 2)

def calculate_tandon_method_1(current_assets: float, current_liabilities_other: float) -> Dict[str, float]:
    """
    Tandon Committee Method I:
    Working Capital Gap = Current Assets - Current Liabilities (excluding Bank Borrowing)
    Borrower contribution = 25% of Working Capital Gap
    Maximum Permissible Bank Finance (MPBF) = 75% of Working Capital Gap
    """
    wc_gap = current_assets - current_liabilities_other
    borrower_margin = 0.25 * wc_gap
    mpbf = 0.75 * wc_gap
    return {
        "working_capital_gap": round(max(0.0, wc_gap), 2),
        "borrower_margin": round(max(0.0, borrower_margin), 2),
        "mpbf": round(max(0.0, mpbf), 2)
    }

def calculate_tandon_method_2(current_assets: float, current_liabilities_other: float) -> Dict[str, float]:
    """
    Tandon Committee Method II:
    Working Capital Gap = Current Assets - Current Liabilities (excluding Bank Borrowing)
    Borrower contribution = 25% of Current Assets
    Maximum Permissible Bank Finance (MPBF) = Working Capital Gap - Borrower contribution (25% of Current Assets)
    """
    wc_gap = current_assets - current_liabilities_other
    borrower_margin = 0.25 * current_assets
    mpbf = wc_gap - borrower_margin
    return {
        "working_capital_gap": round(max(0.0, wc_gap), 2),
        "borrower_margin": round(max(0.0, borrower_margin), 2),
        "mpbf": round(max(0.0, mpbf), 2)
    }

def calculate_nayak_method(projected_turnover: float) -> Dict[str, float]:
    """
    Nayak Committee Norms (Turnover Method):
    Working capital requirement is estimated at 25% of projected annual turnover.
    Out of this, 20% of turnover is provided by the Bank (Bank Finance).
    5% of turnover is contributed by the Borrower as margin.
    """
    total_wc_requirement = 0.25 * projected_turnover
    bank_finance = 0.20 * projected_turnover
    borrower_margin = 0.05 * projected_turnover
    return {
        "working_capital_requirement": round(total_wc_requirement, 2),
        "mpbf": round(bank_finance, 2),
        "borrower_margin": round(borrower_margin, 2)
    }

def calculate_break_even(fixed_costs: float, sales: float, variable_costs: float) -> Dict[str, float]:
    """
    Break Even Analysis
    BEP (value) = Fixed Costs / (1 - (Variable Costs / Sales))
    BEP (%) = (BEP Value / Sales) * 100
    """
    contribution_margin = sales - variable_costs
    if sales <= 0 or contribution_margin <= 0:
        return {"bep_value": 0.0, "bep_percentage": 0.0}
    bep_val = fixed_costs / (contribution_margin / sales)
    bep_pct = (bep_val / sales) * 100
    return {
        "bep_value": round(bep_val, 2),
        "bep_percentage": round(min(100.0, bep_pct), 2)
    }

def run_sensitivity_analysis(
    base_cash_flows: List[float], 
    sales_change_pct: float, 
    cost_change_pct: float
) -> Dict[str, Any]:
    """
    Simulates sensitivity of IRR and NPV under altered cash flow scenarios
    """
    modified_flows = []
    # Assume flow structure: index 0 is investment, 1..N are operational cash inflows
    modified_flows.append(base_cash_flows[0]) # initial cost is constant
    for flow in base_cash_flows[1:]:
        # assume operational cash inflow shifts by sales_change_pct and cost_change_pct
        # we simplify the net effect: flow * (1 + sales_change_pct - cost_change_pct)
        mod_flow = flow * (1.0 + sales_change_pct - cost_change_pct)
        modified_flows.append(mod_flow)
        
    irr_val = calculate_irr(modified_flows)
    npv_val_10 = calculate_npv(0.10, modified_flows)
    npv_val_12 = calculate_npv(0.12, modified_flows)
    
    return {
        "sales_change_pct": sales_change_pct,
        "cost_change_pct": cost_change_pct,
        "cash_flows": [round(f, 2) for f in modified_flows],
        "irr": irr_val,
        "npv_10": npv_val_10,
        "npv_12": npv_val_12
    }
