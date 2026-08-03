from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import Report, Project, User
from app.schemas.schemas import ReportCreate, ReportResponse, ReportGenerateRequest
from app.tasks.tasks import report_generation_task
from app.services.report_generator import DocumentGeneratorService

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("", response_model=List[ReportResponse])
def get_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Report).join(Project).filter(Report.project_id == Project.id).all()

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    payload: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == payload.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    new_report = Report(
        project_id=payload.project_id,
        report_name=payload.report_name,
        template_type=payload.template_type,
        status="Draft"
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@router.post("/generate", response_model=ReportResponse)
def trigger_generation(
    payload: ReportGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(Report).filter(Report.id == payload.report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = "Generating"
    db.commit()

    # Trigger background tasks
    try:
        report_generation_task.delay(str(report.id))
    except Exception:
        # Fallback to synchronous run if Celery broker is offline
        report_generation_task(str(report.id))
        db.refresh(report)

    return report

@router.get("/{report_id}", response_model=ReportResponse)
def get_report(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.get("/{report_id}/export/docx")
def export_report_docx(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report or not report.report_data:
        raise HTTPException(status_code=400, detail="Report has not been generated yet.")

    stream = DocumentGeneratorService.generate_docx(report.report_name, report.report_data)
    
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={report.report_name.replace(' ', '_')}.docx"}
    )

@router.get("/{report_id}/export/pdf")
def export_report_pdf(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report or not report.report_data:
        raise HTTPException(status_code=400, detail="Report has not been generated yet.")

    stream = DocumentGeneratorService.generate_pdf(report.report_name, report.report_data)
    
    return StreamingResponse(
        stream,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={report.report_name.replace(' ', '_')}.pdf"}
    )
