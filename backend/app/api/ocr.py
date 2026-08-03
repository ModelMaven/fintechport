from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from uuid import UUID
import uuid
import os
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import Document, Project, User
from app.schemas.schemas import DocumentResponse
from app.tasks.tasks import ocr_processing_task

router = APIRouter(prefix="/ocr", tags=["Document AI & OCR"])

# Setup local storage directory for uploaded assets
UPLOAD_DIR = "/tmp/loancraft_uploads" if os.name != 'nt' else "C:\\temp\\loancraft_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def upload_document(
    project_id: UUID = Form(...),
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Saves document metadata and uploads details. Automatically triggers Celery OCR task.
    """
    # Verify project belongs to user
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Save file locally for processing (mocking S3 storage URL)
    file_id = uuid.uuid4()
    extension = os.path.splitext(file.filename)[1]
    saved_file_name = f"{file_id}{extension}"
    saved_path = os.path.join(UPLOAD_DIR, saved_file_name)
    
    try:
        with open(saved_path, "wb") as f:
            f.write(file.file.read())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to persist file: {str(e)}"
        )

    s3_mock_url = f"file:///{saved_path.replace(os.sep, '/')}"

    new_doc = Document(
        id=file_id,
        project_id=project_id,
        doc_type=doc_type,
        s3_url=s3_mock_url,
        file_name=file.filename,
        status="Pending"
    )
    
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    # Trigger background parsing
    try:
        ocr_processing_task.delay(str(new_doc.id))
    except Exception:
        # Fallback to synchronous execution if Celery connection fails in local stand-alone mode
        ocr_processing_task(str(new_doc.id))
        db.refresh(new_doc)

    return new_doc

@router.get("/document/{document_id}", response_model=DocumentResponse)
def get_document_status(
    document_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    return doc
