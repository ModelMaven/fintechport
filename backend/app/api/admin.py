from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.database import get_db
from app.api.deps import get_current_admin
from app.models.models import User, AuditLog, Report, Borrower

router = APIRouter(prefix="/admin", tags=["Admin Panel"])

@router.get("/analytics", response_model=Dict[str, Any])
def get_system_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Retrieves system-wide performance indices and count summaries.
    """
    total_users = db.query(User).count()
    total_reports = db.query(Report).count()
    total_borrowers = db.query(Borrower).count()
    
    # Audit logs
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(10).all()
    audit_trail = []
    for log in logs:
        audit_trail.append({
            "action": log.action,
            "timestamp": str(log.timestamp),
            "details": log.details
        })

    return {
        "metrics": {
            "total_users": total_users,
            "total_reports_generated": total_reports,
            "total_borrowers_onboarded": total_borrowers,
            "system_health": "Optimal",
            "active_tasks_count": 0
        },
        "audit_logs": audit_trail
    }

@router.get("/templates", response_model=List[Dict[str, Any]])
def get_templates(admin: User = Depends(get_current_admin)):
    """
    Returns lists of active loan credit report templates supported by the compiler.
    """
    return [
        {"id": "real_estate", "name": "Real Estate Development", "sector": "Construction"},
        {"id": "manufacturing", "name": "Manufacturing Factory Setup", "sector": "Industrial"},
        {"id": "hospital", "name": "Multi-specialty Hospital Facility", "sector": "Healthcare"},
        {"id": "hotel", "name": "Hotel and Hospitality project", "sector": "Tourism"},
        {"id": "warehouse", "name": "Logistics & Warehousing", "sector": "Logistics"},
        {"id": "education", "name": "K-12 School & Higher Ed Campus", "sector": "Social Infra"},
        {"id": "solar", "name": "Utility-Scale Solar Energy IPP", "sector": "Renewables"},
        {"id": "msme", "name": "MSME General Expansion Facility", "sector": "MSME"}
    ]

@router.get("/users", response_model=List[Dict[str, Any]])
def get_all_users(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    users = db.query(User).all()
    return [{"id": str(u.id), "email": u.email, "role": u.role, "created_at": str(u.created_at)} for u in users]
