import logging
from uuid import UUID
from app.core.celery_app import celery_app
from app.core.database import SessionLocal
from app.models.models import Document, Report, Project, Borrower, Loan, FinancialStatement
from app.services.ocr_service import ocr_service
from app.services.ai_service import ai_service
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

logger = logging.getLogger(__name__)

@celery_app.task(name="app.tasks.ocr_processing_task")
def ocr_processing_task(doc_id_str: str):
    db = SessionLocal()
    try:
        doc_id = UUID(doc_id_str)
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if not doc:
            logger.error(f"Document {doc_id_str} not found in task")
            return

        doc.status = "Processing"
        db.commit()

        # Simulate or call OCR extraction
        # Since standard path is in S3, we write local file simulations or pass the S3 URL
        extracted = ocr_service.process_financial_document(doc.s3_url, doc.doc_type)
        
        doc.extracted_data = extracted.get("extracted_data", {})
        doc.status = "Completed"
        db.commit()
        logger.info(f"Successfully processed Document {doc_id_str}")
        
    except Exception as e:
        logger.error(f"Error in OCR task: {e}")
        db.rollback()
        try:
            doc = db.query(Document).filter(Document.id == UUID(doc_id_str)).first()
            if doc:
                doc.status = "Failed"
                db.commit()
        except Exception:
            pass
    finally:
        db.close()


@celery_app.task(name="app.tasks.report_generation_task")
def report_generation_task(report_id_str: str):
    db = SessionLocal()
    try:
        report_id = UUID(report_id_str)
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            logger.error(f"Report {report_id_str} not found in task")
            return

        report.status = "Generating"
        db.commit()

        # Gather Project, Borrower, Loans, and Financial Statements
        project = db.query(Project).filter(Project.id == report.project_id).first()
        borrower = db.query(Borrower).filter(Borrower.id == project.borrower_id).first()
        loans = db.query(Loan).filter(Loan.project_id == project.id).all()
        financials = db.query(FinancialStatement).filter(FinancialStatement.project_id == project.id).all()

        # Map details for prompt processing
        borrower_info = {
            "company_name": borrower.company_name,
            "constitution": borrower.constitution,
            "industry": borrower.industry,
            "registration_number": borrower.registration_number,
            "date_of_incorporation": str(borrower.date_of_incorporation) if borrower.date_of_incorporation else None,
            "promoter_details": borrower.promoter_details,
            "shareholding_pattern": borrower.shareholding_pattern
        }

        project_info = {
            "project_name": project.project_name,
            "project_type": project.project_type,
            "location": project.location,
            "status": project.status,
            "technical_details": project.technical_details or {}
        }

        # Compute averages & compile key figures for the AI prompt
        calc_summary = {}
        if financials:
            # Sort by year
            fin_sorted = sorted(financials, key=lambda f: f.financial_year)
            latest = fin_sorted[-1]
            
            # Extract asset & liability items for simple ratio check
            bs = latest.balance_sheet
            pl = latest.profit_and_loss
            
            current_assets = bs.get("assets", {}).get("current_assets", {}).get("total_current_assets", 0.0)
            current_liabs = bs.get("liabilities", {}).get("current_liabilities", {}).get("total_current_liabilities", 0.0)
            inventory = bs.get("assets", {}).get("current_assets", {}).get("inventories", 0.0)
            
            net_worth = bs.get("liabilities", {}).get("shareholders_funds", {}).get("tangible_net_worth", 0.0)
            total_debt = bs.get("liabilities", {}).get("non_current_liabilities", {}).get("long_term_borrowings", 0.0) + \
                         bs.get("liabilities", {}).get("current_liabilities", {}).get("short_term_borrowings", 0.0)
            
            pat = pl.get("profitability", {}).get("profit_after_tax", 0.0)
            depr = pl.get("expenses", {}).get("depreciation_and_amortization", 0.0)
            interest = pl.get("expenses", {}).get("finance_costs_interest", 0.0)
            
            # Simple assumption: repayment principal is roughly 10% of debt or matches term loans
            principal_repay = total_debt * 0.1
            
            # Run calculations
            calc_summary = {
                "current_ratio": calculate_current_ratio(current_assets, current_liabs),
                "quick_ratio": calculate_quick_ratio(current_assets, inventory, current_liabs),
                "debt_equity": calculate_debt_equity(total_debt, net_worth),
                "dscr": calculate_dscr(pat, depr, interest, principal_repay)
            }

        # Generate AI sections
        exec_summary = ai_service.generate_report_section("Executive Summary", borrower_info, project_info, calc_summary)
        profile_summary = ai_service.generate_report_section("Borrower Profile", borrower_info, project_info, calc_summary)
        industry_analysis = ai_service.generate_report_section("Industry Analysis", borrower_info, project_info, calc_summary)
        swot_analysis = ai_service.generate_report_section("SWOT", borrower_info, project_info, calc_summary)
        feasibility = ai_service.generate_report_section("Project Feasibility", borrower_info, project_info, calc_summary)
        risk_analysis = ai_service.generate_report_section("Risk Analysis", borrower_info, project_info, calc_summary)
        credit_opinion = ai_service.generate_report_section("Credit Opinion", borrower_info, project_info, calc_summary)
        recommendation = ai_service.generate_report_section("Bank Recommendation", borrower_info, project_info, calc_summary)

        # Assemble full report details
        report_data = {
            "borrower_details": borrower_info,
            "project_details": project_info,
            "executive_summary": exec_summary,
            "borrower_profile": profile_summary,
            "industry_analysis": industry_analysis,
            "swot_analysis": swot_analysis,
            "project_feasibility": feasibility,
            "risk_analysis": risk_analysis,
            "credit_opinion": credit_opinion,
            "recommendation": recommendation,
            "financials": calc_summary,
            "generation_metadata": {
                "engine": "OpenAI GPT-5.5 / GPT-4",
                "audited_years": [f.financial_year for f in financials] if financials else []
            }
        }

        # Set mock download links
        report.report_data = report_data
        report.pdf_url = f"/api/v1/reports/{report_id_str}/export/pdf"
        report.docx_url = f"/api/v1/reports/{report_id_str}/export/docx"
        report.status = "Completed"
        
        db.commit()
        logger.info(f"Successfully generated Report {report_id_str}")

    except Exception as e:
        logger.error(f"Error in Report Generation task: {e}")
        db.rollback()
        try:
            report = db.query(Report).filter(Report.id == UUID(report_id_str)).first()
            if report:
                report.status = "Failed"
                db.commit()
        except Exception:
            pass
    finally:
        db.close()
