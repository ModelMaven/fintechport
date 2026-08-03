from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import date, datetime
from uuid import UUID

# User
class UserBase(BaseModel):
    email: str
    clerk_id: str
    role: str = "user"

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Promoter Details (Sub-structure)
class PromoterDetail(BaseModel):
    name: str
    equity_percentage: float
    age: int
    net_worth: float

# Borrower
class BorrowerBase(BaseModel):
    company_name: str
    constitution: str
    industry: str
    registration_number: Optional[str] = None
    date_of_incorporation: Optional[date] = None
    registered_address: Optional[str] = None
    office_address: Optional[str] = None
    promoter_details: Optional[List[PromoterDetail]] = None
    shareholding_pattern: Optional[Dict[str, float]] = None

class BorrowerCreate(BorrowerBase):
    pass

class BorrowerResponse(BorrowerBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Project
class ProjectBase(BaseModel):
    project_name: str
    project_type: str
    location: str
    status: str = "Proposed"
    technical_details: Optional[Dict[str, Any]] = None

class ProjectCreate(ProjectBase):
    borrower_id: UUID

class ProjectResponse(ProjectBase):
    id: UUID
    borrower_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Loan
class LoanBase(BaseModel):
    bank_name: str
    facility_type: str
    limit_amount: float
    outstanding_amount: float = 0.00
    interest_rate: float
    tenure_months: int
    repayment_terms: Optional[Dict[str, Any]] = None
    security_offered: Optional[Dict[str, Any]] = None

class LoanCreate(LoanBase):
    project_id: UUID

class LoanResponse(LoanBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Financial Statement
class FinancialStatementBase(BaseModel):
    financial_year: int
    statement_type: str  # Audited, Provisional, Projected
    balance_sheet: Dict[str, Any]
    profit_and_loss: Dict[str, Any]
    cash_flow: Optional[Dict[str, Any]] = None

class FinancialStatementCreate(FinancialStatementBase):
    project_id: UUID

class FinancialStatementResponse(FinancialStatementBase):
    id: UUID
    project_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Calculation Request/Response
class CalculationRequest(BaseModel):
    current_assets: float
    current_liabilities: float
    inventory: float
    total_debt: float
    net_worth: float
    pat: float
    depreciation: float
    interest: float
    principal_repayment: float
    projected_turnover: float
    fixed_costs: float
    variable_costs: float
    sales: float

class CalculationResponse(BaseModel):
    current_ratio: float
    quick_ratio: float
    debt_equity_ratio: float
    dscr: float
    tandon_method_1: Dict[str, float]
    tandon_method_2: Dict[str, float]
    nayak_method: Dict[str, float]
    break_even: Dict[str, float]

class SensitivityRequest(BaseModel):
    base_cash_flows: List[float]
    sales_change_pct: float
    cost_change_pct: float

class SensitivityResponse(BaseModel):
    sales_change_pct: float
    cost_change_pct: float
    cash_flows: List[float]
    irr: Optional[float]
    npv_10: float
    npv_12: float

# Document
class DocumentBase(BaseModel):
    doc_type: str
    s3_url: str
    file_name: str

class DocumentCreate(DocumentBase):
    project_id: UUID

class DocumentResponse(DocumentBase):
    id: UUID
    project_id: UUID
    status: str
    extracted_data: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Report
class ReportBase(BaseModel):
    report_name: str
    template_type: str

class ReportCreate(ReportBase):
    project_id: UUID

class ReportGenerateRequest(BaseModel):
    report_id: UUID
    include_ai_sections: bool = True

class ReportResponse(ReportBase):
    id: UUID
    project_id: UUID
    status: str
    report_data: Optional[Dict[str, Any]] = None
    pdf_url: Optional[str] = None
    docx_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
