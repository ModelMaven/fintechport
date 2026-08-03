import json
import logging
from typing import Dict, Any, Optional
from openai import OpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.client = None
        if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "mock_openai_key":
            try:
                self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
            except Exception as e:
                logger.error(f"Failed to initialize OpenAI client: {e}")

    def generate_report_section(self, section_name: str, borrower_info: Dict[str, Any], project_info: Dict[str, Any], financial_info: Optional[Dict[str, Any]] = None) -> str:
        """
        Generates narrative paragraphs for a given report section.
        """
        if not self.client:
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

        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo",  # fall back to current stable model
                messages=[
                    {"role": "system", "content": "You are a financial consultant specializing in bank loan credit proposals."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            logger.error(f"OpenAI error during {section_name} generation: {e}")
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

ai_service = AIService()
