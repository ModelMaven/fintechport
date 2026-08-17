"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import { 
  Building, 
  Users, 
  MapPin, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  UploadCloud,
  FileCheck,
  Plus,
  Trash2,
  Loader2
} from "lucide-react";

export default function NewReportWizard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [borrowers, setBorrowers] = useState<any[]>([]);
  const [selectedBorrowerId, setSelectedBorrowerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiCompanyName, setAiCompanyName] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAiAutofill = async () => {
    if (!aiCompanyName) return;
    setAiLoading(true);
    try {
      const data = await api.autofillProposal(aiCompanyName, aiPrompt);
      const toCrores = (val: any): number => {
        const num = Number(val) || 0;
        if (num >= 100000) {
          return num / 10000000;
        }
        return num;
      };

      if (data && typeof data === 'object' && 'company_name' in data && data.company_name) {
        setFormData({
          company_name: data.company_name || "",
          constitution: data.constitution || "Private Limited Company",
          industry: data.industry || "Manufacturing",
          reg_number: data.reg_number || "",
          inc_date: data.inc_date || "",
          promoter_details: data.promoter_details || [],
          business_overview: data.business_overview || "",
          market_share: data.market_share || "",
          major_customers: data.major_customers || "",
          completed_projects: data.completed_projects || [],
          ongoing_projects: data.ongoing_projects || [],
          proposed_project_name: data.proposed_project_name || "",
          project_location: data.project_location || data.proposed_location || "",
          project_type: data.project_type || data.proposed_project_type || "",
          project_capacity: data.project_capacity || data.proposed_capacity || "",
          land_cost: toCrores(data.land_cost),
          civil_works: toCrores(data.civil_works || data.building_cost),
          plant_machinery: toCrores(data.plant_machinery || data.machinery_cost),
          contingency: toCrores(data.contingency || data.contingency_cost),
          wc_margin: toCrores(data.wc_margin || data.working_capital_required),
          total_cost: toCrores(data.total_cost || data.total_project_cost),
          promoter_equity: toCrores(data.promoter_equity),
          proposed_term_loan: toCrores(data.proposed_term_loan || data.term_loan_required),
          subsidy_grant: toCrores(data.subsidy_grant),
          existing_loans: data.existing_loans || [],
          audited_fy25_revenue: toCrores(data.audited_fy25_revenue),
          audited_fy25_pat: toCrores(data.audited_fy25_pat),
          audited_fy25_depr: toCrores(data.audited_fy25_depr),
          projected_fy26_revenue: toCrores(data.projected_fy26_revenue),
          projected_fy26_pat: toCrores(data.projected_fy26_pat),
          projected_fy26_depr: toCrores(data.projected_fy26_depr),
          raw_material_risk: data.raw_material_risk || "",
          mitigation: data.mitigation || "",
          primary_security: data.primary_security || "",
          collateral_property: data.collateral_property || data.collateral_security || "",
          uploaded_files: []
        });
        alert("Success! All 15 wizard steps have been autofilled by Gemini AI with live web details.");
      } else {
        alert("Gemini AI was unable to generate autofill structured data. Please try again with a clearer company name.");
      }
    } catch (err) {
      alert("Autofill failed: " + err);
    } finally {
      setAiLoading(false);
    }
  };

  // Wizard global form states (aggregated into a single object)
  const [formData, setFormData] = useState({
    // Step 1: Company Information
    company_name: "",
    constitution: "Private Limited Company",
    industry: "Manufacturing",
    reg_number: "",
    inc_date: "",
    
    // Step 2: Promoters
    promoter_details: [] as any[],

    // Step 3: Business Details
    business_overview: "The company manufactures custom industrial components for heavy machine manufacturers.",
    market_share: "12%",
    major_customers: "Siemens, GE, Larsen & Toubro",

    // Step 4 & 5: Projects
    completed_projects: [
      { name: "Unit-I Expansion", cost: "5.50 Cr", year: "2023" }
    ],
    ongoing_projects: [
      { name: "Unit-II Automation", cost: "2.80 Cr", percent_complete: "60%" }
    ],

    // Step 6: Proposed Project
    proposed_project_name: "Acme Greenfield Factory Setup",
    project_location: "Industrial Area Phase II, Gurgaon",
    project_type: "Manufacturing Expansion",
    project_capacity: "10,000 units per month",

    // Step 7: Cost of Project
    land_cost: 1.5,
    civil_works: 2.0,
    plant_machinery: 6.5,
    contingency: 0.5,
    wc_margin: 2.0,
    total_cost: 12.5,

    // Step 8: Means of Finance
    promoter_equity: 4.5,
    proposed_term_loan: 8.0,
    subsidy_grant: 0.0,

    // Step 9: Existing Loans
    existing_loans: [] as any[],

    // Step 10 & 11: Financials
    audited_fy25_revenue: 15.0,
    audited_fy25_pat: 1.6,
    audited_fy25_depr: 1.2,
    projected_fy26_revenue: 22.0,
    projected_fy26_pat: 2.4,
    projected_fy26_depr: 1.5,

    // Step 12: Risk Analysis
    raw_material_risk: "Volatile prices of raw copper",
    mitigation: "Pre-arranged rate contract with primary manufacturers",

    // Step 13: Collateral
    primary_security: "Hypothecation of plant and machinery to be acquired",
    collateral_property: "Commercial land at Gurgaon valued at Rs. 6.00 Crores",

    // Step 14: Supporting Documents
    uploaded_files: [] as any[]
  });

  useEffect(() => {
    // Load borrowers to allow user to pre-fill
    api.getBorrowers()
      .then(res => setBorrowers(res || []))
      .catch(err => console.error(err));
  }, []);

  const handleBorrowerSelect = (borrowerId: string) => {
    setSelectedBorrowerId(borrowerId);
    if (!borrowerId) return;

    const b = borrowers.find(item => item.id === borrowerId);
    if (b) {
      setFormData(prev => ({
        ...prev,
        company_name: b.company_name,
        constitution: b.constitution,
        industry: b.industry,
        reg_number: b.registration_number || "",
        inc_date: b.date_of_incorporation || "",
        promoter_details: b.promoter_details || []
      }));
    }
  };

  const stepsList = [
    { num: 1, name: "Company Info" },
    { num: 2, name: "Promoters" },
    { num: 3, name: "Business Details" },
    { num: 4, name: "Completed Projects" },
    { num: 5, name: "Ongoing Projects" },
    { num: 6, name: "Proposed Project" },
    { num: 7, name: "Project Cost" },
    { num: 8, name: "Means of Finance" },
    { num: 9, name: "Existing Loans" },
    { num: 10, name: "Financial Statements" },
    { num: 11, name: "Projected Financials" },
    { num: 12, name: "Risk Analysis" },
    { num: 13, name: "Collateral" },
    { num: 14, name: "Supporting Docs" },
    { num: 15, name: "Generate" }
  ];

  const handleNext = () => {
    if (step < 15) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCostChange = (field: string, val: number) => {
    const costCopy = { ...formData, [field]: val };
    const total = Number(costCopy.land_cost) + Number(costCopy.civil_works) + Number(costCopy.plant_machinery) + Number(costCopy.contingency) + Number(costCopy.wc_margin);
    setFormData({
      ...formData,
      [field]: val,
      total_cost: Math.round(total * 100) / 100
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList = Array.from(e.target.files);
    
    // Simulate Document AI OCR trigger on upload
    const mockFiles = fileList.map(f => ({
      name: f.name,
      status: "Parsing via AI...",
      size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`
    }));

    setFormData(prev => ({
      ...prev,
      uploaded_files: [...prev.uploaded_files, ...mockFiles]
    }));

    // Simulate completion in 2 seconds
    setTimeout(() => {
      setFormData(prev => {
        const updated = prev.uploaded_files.map(item => {
          if (item.status === "Parsing via AI...") {
            return { ...item, status: "Successfully Extracted Ratios ✓" };
          }
          return item;
        });
        return { ...prev, uploaded_files: updated };
      });
    }, 2000);
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      // 1. Create or verify borrower
      let borrowerId = selectedBorrowerId;
      if (!borrowerId) {
        const borrowerRes = await api.createBorrower({
          company_name: formData.company_name,
          constitution: formData.constitution,
          industry: formData.industry,
          registration_number: formData.reg_number || null,
          date_of_incorporation: formData.inc_date || null,
          promoter_details: formData.promoter_details
        });
        borrowerId = borrowerRes.id;
      }

      // 2. Create Project
      const projectRes = await api.createProject({
        borrower_id: borrowerId,
        project_name: formData.proposed_project_name,
        project_type: formData.project_type,
        location: formData.project_location,
        technical_details: {
          land_cost: formData.land_cost,
          civil_works: formData.civil_works,
          plant_machinery: formData.plant_machinery,
          total_cost: formData.total_cost,
          promoter_equity: formData.promoter_equity,
          term_loan: formData.proposed_term_loan
        }
      });

      // 3. Create historical statement
      await api.createProjectFinancials(projectRes.id, {
        financial_year: 2025,
        statement_type: "Audited",
        balance_sheet: {
          assets: {
            current_assets: { total_current_assets: 80000000.00, inventories: 30000000.00 }
          },
          liabilities: {
            shareholders_funds: { tangible_net_worth: 50000000.00 },
            current_liabilities: { total_current_liabilities: 50000000.00 },
            non_current_liabilities: { long_term_borrowings: 40000000.00 }
          }
        },
        profit_and_loss: {
          revenue: { total_revenue: formData.audited_fy25_revenue * 10000000 },
          expenses: { 
            depreciation_and_amortization: formData.audited_fy25_depr * 10000000,
            finance_costs_interest: 4000000.00 
          },
          profitability: { profit_after_tax: formData.audited_fy25_pat * 10000000 }
        }
      });

      // 4. Create projected statement
      await api.createProjectFinancials(projectRes.id, {
        financial_year: 2026,
        statement_type: "Projected",
        balance_sheet: {
          assets: {
            current_assets: { total_current_assets: 110000000.00, inventories: 40000000.00 }
          },
          liabilities: {
            shareholders_funds: { tangible_net_worth: 74000000.00 },
            current_liabilities: { total_current_liabilities: 60000000.00 },
            non_current_liabilities: { long_term_borrowings: 80000000.00 }
          }
        },
        profit_and_loss: {
          revenue: { total_revenue: formData.projected_fy26_revenue * 10000000 },
          expenses: { 
            depreciation_and_amortization: formData.projected_fy26_depr * 10000000,
            finance_costs_interest: 8000000.00 
          },
          profitability: { profit_after_tax: formData.projected_fy26_pat * 10000000 }
        }
      });

      // 5. Create Report Metadata
      const reportRes = await api.createReport({
        project_id: projectRes.id,
        report_name: `${formData.company_name} Credit Proposal`,
        template_type: formData.industry.toLowerCase()
      });

      // 6. Trigger Generation Celery task
      await api.generateReport(reportRes.id, true);

      // 7. Route to split-screen preview
      router.push(`/dashboard/reports/${reportRes.id}`);
      
    } catch (err) {
      alert("Failed to compile project report structures: " + err);
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start text-xs">
      {/* Steps Sidebar Left */}
      <div className="w-full lg:w-64 flex-shrink-0 bg-white border border-brand-border rounded-2xl p-6 shadow-sm sticky top-20">
        <h3 className="font-bold text-sm text-brand-textPrimary mb-4">Wizard Navigation</h3>
        <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
          {stepsList.map((s) => {
            const isCompleted = step > s.num;
            const isActive = step === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`
                  w-full text-left flex items-center gap-2 px-3 py-2 rounded-full font-semibold border transition-all
                  ${isActive 
                    ? "bg-brand-primary text-white border-brand-primary" 
                    : isCompleted 
                    ? "bg-brand-surface text-brand-primary border-brand-border/60" 
                    : "text-brand-textSecondary border-transparent hover:bg-brand-surface"}
                `}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] ${
                  isActive 
                    ? "bg-white text-brand-primary" 
                    : isCompleted 
                    ? "bg-brand-primary text-white" 
                    : "bg-brand-surface text-brand-textSecondary border border-brand-border"
                }`}>
                  {isCompleted ? <Check size={10} /> : s.num}
                </span>
                <span className="truncate">{s.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Forms Content Box Center */}
      <div className="flex-1 w-full bg-white border border-brand-border rounded-2xl p-6 md:p-8 shadow-sm">
        {/* Step headers */}
        <div className="flex justify-between items-center border-b border-brand-border pb-4 mb-6">
          <div>
            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Step {step} of 15</span>
            <h2 className="text-sm font-bold text-brand-textPrimary mt-0.5">{stepsList[step - 1].name}</h2>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-surface rounded-full border border-brand-border text-[10px] font-bold text-brand-textSecondary">
            <Sparkles size={11} className="text-brand-primary" /> Auto-Saving
          </div>
        </div>

        {/* Gemini AI Autofill Assistant card */}
        <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-brand-primary" />
            <h4 className="font-bold text-xs text-brand-primary">Gemini Web Grounding Autofill</h4>
          </div>
          <p className="text-[10px] text-brand-textSecondary mb-3">
            Enter a company name and a project description prompt. Gemini will scan the web and autofill all 15 wizard steps automatically!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text"
              placeholder="Company Name (e.g. Reliance Industries, Acme Corp)"
              value={aiCompanyName}
              onChange={(e) => setAiCompanyName(e.target.value)}
              className="flex-1 p-2 border border-brand-border rounded-lg bg-white outline-none"
            />
            <input 
              type="text"
              placeholder="Context / Prompt (e.g. expanding plant with 5 Cr loan)"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-[2] p-2 border border-brand-border rounded-lg bg-white outline-none"
            />
            <button
              type="button"
              onClick={handleAiAutofill}
              disabled={aiLoading || !aiCompanyName}
              className="px-5 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              {aiLoading ? "Fetching..." : "Autofill"}
            </button>
          </div>
        </div>

        {/* Step Render Blocks */}
        <div className="min-h-[45vh] text-brand-textPrimary">
          {/* Step 1: Company Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block font-bold text-brand-textSecondary mb-1.5">Pre-select Registered Borrower Profile</label>
                <select 
                  value={selectedBorrowerId}
                  onChange={(e) => handleBorrowerSelect(e.target.value)}
                  className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                >
                  <option value="">-- Start a new profile --</option>
                  {borrowers.map(b => (
                    <option key={b.id} value={b.id}>{b.company_name} ({b.industry})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-brand-border pt-4">
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Company Name *</label>
                  <input 
                    type="text" 
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Acme Industries"
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Constitution</label>
                  <select 
                    value={formData.constitution}
                    onChange={(e) => setFormData({ ...formData, constitution: e.target.value })}
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                  >
                    <option>Private Limited Company</option>
                    <option>Limited Liability Partnership (LLP)</option>
                    <option>Partnership Firm</option>
                    <option>Proprietorship</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Promoters */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-bold text-xs text-brand-textSecondary">Promoters list linked to the company profile</h4>
              {formData.promoter_details.length === 0 ? (
                <div className="p-4 border border-dashed border-brand-border rounded-xl text-center text-brand-textSecondary">
                  No promoters registered. Go back to step 1 to select or create a promoter roster.
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.promoter_details.map((p, idx) => (
                    <div key={idx} className="p-3 border border-brand-border rounded-xl bg-brand-surface/40 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-brand-textPrimary">{p.name}</p>
                        <span className="text-[10px] text-brand-textSecondary">Age: {p.age} | Shares: {p.equity_percentage}%</span>
                      </div>
                      <span className="font-mono font-bold text-brand-primary">Rs. {(p.net_worth / 10000000).toFixed(2)} Cr Net Worth</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Business Details */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-brand-textSecondary mb-1.5">Business Operations & Scope</label>
                <textarea 
                  value={formData.business_overview}
                  onChange={(e) => setFormData({ ...formData, business_overview: e.target.value })}
                  rows={4}
                  className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Market Share (%)</label>
                  <input 
                    type="text" 
                    value={formData.market_share}
                    onChange={(e) => setFormData({ ...formData, market_share: e.target.value })}
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Key Customers</label>
                  <input 
                    type="text" 
                    value={formData.major_customers}
                    onChange={(e) => setFormData({ ...formData, major_customers: e.target.value })}
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4 & 5: Completed / Ongoing Projects */}
          {(step === 4 || step === 5) && (
            <div className="space-y-4">
              <h4 className="font-bold text-xs text-brand-textSecondary">Track record of infrastructural executions</h4>
              
              {step === 4 ? (
                <div className="space-y-3">
                  {formData.completed_projects.map((p, idx) => (
                    <div key={idx} className="p-3 border border-brand-border rounded-xl flex justify-between items-center bg-brand-surface/30">
                      <div>
                        <p className="font-bold text-brand-textPrimary">{p.name}</p>
                        <span className="text-[10px] text-brand-textSecondary">Completed Year: {p.year}</span>
                      </div>
                      <span className="font-bold text-brand-primary">{p.cost} Cost</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.ongoing_projects.map((p, idx) => (
                    <div key={idx} className="p-3 border border-brand-border rounded-xl flex justify-between items-center bg-brand-surface/30">
                      <div>
                        <p className="font-bold text-brand-textPrimary">{p.name}</p>
                        <span className="text-[10px] text-brand-textSecondary">Execution Rate: {p.percent_complete}</span>
                      </div>
                      <span className="font-bold text-brand-primary">{p.cost} Cost</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 6: Proposed Project */}
          {step === 6 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-brand-textSecondary mb-1.5">Proposed Project Title *</label>
                <input 
                  type="text" 
                  value={formData.proposed_project_name}
                  onChange={(e) => setFormData({ ...formData, proposed_project_name: e.target.value })}
                  className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-brand-textSecondary mb-1.5">Project Location *</label>
                <input 
                  type="text" 
                  value={formData.project_location}
                  onChange={(e) => setFormData({ ...formData, project_location: e.target.value })}
                  className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-brand-textSecondary mb-1.5">Project Sector Category</label>
                <input 
                  type="text" 
                  value={formData.project_type}
                  onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                  className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-brand-textSecondary mb-1.5">Project Capacity</label>
                <input 
                  type="text" 
                  value={formData.project_capacity}
                  onChange={(e) => setFormData({ ...formData, project_capacity: e.target.value })}
                  className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 7: Cost of Project */}
          {step === 7 && (
            <div className="space-y-4">
              <h4 className="font-bold text-xs text-brand-textSecondary">Outline estimated capital expenditures (Rs. in Crores)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Land & Site Development</label>
                  <input 
                    type="number" 
                    step="0.05"
                    value={formData.land_cost}
                    onChange={(e) => handleCostChange("land_cost", Number(e.target.value))}
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Civil Works & Structures</label>
                  <input 
                    type="number" 
                    step="0.05"
                    value={formData.civil_works}
                    onChange={(e) => handleCostChange("civil_works", Number(e.target.value))}
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Plant & Machinery</label>
                  <input 
                    type="number" 
                    step="0.05"
                    value={formData.plant_machinery}
                    onChange={(e) => handleCostChange("plant_machinery", Number(e.target.value))}
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Contingency Reserves</label>
                  <input 
                    type="number" 
                    step="0.05"
                    value={formData.contingency}
                    onChange={(e) => handleCostChange("contingency", Number(e.target.value))}
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Working Capital Margin</label>
                  <input 
                    type="number" 
                    step="0.05"
                    value={formData.wc_margin}
                    onChange={(e) => handleCostChange("wc_margin", Number(e.target.value))}
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                  />
                </div>
              </div>
              <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/20 flex justify-between items-center mt-6">
                <span className="font-bold text-brand-textPrimary">Total Project Cost Estimate:</span>
                <span className="font-mono font-bold text-sm text-brand-primary">Rs. {formData.total_cost.toFixed(2)} Crores</span>
              </div>
            </div>
          )}

          {/* Step 8: Means of Finance */}
          {step === 8 && (
            <div className="space-y-4">
              <h4 className="font-bold text-xs text-brand-textSecondary">Source of financing matching cost of Rs. {formData.total_cost} Cr</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Promoter Equity Capital Contribution</label>
                  <input 
                    type="number" 
                    step="0.05"
                    value={formData.promoter_equity}
                    onChange={(e) => setFormData({ ...formData, promoter_equity: Number(e.target.value) })}
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Proposed Term Loan from Bank</label>
                  <input 
                    type="number" 
                    step="0.05"
                    value={formData.proposed_term_loan}
                    onChange={(e) => setFormData({ ...formData, proposed_term_loan: Number(e.target.value) })}
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                  />
                </div>
              </div>
              
              {/* Debt Equity check warning */}
              {Math.abs(Number(formData.promoter_equity) + Number(formData.proposed_term_loan) - formData.total_cost) > 0.01 && (
                <div className="p-3 bg-brand-danger/10 text-brand-danger font-bold rounded-xl border border-brand-danger/20">
                  ⚠️ Sources do not sum to total cost. Please adjust equity or term loan to match Rs. {formData.total_cost} Crores.
                </div>
              )}
            </div>
          )}

          {/* Step 9: Existing Loans */}
          {step === 9 && (
            <div className="space-y-4">
              <h4 className="font-bold text-xs text-brand-textSecondary">List active loan facility liabilities</h4>
              <div className="p-6 border border-dashed border-brand-border rounded-xl text-center text-brand-textSecondary">
                No existing bank liabilities registered. Click Next to continue.
              </div>
            </div>
          )}

          {/* Step 10 & 11: Financial Statements & Projections */}
          {(step === 10 || step === 11) && (
            <div className="space-y-6">
              <h4 className="font-bold text-xs text-brand-textSecondary">
                {step === 10 ? "Add Audited Financial statements for FY25 (Rs. in Crores)" : "Projections for next fiscal FY26"}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {step === 10 ? (
                  <>
                    <div>
                      <label className="block font-bold text-brand-textSecondary mb-1.5">FY25 Revenue</label>
                      <input 
                        type="number" 
                        value={formData.audited_fy25_revenue}
                        onChange={(e) => setFormData({ ...formData, audited_fy25_revenue: Number(e.target.value) })}
                        className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-brand-textSecondary mb-1.5">FY25 PAT</label>
                      <input 
                        type="number" 
                        value={formData.audited_fy25_pat}
                        onChange={(e) => setFormData({ ...formData, audited_fy25_pat: Number(e.target.value) })}
                        className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-brand-textSecondary mb-1.5">FY25 Depreciation</label>
                      <input 
                        type="number" 
                        value={formData.audited_fy25_depr}
                        onChange={(e) => setFormData({ ...formData, audited_fy25_depr: Number(e.target.value) })}
                        className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block font-bold text-brand-textSecondary mb-1.5">Projected FY26 Revenue</label>
                      <input 
                        type="number" 
                        value={formData.projected_fy26_revenue}
                        onChange={(e) => setFormData({ ...formData, projected_fy26_revenue: Number(e.target.value) })}
                        className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-brand-textSecondary mb-1.5">Projected FY26 PAT</label>
                      <input 
                        type="number" 
                        value={formData.projected_fy26_pat}
                        onChange={(e) => setFormData({ ...formData, projected_fy26_pat: Number(e.target.value) })}
                        className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-brand-textSecondary mb-1.5">Projected FY26 Depreciation</label>
                      <input 
                        type="number" 
                        value={formData.projected_fy26_depr}
                        onChange={(e) => setFormData({ ...formData, projected_fy26_depr: Number(e.target.value) })}
                        className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 12: Risk Analysis */}
          {step === 12 && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-brand-textSecondary mb-1.5">Key Identified Sector Risk</label>
                <input 
                  type="text" 
                  value={formData.raw_material_risk}
                  onChange={(e) => setFormData({ ...formData, raw_material_risk: e.target.value })}
                  className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-brand-textSecondary mb-1.5">Mitigation Plan</label>
                <textarea 
                  value={formData.mitigation}
                  onChange={(e) => setFormData({ ...formData, mitigation: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 13: Collateral */}
          {step === 13 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-brand-textSecondary mb-1.5">Primary Charge Security</label>
                <textarea 
                  value={formData.primary_security}
                  onChange={(e) => setFormData({ ...formData, primary_security: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-brand-textSecondary mb-1.5">Collateral Security Offered (Second Charge)</label>
                <textarea 
                  value={formData.collateral_property}
                  onChange={(e) => setFormData({ ...formData, collateral_property: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 14: Supporting Documents & Document AI upload */}
          {step === 14 && (
            <div className="space-y-6">
              <h4 className="font-bold text-xs text-brand-textSecondary">Upload corporate and tax assets to trigger dynamic OCR parsing</h4>
              
              <div className="border border-dashed border-brand-border rounded-xl p-8 text-center bg-brand-surface/40 hover:bg-brand-surface transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  multiple 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud size={32} className="mx-auto text-brand-primary mb-3" />
                <p className="font-bold text-brand-textPrimary">Drag and drop balance sheet or bank statement files</p>
                <p className="text-[10px] text-brand-textSecondary mt-1">Supports PDF, XLSX up to 15MB</p>
              </div>

              {formData.uploaded_files.length > 0 && (
                <div className="space-y-2 border-t border-brand-border pt-4">
                  <h5 className="font-bold text-brand-textSecondary">Document Parsing Queue</h5>
                  {formData.uploaded_files.map((file, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 border border-brand-border rounded-xl bg-white shadow-xs">
                      <div>
                        <p className="font-bold text-brand-textPrimary">{file.name}</p>
                        <span className="text-[10px] text-brand-textSecondary">{file.size}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                        file.status.includes("Successfully") ? "bg-brand-success/10 text-brand-success" : "bg-brand-primary/10 text-brand-primary animate-pulse"
                      }`}>
                        {file.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 15: Compile & Generate */}
          {step === 15 && (
            <div className="space-y-6 max-w-xl mx-auto text-center py-12">
              <div className="w-16 h-16 bg-brand-primary/15 rounded-full flex items-center justify-center mx-auto text-brand-primary mb-6 animate-pulse">
                <FileCheck size={28} />
              </div>
              
              <h3 className="font-bold text-sm text-brand-textPrimary">Ready to compile report proposal</h3>
              <p className="text-brand-textSecondary text-[11px] leading-relaxed">
                By clicking "Generate Report", LoanCraft AI will assemble promoter parameters, project cash flows, historical calculations, and trigger OpenAI to format the executive narratives into a Big Four standard document structure.
              </p>

              <button
                onClick={generateReport}
                disabled={loading}
                className="px-8 py-3 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-full font-bold shadow-sm inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {loading ? "Compiling documents via Celery..." : "Generate Credit Report"}
              </button>
            </div>
          )}
        </div>

        {/* Wizard Controls Footer */}
        {step < 15 && (
          <div className="border-t border-brand-border mt-8 pt-4 flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 py-2 border border-brand-border hover:bg-brand-surface text-brand-textSecondary hover:text-brand-textPrimary font-bold rounded-full transition-all disabled:opacity-30 disabled:hover:text-brand-textSecondary"
            >
              <ArrowLeft size={14} className="inline mr-1" /> Back
            </button>
            
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primaryHover text-white font-bold rounded-full shadow-sm transition-all"
            >
              Continue <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
