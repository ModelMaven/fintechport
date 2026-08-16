import json
import logging
import httpx
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        # Retrieve key from environment variable directly or fallback to config settings
        self.api_key = settings.GEMINI_API_KEY
        if not self.api_key and settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "mock_openai_key":
            self.api_key = settings.OPENAI_API_KEY
            
        if self.api_key:
            logger.info("AIService initialized with Gemini API Key")
        else:
            logger.warning("AIService initialized without API Key, using mock data")

    def generate_report_section(self, section_name: str, borrower_info: Dict[str, Any], project_info: Dict[str, Any], financial_info: Optional[Dict[str, Any]] = None) -> str:
        """
        Generates narrative paragraphs for a given report section using Gemini API.
        Enables Google Search Grounding to fetch live market and industry data.
        """
        if not self.api_key:
            return self._generate_mock_section(section_name, borrower_info, project_info, financial_info)

        prompt = f"""
        You are a Senior Principal Credit Analyst and AI Financial Writer at a Big Four consulting firm.
        Generate an institutional-grade, professional bank project report section.
        
        Section to Generate: {section_name}
        
        Borrower Details:
        {json.dumps(borrower_info, indent=2)}
        
        Project Details:
        {json.dumps(project_info, indent=2)}
        
        Financial Data & Ratios:
        {json.dumps(financial_info or {}, indent=2)}
        
        Instructions:
        - Use premium, high-level corporate vocabulary.
        - Be objective, analytical, and thorough.
        - Do not use placeholders (e.g. [Insert Name]).
        - Output the section directly as structured text or markdown.
        """

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ],
            "tools": [
                {"googleSearch": {}}
            ],
            "generationConfig": {
                "temperature": 0.2
            }
        }

        try:
            with httpx.Client(timeout=90.0) as client:
                response = client.post(url, headers=headers, json=payload)
                if response.status_code == 200:
                    res_json = response.json()
                    candidates = res_json.get("candidates", [])
                    if candidates:
                        content_obj = candidates[0].get("content", {})
                        parts = content_obj.get("parts", [])
                        if parts:
                            return parts[0].get("text", "")
                    
                    logger.error(f"Gemini response structure mismatch: {response.text}")
                else:
                    logger.error(f"Gemini API returned error status {response.status_code}: {response.text}")
            
            return self._generate_mock_section(section_name, borrower_info, project_info, financial_info)
        except Exception as e:
            logger.error(f"Gemini API error during {section_name} generation: {e}")
            return self._generate_mock_section(section_name, borrower_info, project_info, financial_info)

    def _generate_mock_section(self, section: str, borrower: Dict[str, Any], project: Dict[str, Any], financials: Optional[Dict[str, Any]]) -> str:
        company = borrower.get("company_name", "the Borrower")
        industry = borrower.get("industry", "Manufacturing")
        proj_name = project.get("project_name", "Proposed Expansion Project")
        location = project.get("location", "the main site")
        
        mock_data = {
            "Executive Summary": f"""### Executive Summary

LoanCraft AI has prepared this credit proposal on behalf of **{company}**, seeking a credit facility for their upcoming project: **{proj_name}** at {location}.

The borrower represents an established market player in the {industry} sector with strong promoter backing and solid credit fundamentals. The total cost of the proposed project is estimated at Rs. {project.get('technical_details', {}).get('total_cost', '12.50')} Crores, which is proposed to be funded via a Term Loan of Rs. {project.get('technical_details', {}).get('term_loan', '8.00')} Crores and a promoter contribution of Rs. {project.get('technical_details', {}).get('promoter_equity', '4.50')} Crores (Debt-Equity ratio of {project.get('technical_details', {}).get('debt_equity', '1.78')}:1).

Based on our credit assessment, the project shows high financial viability with an estimated DSCR of 1.85 and an IRR of 18.4%. We recommend sanctioning the requested credit limit subject to the standard covenant clauses.""",

            "Borrower Profile": f"""### Borrower Profile & Promoter Analysis

**{company}** was established as a {borrower.get('constitution', 'Private Limited Company')} to cater to rising demands in the {industry} industry. The company operates with a strong organizational framework under the guidance of key promoters who hold over two decades of combined experience in technical and business operations.

#### Promoter Details
- **Key Promoter 1**: Core experience in corporate planning and production control. Track record of successfully executing two large-scale expansion plans.
- **Key Promoter 2**: Manages business administration, compliance, and corporate finance. Net worth is fully backed by liquid investments and real estate assets.

The promoter's group exhibits high creditworthiness and is willing to pledge personal guarantees alongside primary corporate security. Shareholding is concentrated among promoters, assuring quick decision-making processes.""",

            "Industry Analysis": f"""### Industry Analysis & Market Dynamics

The {industry} sector has witnessed secular growth over the last five years, driven by robust macroeconomic tailwinds and progressive policy frameworks. 

#### Key Drivers
1. **Demand Expansion**: Increased consumer spending and industrial activities have expanded the addressable market size.
2. **Technological Advancements**: Process automation and energy-efficient systems have improved operating margins across mid-sized enterprises.
3. **Supply Chain Consolidation**: Shift towards localized manufacturing has benefited domestic operators.

#### Market Positioning
{company} is strategically positioned to capture local market share. By locating the project in a high-growth corridor, the company gains proximity to key supply lines, minimizing logistics overheads and improving competitive margins relative to larger peers.""",

            "SWOT": f"""### SWOT Analysis

#### Strengths
- Experienced promoters with a proven execution track record in {industry}.
- High operating efficiency with modern production facilities.
- Close proximity to major industrial centers, optimizing raw material sourcing.

#### Weaknesses
- Exposure to global raw material price fluctuations.
- Working capital intensive cycle during peak seasons.

#### Opportunities
- Expansion into export markets through custom duty benefits.
- Diversification of product range with higher-margin value-added lines.

#### Threats
- Entry of low-cost regional competitors.
- Sudden regulatory changes or environmental compliance guidelines.""",

            "Project Feasibility": f"""### Project Feasibility & Technical Analysis

The proposed project **{proj_name}** represents a modern, technically viable expansion of the company's production facilities.

#### Infrastructure & Utilities
- **Land & Building**: The company has acquired industrial land with approved zoning layout. Construction is slated to take 9 months.
- **Machinery**: High-speed automated machinery sourced from Tier-1 global suppliers. Under warranty with robust AMC agreements.
- **Power & Water**: Sanctioned load of 500 KVA obtained from regional electricity boards. Standard water connections and rainwater harvesting systems integrated.

#### Technical Feasibility
The plant layout is optimized for modular scale-ups. The raw material supply is secured via contracts with multiple local suppliers, minimizing procurement risks.""",

            "Risk Analysis": f"""### Risk Analysis & Mitigating Covenants

Every commercial project carries intrinsic risks. Our analysis highlights the following key risks and active mitigations:

1. **Project Execution Risk (Delays)**:
   * *Mitigation*: The company has signed a fixed-price, fixed-duration contract with a Tier-1 EPC contractor with clear penalty clauses for delay.
2. **Raw Material Price Volatility Risk**:
   * *Mitigation*: Forward contracts and long-term pricing agreements for 40% of standard raw materials.
3. **Interest Rate Risk**:
   * *Mitigation*: The project model is stress-tested at a +200 bps increase in lending rates, maintaining an acceptable DSCR above 1.35.""",

            "Credit Opinion": f"""### Credit Opinion

**{company}** presents a favorable credit profile. Financial performance over the audited period shows consistent growth in revenue and EBITDA margins. The promoters possess significant net worth relative to the loan size, indicating high capability to service emergency equity injections if needed.

Ratios are balanced, and the leverage is aligned with banking norms for the {industry} sector. Debt Service Coverage remains healthy at an average of 1.75 across the projected repayment tenure. The cash flows demonstrate high predictability.""",

            "Bank Recommendation": f"""### Bank Recommendation & Credit Conditions

We recommend the sanction of the following credit facilities for **{company}**'s proposed project:

1. **Term Loan**: Rs. {project.get('technical_details', {}).get('term_loan', '8.00')} Crores for project capital expenditure.
2. **Cash Credit (Working Capital)**: Rs. 2.00 Crores for managing operational cycles.

#### Key Conditions & Covenants
* **Debt-Equity Ratio**: To be maintained below 2.0x during the tenure of the loan.
* **DSCR**: Standard covenant requiring DSCR to remain above 1.25x.
* **Escrow Account**: All project revenues to be routed through a dedicated Escrow Account monitored by the lead bank."""
        }

        return mock_data.get(section, f"### {section}\n\nComprehensive assessment regarding {company}'s project proposal in the {industry} sector. Detailed notes will be generated upon full API integration.")

    def autofill_proposal(self, company_name: str, user_prompt: str) -> Dict[str, Any]:
        """
        Uses Gemini API with Google Search Grounding to automatically fetch data from the internet
        and construct a completed 15-step proposal JSON payload.
        """
        if not self.api_key:
            return {
                "company_name": company_name,
                "constitution": "Private Limited Company",
                "industry": "Manufacturing",
                "reg_number": "U74999DL2024PTC123456",
                "inc_date": "2024-01-01",
                "promoter_details": [{"name": "Promoter A", "age": 45, "equity_percentage": 100, "net_worth": 0.0}],
                "business_overview": "Mocked Business overview generated from default prompt.",
                "market_share": "10%",
                "major_customers": "Standard local buyers",
                "completed_projects": [{"name": "Phase I Expansion", "cost": "2.5 Cr", "year": "2023"}],
                "ongoing_projects": [],
                "proposed_project_name": "Proposed Greenfield Project",
                "proposed_project_type": "Manufacturing",
                "proposed_location": "Industrial Area, Phase 2",
                "proposed_capacity": "5000 units/day",
                "total_project_cost": 100000000.0,
                "term_loan_required": 70000000.0,
                "promoter_equity": 30000000.0,
                "working_capital_required": 15000000.0,
                "land_cost": 25000000.0,
                "building_cost": 35000000.0,
                "machinery_cost": 40000000.0,
                "contingency_cost": 0.0,
                "current_assets": 30000000.0,
                "current_liabilities": 20000000.0,
                "projected_turnover": 120000000.0,
                "financial_years": [
                    {"year": "2023", "revenue": 80000000.0, "net_profit": 5000000.0},
                    {"year": "2024", "revenue": 95000000.0, "net_profit": 6500000.0},
                    {"year": "2025", "revenue": 110000000.0, "net_profit": 8000000.0}
                ],
                "projected_years": [
                    {"year": "2026", "revenue": 130000000.0, "net_profit": 11000000.0},
                    {"year": "2027", "revenue": 155000000.0, "net_profit": 14000000.0}
                ],
                "repayment_tenure_months": 84,
                "moratorium_months": 12,
                "interest_rate_pct": 10.5,
                "primary_security": "Hypothecation of plant and machinery",
                "collateral_security": "Charge over factory land and building",
                "guarantees": "Personal guarantees of the promoters"
            }

        prompt = f"""
        Search the web and gather information about the company: "{company_name}"
        Context/Additional Prompt: {user_prompt}
        
        Generate a complete credit proposal data set for this company matching this JSON structure:
        {{
            "company_name": "...",
            "constitution": "Private Limited Company" (or "Public Limited Company", "Limited Liability Partnership (LLP)", "Proprietorship", "Partnership Firm"),
            "industry": "Manufacturing" (or "Real Estate Development", "Healthcare & Hospitals", "Hotel & Hospitality", "Solar Energy IPP", "Logistics & Warehouse"),
            "reg_number": "...",
            "inc_date": "YYYY-MM-DD",
            "promoter_details": [
                {{
                    "name": "...",
                    "age": 45,
                    "equity_percentage": 100,
                    "net_worth": 0.0
                }}
            ],
            "business_overview": "...",
            "market_share": "...",
            "major_customers": "...",
            "completed_projects": [
                {{
                    "name": "...",
                    "cost": "... Cr",
                    "year": "..."
                }}
            ],
            "ongoing_projects": [
                {{
                    "name": "...",
                    "cost": "... Cr",
                    "status": "..."
                }}
            ],
            "proposed_project_name": "...",
            "proposed_project_type": "Manufacturing" (or other list types),
            "proposed_location": "...",
            "proposed_capacity": "...",
            "total_project_cost": 125000000.0,
            "term_loan_required": 80000000.0,
            "promoter_equity": 45000000.0,
            "working_capital_required": 20000000.0,
            "land_cost": 30000000.0,
            "building_cost": 40000000.0,
            "machinery_cost": 50000000.0,
            "contingency_cost": 5000000.0,
            "current_assets": 40000000.0,
            "current_liabilities": 25000000.0,
            "projected_turnover": 150000000.0,
            "financial_years": [
                {{"year": "2023", "revenue": 100000000.0, "net_profit": 8000000.0}},
                {{"year": "2024", "revenue": 120000000.0, "net_profit": 10000000.0}},
                {{"year": "2025", "revenue": 140000000.0, "net_profit": 12000000.0}}
            ],
            "projected_years": [
                {{"year": "2026", "revenue": 160000000.0, "net_profit": 15000000.0}},
                {{"year": "2027", "revenue": 190000000.0, "net_profit": 18000000.0}}
            ],
            "repayment_tenure_months": 84,
            "moratorium_months": 12,
            "interest_rate_pct": 10.5,
            "primary_security": "...",
            "collateral_security": "...",
            "guarantees": "..."
        }}
        
        Return ONLY valid JSON. Do not include markdown formatting or backticks like ```json.
        """

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ],
            "tools": [
                {"googleSearch": {}}
            ],
            "generationConfig": {
                "temperature": 0.2
            }
        }

        try:
            logger.info(f"Sending autofill request to Gemini for: {company_name}")
            with httpx.Client(timeout=90.0) as client:
                response = client.post(url, headers=headers, json=payload)
                logger.info(f"Gemini API returned status code {response.status_code}")
                if response.status_code == 200:
                    res_json = response.json()
                    candidates = res_json.get("candidates", [])
                    if candidates:
                        content_obj = candidates[0].get("content", {})
                        parts = content_obj.get("parts", [])
                        if parts:
                            txt = parts[0].get("text", "").strip()
                            logger.info(f"Gemini raw response text length: {len(txt)}")
                            if txt.startswith("```"):
                                txt = txt.split("```")[1]
                                if txt.startswith("json"):
                                    txt = txt[4:]
                            return json.loads(txt.strip())
                    logger.error(f"Gemini response structure mismatch: {res_json}")
                else:
                    logger.error(f"Gemini API error status: {response.text}")
            return {}
        except Exception as e:
            logger.error(f"Gemini autofill API error: {e}")
            return {}

ai_service = AIService()
