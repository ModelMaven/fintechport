from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import Borrower, User
from app.schemas.schemas import BorrowerCreate, BorrowerResponse

router = APIRouter(prefix="/borrowers", tags=["Borrowers"])

@router.get("", response_model=List[BorrowerResponse])
def get_borrowers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lists all borrowers under the currently authenticated user session.
    """
    return db.query(Borrower).filter(Borrower.user_id == current_user.id).all()

@router.post("", response_model=BorrowerResponse, status_code=status.HTTP_201_CREATED)
def create_borrower(
    payload: BorrowerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Registers a new borrower profile.
    """
    # Serialize promoter list and shareholding to dictionary/JSON
    promoter_data = [p.dict() for p in payload.promoter_details] if payload.promoter_details else []
    
    new_borrower = Borrower(
        user_id=current_user.id,
        company_name=payload.company_name,
        constitution=payload.constitution,
        industry=payload.industry,
        registration_number=payload.registration_number,
        date_of_incorporation=payload.date_of_incorporation,
        registered_address=payload.registered_address,
        office_address=payload.office_address,
        promoter_details=promoter_data,
        shareholding_pattern=payload.shareholding_pattern
    )
    
    db.add(new_borrower)
    db.commit()
    db.refresh(new_borrower)
    return new_borrower

@router.get("/{borrower_id}", response_model=BorrowerResponse)
def get_borrower(
    borrower_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves detailed records for a single borrower.
    """
    borrower = db.query(Borrower).filter(
        Borrower.id == borrower_id, 
        Borrower.user_id == current_user.id
    ).first()
    
    if not borrower:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Borrower profile not found or access is restricted."
        )
    return borrower
