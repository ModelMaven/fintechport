from fastapi import APIRouter, Depends, status
from app.schemas.schemas import CalculationRequest, CalculationResponse, SensitivityRequest, SensitivityResponse
from app.services.calc_engine import (
    calculate_current_ratio,
    calculate_quick_ratio,
    calculate_debt_equity,
    calculate_dscr,
    calculate_tandon_method_1,
    calculate_tandon_method_2,
    calculate_nayak_method,
    calculate_break_even,
    run_sensitivity_analysis
)

router = APIRouter(prefix="/calc", tags=["Financial Calculator"])

@router.post("/projected-cash-flow", response_model=CalculationResponse)
def get_projected_cash_flows(payload: CalculationRequest):
    """
    Executes standard ratios, working capital limits, and DSCR evaluations.
    """
    c_ratio = calculate_current_ratio(payload.current_assets, payload.current_liabilities)
    q_ratio = calculate_quick_ratio(payload.current_assets, payload.inventory, payload.current_liabilities)
    de_ratio = calculate_debt_equity(payload.total_debt, payload.net_worth)
    dscr_val = calculate_dscr(payload.pat, payload.depreciation, payload.interest, payload.principal_repayment)
    
    tandon1 = calculate_tandon_method_1(payload.current_assets, payload.current_liabilities - payload.total_debt * 0.3) # custom offset for other liabilities
    tandon2 = calculate_tandon_method_2(payload.current_assets, payload.current_liabilities - payload.total_debt * 0.3)
    
    nayak = calculate_nayak_method(payload.projected_turnover)
    bep = calculate_break_even(payload.fixed_costs, payload.sales, payload.variable_costs)

    return CalculationResponse(
        current_ratio=c_ratio,
        quick_ratio=q_ratio,
        debt_equity_ratio=de_ratio,
        dscr=dscr_val,
        tandon_method_1=tandon1,
        tandon_method_2=tandon2,
        nayak_method=nayak,
        break_even=bep
    )

@router.post("/sensitivity", response_model=SensitivityResponse)
def get_sensitivity_analysis(payload: SensitivityRequest):
    """
    Simulates operational sensitivity parameters.
    """
    res = run_sensitivity_analysis(
        base_cash_flows=payload.base_cash_flows,
        sales_change_pct=payload.sales_change_pct,
        cost_change_pct=payload.cost_change_pct
    )
    return SensitivityResponse(
        sales_change_pct=res["sales_change_pct"],
        cost_change_pct=res["cost_change_pct"],
        cash_flows=res["cash_flows"],
        irr=res["irr"],
        npv_10=res["npv_10"],
        npv_12=res["npv_12"]
    )

from pydantic import BaseModel
from app.services.ai_service import ai_service

class AutofillRequest(BaseModel):
    company_name: str
    prompt: str

@router.post("/autofill")
def autofill_proposal_data(payload: AutofillRequest):
    """
    Scrapes the web via Gemini AI to populate 15 steps of credit parameters.
    """
    data = ai_service.autofill_proposal(payload.company_name, payload.prompt)
    return data
