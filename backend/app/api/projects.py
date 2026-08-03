from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import Project, Borrower, Loan, FinancialStatement, User
from app.schemas.schemas import (
    ProjectCreate, ProjectResponse, 
    LoanCreate, LoanResponse, 
    FinancialStatementCreate, FinancialStatementResponse
)

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse])
def get_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lists all projects across the user's borrowers.
    """
    return db.query(Project).join(Borrower).filter(Borrower.user_id == current_user.id).all()

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Creates a new project profile linked to a borrower.
    """
    borrower = db.query(Borrower).filter(
        Borrower.id == payload.borrower_id,
        Borrower.user_id == current_user.id
    ).first()
    
    if not borrower:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Borrower profile not found or access is restricted."
        )

    new_project = Project(
        borrower_id=payload.borrower_id,
        project_name=payload.project_name,
        project_type=payload.project_type,
        location=payload.location,
        status=payload.status,
        technical_details=payload.technical_details
    )
    
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves detailed records for a project.
    """
    project = db.query(Project).join(Borrower).filter(
        Project.id == project_id,
        Borrower.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or access is restricted."
        )
    return project

# Loans related to Project
@router.post("/{project_id}/loans", response_model=LoanResponse, status_code=status.HTTP_201_CREATED)
def create_project_loan(
    project_id: UUID,
    payload: LoanBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).join(Borrower).filter(
        Project.id == project_id,
        Borrower.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    new_loan = Loan(
        project_id=project_id,
        bank_name=payload.bank_name,
        facility_type=payload.facility_type,
        limit_amount=payload.limit_amount,
        outstanding_amount=payload.outstanding_amount,
        interest_rate=payload.interest_rate,
        tenure_months=payload.tenure_months,
        repayment_terms=payload.repayment_terms,
        security_offered=payload.security_offered
    )
    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)
    return new_loan

@router.get("/{project_id}/loans", response_model=List[LoanResponse])
def get_project_loans(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Loan).filter(Loan.project_id == project_id).all()

# Financial statements related to Project
@router.post("/{project_id}/financials", response_model=FinancialStatementResponse, status_code=status.HTTP_201_CREATED)
def create_project_financials(
    project_id: UUID,
    payload: FinancialStatementBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).join(Borrower).filter(
        Project.id == project_id,
        Borrower.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    new_financial = FinancialStatement(
        project_id=project_id,
        financial_year=payload.financial_year,
        statement_type=payload.statement_type,
        balance_sheet=payload.balance_sheet,
        profit_and_loss=payload.profit_and_loss,
        cash_flow=payload.cash_flow
    )
    db.add(new_financial)
    db.commit()
    db.refresh(new_financial)
    return new_financial

@router.get("/{project_id}/financials", response_model=List[FinancialStatementResponse])
def get_project_financials(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(FinancialStatement).filter(FinancialStatement.project_id == project_id).all()
from app.schemas.schemas import LoanBase, FinancialStatementBase
