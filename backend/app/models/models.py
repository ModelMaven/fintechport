import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Numeric, Integer, Date, JSON, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    clerk_id = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, default="user")  # admin, user
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    borrowers = relationship("Borrower", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")


class Borrower(Base):
    __tablename__ = "borrowers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company_name = Column(String, index=True, nullable=False)
    constitution = Column(String, nullable=False)  # Pvt Ltd, LLP, Partnership, MSME, Startup, etc.
    industry = Column(String, nullable=False)      # Real Estate, Manufacturing, Hospital, Hotel, etc.
    registration_number = Column(String, nullable=True)
    pan = Column(String, nullable=True)
    date_of_incorporation = Column(Date, nullable=True)
    registered_address = Column(Text, nullable=True)
    office_address = Column(Text, nullable=True)
    promoter_details = Column(JSON, nullable=True)     # List of dicts (name, equity_percentage, age, net_worth)
    shareholding_pattern = Column(JSON, nullable=True) # Dict of share percentage by type/owner
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="borrowers")
    projects = relationship("Project", back_populates="borrower", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    borrower_id = Column(UUID(as_uuid=True), ForeignKey("borrowers.id", ondelete="CASCADE"), nullable=False)
    project_name = Column(String, index=True, nullable=False)
    project_type = Column(String, nullable=False)  # Manufacturing, Hospitality, Real Estate, Solar, etc.
    location = Column(String, nullable=False)
    status = Column(String, default="Proposed")    # Completed, Ongoing, Proposed
    technical_details = Column(JSON, nullable=True) # Capacity, land area, utility requirements, etc.
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    borrower = relationship("Borrower", back_populates="projects")
    loans = relationship("Loan", back_populates="project", cascade="all, delete-orphan")
    financial_statements = relationship("FinancialStatement", back_populates="project", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="project", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="project", cascade="all, delete-orphan")


class Loan(Base):
    __tablename__ = "loans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    bank_name = Column(String, nullable=False)
    facility_type = Column(String, nullable=False) # Term Loan, Cash Credit, Bank Guarantee, etc.
    limit_amount = Column(Numeric(15, 2), nullable=False)
    outstanding_amount = Column(Numeric(15, 2), default=0.00)
    interest_rate = Column(Numeric(5, 2), nullable=False) # e.g. 9.50%
    tenure_months = Column(Integer, nullable=False)
    repayment_terms = Column(JSON, nullable=True)  # Principal repayment structure, moratorium period
    security_offered = Column(JSON, nullable=True)  # Primary, Collateral, Guarantees
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    project = relationship("Project", back_populates="loans")


class FinancialStatement(Base):
    __tablename__ = "financial_statements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    financial_year = Column(Integer, nullable=False) # e.g. 2024, 2025, 2026
    statement_type = Column(String, nullable=False)  # Audited, Provisional, Projected
    balance_sheet = Column(JSON, nullable=False)     # JSON structured details of assets and liabilities
    profit_and_loss = Column(JSON, nullable=False)   # JSON structured details of revenue and expenses
    cash_flow = Column(JSON, nullable=True)         # JSON structured details of inflows and outflows
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    project = relationship("Project", back_populates="financial_statements")


class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    doc_type = Column(String, nullable=False)        # Balance Sheet, PnL, GST Return, Bank Statement, Land Documents
    s3_url = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    status = Column(String, default="Pending")       # Pending, Processing, Completed, Failed
    extracted_data = Column(JSON, nullable=True)     # JSON output of key fields and structured tables
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    project = relationship("Project", back_populates="documents")


class Report(Base):
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    report_name = Column(String, nullable=False)
    template_type = Column(String, nullable=False)   # Real Estate, Manufacturing, Hospital, Warehousing, etc.
    report_data = Column(JSON, nullable=True)        # Final parsed data combining text narratives, numbers, charts
    status = Column(String, default="Draft")         # Draft, Generating, Completed, Failed
    pdf_url = Column(String, nullable=True)
    docx_url = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    project = relationship("Project", back_populates="reports")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action = Column(String, nullable=False)
    details = Column(JSON, nullable=True)
    ip_address = Column(String, nullable=True)
    timestamp = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="audit_logs")
