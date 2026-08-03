# LoanCraft AI

LoanCraft AI is an institutional-grade SaaS platform designed to generate professional bank loan project reports and credit appraisal dossiers using AI and advanced financial engines. The documents generated match formatting and calculation standards required by major financial institutions like State Bank of India (SBI), HDFC, ICICI, Axis, PNB, BOB, and SIDBI.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide React, Framer Motion
- **Backend**: Python FastAPI, SQLAlchemy, PostgreSQL, Celery, Redis
- **Appraisal Modules**: Custom NumPy-equivalent cash flow engine, document parsing OCR adapters, OpenAI GPT-5.5 / GPT-4 templates
- **Infrastructure**: Docker Compose containerization, GitHub actions CI/CD

---

## 📁 Project Architecture & Layout

```
LoanCraftAI/
├── backend/
│   ├── app/
│   │   ├── api/             # API Router endpoints (borrowers, calculations, reports, ocr, admin)
│   │   ├── core/            # Config, database context, Celery app configurations
│   │   ├── models/          # SQLAlchemy Database schemas
│   │   ├── schemas/         # Pydantic data contracts
│   │   ├── services/        # Business logic (calc_engine.py, ai_service.py, ocr_service.py, report_generator.py)
│   │   └── tasks/           # Celery workers for OCR and document generation
│   ├── tests/               # Pytest suite and standalone test runners
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router folders (Dashboard, Wizard, Admin panel)
│   │   ├── components/      # UI components (Sidebar, preview drawers)
│   │   ├── lib/             # API client methods
│   │   └── styles/          # Tailwind globals with premium minimalist colors
│   └── Dockerfile
├── docker-compose.yml       # Orchestrates local PostgreSQL, Redis, Celery, FastAPI, and Next.js
└── README.md
```

---

## 📊 Financial Appraisals Formulas

LoanCraft AI's appraisal module (`calc_engine.py`) calculates ratios using commercial banking models:

### 1. Debt Service Coverage Ratio (DSCR)
$$\text{DSCR}_t = \frac{\text{PAT}_t + \text{Depreciation}_t + \text{Interest on Term Loan}_t}{\text{Principal Repayment}_t + \text{Interest on Term Loan}_t}$$
*Standard covenant checks alert if DSCR dips below **1.25x**.*

### 2. Net Present Value (NPV) & Internal Rate of Return (IRR)
$$\text{NPV} = \sum_{t=0}^{N} \frac{\text{Free Cash Flow}_t}{(1 + r)^t} - \text{Initial Investment}$$
- **IRR**: Solved numerically via the bisection root-finding method on Net Present Values.

### 3. Maximum Permissible Bank Finance (MPBF)
- **Tandon Committee Method I**:
  $$\text{MPBF} = 0.75 \times (\text{Current Assets} - \text{Current Liabilities other than Bank Borrowing})$$
- **Tandon Committee Method II**:
  $$\text{MPBF} = 0.75 \times \text{Current Assets} - (\text{Current Liabilities other than Bank Borrowing})$$
- **Nayak Committee (Turnover Method)**:
  $$\text{Working Capital Requirement} = 0.25 \times \text{Projected Turnover}$$
  $$\text{Bank Finance (MPBF)} = 0.20 \times \text{Projected Turnover} \quad | \quad \text{Promoter Margin} = 0.05 \times \text{Projected Turnover}$$

---

## ⚡ Local Quickstart Guide

### Prerequisite
Ensure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is installed.

### 1. Start via Docker Compose
From the root directory, spin up all database and app containers in background:
```bash
docker-compose up --build -d
```

Containers launched:
- **loancraft_db** (PostgreSQL on port `5432`)
- **loancraft_redis** (Redis cache on port `6379`)
- **loancraft_backend** (FastAPI app on port `8000`)
- **loancraft_celery** (Celery queue worker)
- **loancraft_frontend** (Next.js 15 dashboard on port `3000`)

### 2. Launch Local Dev Terminals (Alternative)
If running without Docker:

**Backend (Python 3.11)**:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend (Node.js 18+)**:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 🧪 Running Unit Tests
To verify mathematical calculation accuracy:
```bash
python backend/tests/run_tests.py
```
This executes liquidity ratios, DSCR projections, and IRR cash flow solutions with zero dependencies.
