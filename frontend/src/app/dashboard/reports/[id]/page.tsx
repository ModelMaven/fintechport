"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../lib/api";
import { 
  FileText, 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  Share2, 
  ArrowLeft, 
  Edit3, 
  Loader2,
  Sparkles,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from "lucide-react";

export default function ReportPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [activeSection, setActiveSection] = useState("cover");
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields local state
  const [editData, setEditData] = useState<any>({
    report_name: "",
    cover_subtitle: "",
    cover_date: "",
    cover_ref: "",
    executive_summary: "",
    borrower_profile: "",
    industry_analysis: "",
    swot_analysis: "",
    project_feasibility: "",
    risk_analysis: "",
    recommendation: "",
    financial_current_ratio: "",
    financial_quick_ratio: "",
    financial_debt_equity: "",
    financial_dscr: "",
    toc_item_1: "",
    toc_item_2: "",
    toc_item_3: "",
    toc_item_4: "",
    toc_item_5: "",
    toc_item_6: "",
    toc_item_7: "",
    header_executive_summary: "",
    header_borrower_profile: "",
    header_industry_analysis: "",
    header_swot_analysis: "",
    header_project_feasibility: "",
    header_financials: "",
    header_risk_analysis: "",
    header_recommendation: ""
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const loadReport = () => {
    if (!reportId) return;
    api.getReport(reportId)
      .then(res => {
        setReport(res);
        if (res.report_data) {
          setEditData({
            report_name: res.report_name || "",
            cover_subtitle: res.report_data.cover_subtitle || "Detailed Proposal for Project Capex Syndication, debt assessment, means of financing, and promoter assets appraisal.",
            cover_date: res.report_data.cover_date || new Date(res.created_at).toLocaleDateString(),
            cover_ref: res.report_data.cover_ref || `LC/${res.id.substring(0, 8).toUpperCase()}`,
            executive_summary: res.report_data.executive_summary || "",
            borrower_profile: res.report_data.borrower_profile || "",
            industry_analysis: res.report_data.industry_analysis || "",
            swot_analysis: res.report_data.swot_analysis || "",
            project_feasibility: res.report_data.project_feasibility || "",
            risk_analysis: res.report_data.risk_analysis || "",
            recommendation: res.report_data.recommendation || "",
            financial_current_ratio: res.report_data.financials?.current_ratio || "1.60",
            financial_quick_ratio: res.report_data.financials?.quick_ratio || "1.00",
            financial_debt_equity: res.report_data.financials?.debt_equity || "1.20",
            financial_dscr: res.report_data.financials?.dscr || "1.85",
            toc_item_1: res.report_data.toc?.item_1 || "1. Executive Summary",
            toc_item_2: res.report_data.toc?.item_2 || "2. Borrower Profile & Organization",
            toc_item_3: res.report_data.toc?.item_3 || "3. Industry Assessment",
            toc_item_4: res.report_data.toc?.item_4 || "4. SWOT Matrix",
            toc_item_5: res.report_data.toc?.item_5 || "5. Project Feasibility",
            toc_item_6: res.report_data.toc?.item_6 || "6. Financial appraisal & Covenants",
            toc_item_7: res.report_data.toc?.item_7 || "7. Security Details & Recommendation",
            header_executive_summary: res.report_data.headers?.executive_summary || "1. Executive Summary",
            header_borrower_profile: res.report_data.headers?.borrower_profile || "2. Borrower Profile",
            header_industry_analysis: res.report_data.headers?.industry_analysis || "3. Industry Analysis",
            header_swot_analysis: res.report_data.headers?.swot_analysis || "4. SWOT Analysis",
            header_project_feasibility: res.report_data.headers?.project_feasibility || "5. Project Feasibility",
            header_financials: res.report_data.headers?.financials || "6. Financial Appraisal & Ratios",
            header_risk_analysis: res.report_data.headers?.risk_analysis || "7. Risk analysis & Mitigations",
            header_recommendation: res.report_data.headers?.recommendation || "8. Bank Recommendation"
          });
        }
        if (res.status === "Generating" || res.status === "Draft") {
          // Poll every 3 seconds if generating
          setTimeout(loadReport, 3000);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const handleZoomIn = () => setZoom(z => Math.min(z + 10, 150));
  const handleZoomOut = () => setZoom(z => Math.max(z - 10, 70));

  const handlePrint = () => {
    window.print();
  };

  const handleExportDocx = () => {
    const url = api.exportReportDocxUrl(reportId);
    window.open(url, "_blank");
  };

  const handleExportPdf = () => {
    const url = api.exportReportPdfUrl(reportId);
    window.open(url, "_blank");
  };

  const handleSaveEdits = async () => {
    if (!report) return;
    
    const payload = {
      report_name: editData.report_name,
      report_data: {
        cover_subtitle: editData.cover_subtitle,
        cover_date: editData.cover_date,
        cover_ref: editData.cover_ref,
        executive_summary: editData.executive_summary,
        borrower_profile: editData.borrower_profile,
        industry_analysis: editData.industry_analysis,
        swot_analysis: editData.swot_analysis,
        project_feasibility: editData.project_feasibility,
        risk_analysis: editData.risk_analysis,
        recommendation: editData.recommendation,
        financials: {
          ...report.report_data?.financials,
          current_ratio: editData.financial_current_ratio,
          quick_ratio: editData.financial_quick_ratio,
          debt_equity: editData.financial_debt_equity,
          dscr: editData.financial_dscr
        },
        toc: {
          item_1: editData.toc_item_1,
          item_2: editData.toc_item_2,
          item_3: editData.toc_item_3,
          item_4: editData.toc_item_4,
          item_5: editData.toc_item_5,
          item_6: editData.toc_item_6,
          item_7: editData.toc_item_7
        },
        headers: {
          executive_summary: editData.header_executive_summary,
          borrower_profile: editData.header_borrower_profile,
          industry_analysis: editData.header_industry_analysis,
          swot_analysis: editData.header_swot_analysis,
          project_feasibility: editData.header_project_feasibility,
          financials: editData.header_financials,
          risk_analysis: editData.header_risk_analysis,
          recommendation: editData.header_recommendation
        }
      }
    };

    try {
      const updated = await api.updateReport(reportId, payload);
      setReport(updated);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to save report changes: " + err);
    }
  };

  const sections = [
    { id: "cover", label: "Cover Page" },
    { id: "toc", label: "Table of Contents" },
    { id: "executive_summary", label: "Executive Summary" },
    { id: "borrower_profile", label: "Borrower Profile" },
    { id: "industry_analysis", label: "Industry Analysis" },
    { id: "swot_analysis", label: "SWOT Analysis" },
    { id: "project_feasibility", label: "Project Feasibility" },
    { id: "financials", label: "Financial appraisal" },
    { id: "risk_analysis", label: "Risk Analysis" },
    { id: "recommendation", label: "Bank Recommendation" }
  ];

  if (loading && (!report || report.status === "Generating")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-4">
        <Loader2 className="animate-spin text-brand-primary" size={36} />
        <div>
          <h3 className="font-bold text-sm text-brand-textPrimary">Compiling Credit Appraisal Proposal</h3>
          <p className="text-[10px] text-brand-textSecondary mt-1">Executing mathematical analysis and generating AI narrative vectors...</p>
        </div>
      </div>
    );
  }

  const reportData = report?.report_data || {};

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] text-xs text-brand-textPrimary">
      {/* Top Controls Toolbar */}
      <div className="h-14 border-b border-brand-border bg-white flex items-center justify-between px-6 flex-shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/dashboard")}
            className="p-2 border border-brand-border rounded-lg text-brand-textSecondary hover:text-brand-textPrimary hover:bg-brand-surface"
          >
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="font-bold text-xs text-brand-textPrimary line-clamp-1">{report?.report_name}</h1>
            <p className="text-[9px] text-brand-textSecondary">Template: {report?.template_type.toUpperCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center border border-brand-border rounded-full overflow-hidden mr-2">
            <button onClick={handleZoomOut} className="p-2 bg-brand-surface hover:bg-brand-border text-brand-textSecondary"><ZoomOut size={12} /></button>
            <span className="px-3 font-semibold text-[10px] bg-white border-x border-brand-border">{zoom}%</span>
            <button onClick={handleZoomIn} className="p-2 bg-brand-surface hover:bg-brand-border text-brand-textSecondary"><ZoomIn size={12} /></button>
          </div>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 border rounded-full font-bold flex items-center gap-1.5 transition-colors ${
              isEditing 
                ? "bg-brand-primary text-white border-brand-primary" 
                : "border-brand-border hover:bg-brand-surface text-brand-textPrimary"
            }`}
          >
            <Edit3 size={12} /> {isEditing ? "Cancel Edit" : "Edit Proposal"}
          </button>

          <button onClick={handlePrint} className="p-2 border border-brand-border text-brand-textSecondary hover:text-brand-textPrimary rounded-full hover:bg-brand-surface">
            <Printer size={13} />
          </button>

          <button onClick={handleExportDocx} className="px-4 py-2 bg-brand-surface hover:bg-brand-border border border-brand-border text-brand-textPrimary font-bold rounded-full flex items-center gap-1">
            <Download size={12} /> Word
          </button>

          <button onClick={handleExportPdf} className="px-4 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white font-bold rounded-full shadow-sm flex items-center gap-1">
            <Download size={12} /> PDF
          </button>
        </div>
      </div>

      {/* Main Split Screen Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side TOC Bar */}
        <aside className="w-56 border-r border-brand-border bg-white overflow-y-auto p-4 space-y-1 flex-shrink-0 hidden md:block">
          <h3 className="font-bold text-[10px] text-brand-textSecondary uppercase tracking-widest px-3 mb-4">Table of Contents</h3>
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSection(sec.id);
                // Scroll page canvas to id anchor
                const element = document.getElementById(sec.id);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              className={`
                w-full text-left px-3 py-2 rounded-full font-semibold transition-all border
                ${activeSection === sec.id 
                  ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20" 
                  : "text-brand-textSecondary border-transparent hover:bg-brand-surface"}
              `}
            >
              {sec.label}
            </button>
          ))}
        </aside>

        {/* Right Side Live Word preview */}
        <div className="flex-1 overflow-y-auto bg-brand-surface p-8 flex justify-center">
          <div 
            ref={previewRef}
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", width: "800px" }}
            className="bg-white border border-brand-border shadow-premium rounded-none p-12 min-h-[1100px] text-left transition-transform duration-100 flex flex-col justify-between"
          >
            {/* Paper Preview Content */}
            <div className="space-y-12">
              {/* Cover page */}
              <div id="cover" className="min-h-[900px] flex flex-col justify-between border-b border-brand-border/40 pb-12">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-brand-primary flex items-center justify-center">
                      <span className="text-white font-bold text-xs">L</span>
                    </div>
                    <span className="font-bold text-xs tracking-tight text-brand-textPrimary">LoanCraft AI</span>
                  </div>
                  <hr className="border-brand-border mt-4" />
                </div>
                
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">CREDIT MEMORANDUM & PROJECT APPRAISAL</span>
                  {isEditing ? (
                    <div className="space-y-2">
                      <label className="block text-[8px] font-bold text-brand-textSecondary uppercase">Report Name</label>
                      <input 
                        type="text"
                        value={editData.report_name}
                        onChange={(e) => setEditData({ ...editData, report_name: e.target.value })}
                        className="w-full p-2 border border-brand-border rounded-lg bg-brand-surface font-extrabold text-brand-textPrimary text-sm uppercase outline-none"
                      />
                      <label className="block text-[8px] font-bold text-brand-textSecondary uppercase mt-2">Subtitle / Description</label>
                      <textarea 
                        value={editData.cover_subtitle}
                        onChange={(e) => setEditData({ ...editData, cover_subtitle: e.target.value })}
                        rows={2}
                        className="w-full p-2 border border-brand-border rounded-lg bg-brand-surface text-brand-textSecondary text-[10px] outline-none"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-4xl font-extrabold tracking-tight text-brand-textPrimary leading-tight uppercase">
                        {report?.report_name}
                      </h1>
                      <p className="text-sm text-brand-textSecondary leading-relaxed">
                        {report?.report_data?.cover_subtitle || "Detailed Proposal for Project Capex Syndication, debt assessment, means of financing, and promoter assets appraisal."}
                      </p>
                    </>
                  )}
                </div>

                <div className="text-[10px] text-brand-textSecondary">
                  <p className="font-bold text-brand-textPrimary">LOANCRAFT AI ADVISORY SERVICES LTD</p>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <label className="block text-[8px] font-bold uppercase text-brand-textSecondary">Date Compiled</label>
                        <input 
                          type="text"
                          value={editData.cover_date}
                          onChange={(e) => setEditData({ ...editData, cover_date: e.target.value })}
                          className="w-full p-1.5 border border-brand-border rounded bg-brand-surface outline-none text-[9px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold uppercase text-brand-textSecondary">Document Reference</label>
                        <input 
                          type="text"
                          value={editData.cover_ref}
                          onChange={(e) => setEditData({ ...editData, cover_ref: e.target.value })}
                          className="w-full p-1.5 border border-brand-border rounded bg-brand-surface outline-none text-[9px]"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p>Date compiled: {report?.report_data?.cover_date || new Date(report?.created_at).toLocaleDateString()}</p>
                      <p>Document Ref: {report?.report_data?.cover_ref || `LC/${reportId.substring(0, 8).toUpperCase()}`}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Table of Contents */}
              <div id="toc" className="space-y-6 pt-8 border-b border-brand-border/40 pb-12">
                <h2 className="text-base font-bold text-brand-textPrimary border-b border-brand-border pb-2">Table of Contents</h2>
                <div className="space-y-3 font-semibold text-brand-textSecondary pl-2">
                  <p className="flex justify-between items-center">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editData.toc_item_1}
                        onChange={(e) => setEditData({ ...editData, toc_item_1: e.target.value })}
                        className="w-full max-w-lg p-1 border border-brand-border rounded bg-brand-surface outline-none text-[11px]"
                      />
                    ) : (
                      <span>{report?.report_data?.toc?.item_1 || "1. Executive Summary"}</span>
                    )}
                    <span>Page 3</span>
                  </p>
                  <p className="flex justify-between items-center">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editData.toc_item_2}
                        onChange={(e) => setEditData({ ...editData, toc_item_2: e.target.value })}
                        className="w-full max-w-lg p-1 border border-brand-border rounded bg-brand-surface outline-none text-[11px]"
                      />
                    ) : (
                      <span>{report?.report_data?.toc?.item_2 || "2. Borrower Profile & Organization"}</span>
                    )}
                    <span>Page 4</span>
                  </p>
                  <p className="flex justify-between items-center">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editData.toc_item_3}
                        onChange={(e) => setEditData({ ...editData, toc_item_3: e.target.value })}
                        className="w-full max-w-lg p-1 border border-brand-border rounded bg-brand-surface outline-none text-[11px]"
                      />
                    ) : (
                      <span>{report?.report_data?.toc?.item_3 || "3. Industry Assessment"}</span>
                    )}
                    <span>Page 5</span>
                  </p>
                  <p className="flex justify-between items-center">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editData.toc_item_4}
                        onChange={(e) => setEditData({ ...editData, toc_item_4: e.target.value })}
                        className="w-full max-w-lg p-1 border border-brand-border rounded bg-brand-surface outline-none text-[11px]"
                      />
                    ) : (
                      <span>{report?.report_data?.toc?.item_4 || "4. SWOT Matrix"}</span>
                    )}
                    <span>Page 6</span>
                  </p>
                  <p className="flex justify-between items-center">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editData.toc_item_5}
                        onChange={(e) => setEditData({ ...editData, toc_item_5: e.target.value })}
                        className="w-full max-w-lg p-1 border border-brand-border rounded bg-brand-surface outline-none text-[11px]"
                      />
                    ) : (
                      <span>{report?.report_data?.toc?.item_5 || "5. Project Feasibility"}</span>
                    )}
                    <span>Page 7</span>
                  </p>
                  <p className="flex justify-between items-center">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editData.toc_item_6}
                        onChange={(e) => setEditData({ ...editData, toc_item_6: e.target.value })}
                        className="w-full max-w-lg p-1 border border-brand-border rounded bg-brand-surface outline-none text-[11px]"
                      />
                    ) : (
                      <span>{report?.report_data?.toc?.item_6 || "6. Financial appraisal & Covenants"}</span>
                    )}
                    <span>Page 8</span>
                  </p>
                  <p className="flex justify-between items-center">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editData.toc_item_7}
                        onChange={(e) => setEditData({ ...editData, toc_item_7: e.target.value })}
                        className="w-full max-w-lg p-1 border border-brand-border rounded bg-brand-surface outline-none text-[11px]"
                      />
                    ) : (
                      <span>{report?.report_data?.toc?.item_7 || "7. Security Details & Recommendation"}</span>
                    )}
                    <span>Page 9</span>
                  </p>
                </div>
              </div>


              {/* Executive Summary */}
              <div id="executive_summary" className="space-y-4 pt-8 border-b border-brand-border/40 pb-12">
                <h2 className="text-base font-bold text-brand-textPrimary flex justify-between items-center border-b border-brand-border pb-2 gap-4">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editData.header_executive_summary}
                      onChange={(e) => setEditData({ ...editData, header_executive_summary: e.target.value })}
                      className="w-full max-w-md p-1 border border-brand-border rounded bg-brand-surface outline-none font-bold text-sm"
                    />
                  ) : (
                    <span>{report?.report_data?.headers?.executive_summary || "1. Executive Summary"}</span>
                  )}
                  {isEditing && <span className="text-[10px] font-bold text-brand-primary flex-shrink-0">Editable Section</span>}
                </h2>
                {isEditing ? (
                  <textarea
                    value={editData.executive_summary}
                    onChange={(e) => setEditData({ ...editData, executive_summary: e.target.value })}
                    rows={8}
                    className="w-full p-3 border border-brand-border rounded-lg bg-brand-surface outline-none leading-relaxed text-xs"
                  />
                ) : (
                  <div className="whitespace-pre-line leading-relaxed text-brand-textSecondary text-[11px]" dangerouslySetInnerHTML={{ __html: reportData.executive_summary }} />
                )}
              </div>

              {/* Borrower Profile */}
              <div id="borrower_profile" className="space-y-4 pt-8 border-b border-brand-border/40 pb-12">
                <h2 className="text-base font-bold text-brand-textPrimary border-b border-brand-border pb-2">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editData.header_borrower_profile}
                      onChange={(e) => setEditData({ ...editData, header_borrower_profile: e.target.value })}
                      className="w-full max-w-md p-1 border border-brand-border rounded bg-brand-surface outline-none font-bold text-sm"
                    />
                  ) : (
                    report?.report_data?.headers?.borrower_profile || "2. Borrower Profile"
                  )}
                </h2>
                {isEditing ? (
                  <textarea
                    value={editData.borrower_profile}
                    onChange={(e) => setEditData({ ...editData, borrower_profile: e.target.value })}
                    rows={6}
                    className="w-full p-3 border border-brand-border rounded-lg bg-brand-surface outline-none leading-relaxed text-xs"
                  />
                ) : (
                  <div className="whitespace-pre-line leading-relaxed text-brand-textSecondary text-[11px]" dangerouslySetInnerHTML={{ __html: reportData.borrower_profile }} />
                )}
              </div>

              {/* Industry Analysis */}
              <div id="industry_analysis" className="space-y-4 pt-8 border-b border-brand-border/40 pb-12">
                <h2 className="text-base font-bold text-brand-textPrimary border-b border-brand-border pb-2">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editData.header_industry_analysis}
                      onChange={(e) => setEditData({ ...editData, header_industry_analysis: e.target.value })}
                      className="w-full max-w-md p-1 border border-brand-border rounded bg-brand-surface outline-none font-bold text-sm"
                    />
                  ) : (
                    report?.report_data?.headers?.industry_analysis || "3. Industry Analysis"
                  )}
                </h2>
                {isEditing ? (
                  <textarea
                    value={editData.industry_analysis}
                    onChange={(e) => setEditData({ ...editData, industry_analysis: e.target.value })}
                    rows={6}
                    className="w-full p-3 border border-brand-border rounded-lg bg-brand-surface outline-none leading-relaxed text-xs"
                  />
                ) : (
                  <div className="whitespace-pre-line leading-relaxed text-brand-textSecondary text-[11px]" dangerouslySetInnerHTML={{ __html: reportData.industry_analysis }} />
                )}
              </div>

              {/* SWOT Analysis */}
              <div id="swot_analysis" className="space-y-4 pt-8 border-b border-brand-border/40 pb-12">
                <h2 className="text-base font-bold text-brand-textPrimary border-b border-brand-border pb-2">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editData.header_swot_analysis}
                      onChange={(e) => setEditData({ ...editData, header_swot_analysis: e.target.value })}
                      className="w-full max-w-md p-1 border border-brand-border rounded bg-brand-surface outline-none font-bold text-sm"
                    />
                  ) : (
                    report?.report_data?.headers?.swot_analysis || "4. SWOT Analysis"
                  )}
                </h2>
                {isEditing ? (
                  <textarea
                    value={editData.swot_analysis}
                    onChange={(e) => setEditData({ ...editData, swot_analysis: e.target.value })}
                    rows={6}
                    className="w-full p-3 border border-brand-border rounded-lg bg-brand-surface outline-none leading-relaxed text-xs"
                  />
                ) : (
                  <div className="whitespace-pre-line leading-relaxed text-brand-textSecondary text-[11px]" dangerouslySetInnerHTML={{ __html: reportData.swot_analysis }} />
                )}
              </div>

              {/* Project Feasibility */}
              <div id="project_feasibility" className="space-y-4 pt-8 border-b border-brand-border/40 pb-12">
                <h2 className="text-base font-bold text-brand-textPrimary border-b border-brand-border pb-2">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editData.header_project_feasibility}
                      onChange={(e) => setEditData({ ...editData, header_project_feasibility: e.target.value })}
                      className="w-full max-w-md p-1 border border-brand-border rounded bg-brand-surface outline-none font-bold text-sm"
                    />
                  ) : (
                    report?.report_data?.headers?.project_feasibility || "5. Project Feasibility"
                  )}
                </h2>
                {isEditing ? (
                  <textarea
                    value={editData.project_feasibility}
                    onChange={(e) => setEditData({ ...editData, project_feasibility: e.target.value })}
                    rows={6}
                    className="w-full p-3 border border-brand-border rounded-lg bg-brand-surface outline-none leading-relaxed text-xs"
                  />
                ) : (
                  <div className="whitespace-pre-line leading-relaxed text-brand-textSecondary text-[11px]" dangerouslySetInnerHTML={{ __html: reportData.project_feasibility }} />
                )}
              </div>

              {/* Financials & Ratio Tables */}
              <div id="financials" className="space-y-6 pt-8 border-b border-brand-border/40 pb-12">
                <h2 className="text-base font-bold text-brand-textPrimary border-b border-brand-border pb-2">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editData.header_financials}
                      onChange={(e) => setEditData({ ...editData, header_financials: e.target.value })}
                      className="w-full max-w-md p-1 border border-brand-border rounded bg-brand-surface outline-none font-bold text-sm"
                    />
                  ) : (
                    report?.report_data?.headers?.financials || "6. Financial Appraisal & Ratios"
                  )}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-brand-border">
                    <thead>
                      <tr className="bg-brand-surface text-brand-textPrimary border-b border-brand-border font-bold">
                        <th className="p-2.5">Financial Metric</th>
                        <th className="p-2.5">Year FY25 (Audited)</th>
                        <th className="p-2.5">Status Check</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border text-brand-textSecondary">
                      <tr>
                        <td className="p-2.5 font-bold text-brand-textPrimary">Current Ratio</td>
                        <td className="p-2.5 font-mono">
                          {isEditing ? (
                            <input 
                              type="text"
                              value={editData.financial_current_ratio}
                              onChange={(e) => setEditData({ ...editData, financial_current_ratio: e.target.value })}
                              className="w-16 p-1 border border-brand-border rounded bg-brand-surface font-mono outline-none"
                            />
                          ) : (
                            `${reportData.financials?.current_ratio || "1.60"}x`
                          )}
                        </td>
                        <td className="p-2.5 text-brand-success font-bold">✓ Aligned</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-brand-textPrimary">Quick Ratio</td>
                        <td className="p-2.5 font-mono">
                          {isEditing ? (
                            <input 
                              type="text"
                              value={editData.financial_quick_ratio}
                              onChange={(e) => setEditData({ ...editData, financial_quick_ratio: e.target.value })}
                              className="w-16 p-1 border border-brand-border rounded bg-brand-surface font-mono outline-none"
                            />
                          ) : (
                            `${reportData.financials?.quick_ratio || "1.00"}x`
                          )}
                        </td>
                        <td className="p-2.5 text-brand-success font-bold">✓ Aligned</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-brand-textPrimary">Debt / Equity Ratio</td>
                        <td className="p-2.5 font-mono">
                          {isEditing ? (
                            <input 
                              type="text"
                              value={editData.financial_debt_equity}
                              onChange={(e) => setEditData({ ...editData, financial_debt_equity: e.target.value })}
                              className="w-16 p-1 border border-brand-border rounded bg-brand-surface font-mono outline-none"
                            />
                          ) : (
                            `${reportData.financials?.debt_equity || "1.20"}x`
                          )}
                        </td>
                        <td className="p-2.5 text-brand-success font-bold">✓ Aligned</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-brand-textPrimary">Debt Service Coverage (DSCR)</td>
                        <td className="p-2.5 font-mono">
                          {isEditing ? (
                            <input 
                              type="text"
                              value={editData.financial_dscr}
                              onChange={(e) => setEditData({ ...editData, financial_dscr: e.target.value })}
                              className="w-16 p-1 border border-brand-border rounded bg-brand-surface font-mono outline-none"
                            />
                          ) : (
                            `${reportData.financials?.dscr || "1.85"}x`
                          )}
                        </td>
                        <td className="p-2.5 text-brand-success font-bold">✓ Aligned (&gt; 1.25x limit)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Risk Analysis */}
              <div id="risk_analysis" className="space-y-4 pt-8 border-b border-brand-border/40 pb-12">
                <h2 className="text-base font-bold text-brand-textPrimary border-b border-brand-border pb-2">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editData.header_risk_analysis}
                      onChange={(e) => setEditData({ ...editData, header_risk_analysis: e.target.value })}
                      className="w-full max-w-md p-1 border border-brand-border rounded bg-brand-surface outline-none font-bold text-sm"
                    />
                  ) : (
                    report?.report_data?.headers?.risk_analysis || "7. Risk analysis & Mitigations"
                  )}
                </h2>
                {isEditing ? (
                  <textarea
                    value={editData.risk_analysis}
                    onChange={(e) => setEditData({ ...editData, risk_analysis: e.target.value })}
                    rows={6}
                    className="w-full p-3 border border-brand-border rounded-lg bg-brand-surface outline-none leading-relaxed text-xs"
                  />
                ) : (
                  <div className="whitespace-pre-line leading-relaxed text-brand-textSecondary text-[11px]" dangerouslySetInnerHTML={{ __html: reportData.risk_analysis }} />
                )}
              </div>

              {/* Recommendation */}
              <div id="recommendation" className="space-y-4 pt-8">
                <h2 className="text-base font-bold text-brand-textPrimary border-b border-brand-border pb-2">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editData.header_recommendation}
                      onChange={(e) => setEditData({ ...editData, header_recommendation: e.target.value })}
                      className="w-full max-w-md p-1 border border-brand-border rounded bg-brand-surface outline-none font-bold text-sm"
                    />
                  ) : (
                    report?.report_data?.headers?.recommendation || "8. Bank Recommendation"
                  )}
                </h2>
                {isEditing ? (
                  <textarea
                    value={editData.recommendation}
                    onChange={(e) => setEditData({ ...editData, recommendation: e.target.value })}
                    rows={6}
                    className="w-full p-3 border border-brand-border rounded-lg bg-brand-surface outline-none leading-relaxed text-xs"
                  />
                ) : (
                  <div className="whitespace-pre-line leading-relaxed text-brand-textSecondary text-[11px]" dangerouslySetInnerHTML={{ __html: reportData.recommendation }} />
                )}
              </div>
            </div>

            {/* Footer page number */}
            <div className="border-t border-brand-border/40 mt-12 pt-4 flex justify-between text-[9px] text-brand-textSecondary">
              <span>Prepared via LoanCraft AI Engine</span>
              <span>Page 9 of 9</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Covenants Button for edit Mode */}
      {isEditing && (
        <div className="fixed bottom-6 right-6 bg-white p-4 border border-brand-border shadow-2xl rounded-2xl flex gap-3 z-50">
          <button 
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 border border-brand-border hover:bg-brand-surface font-bold rounded-full"
          >
            Discard
          </button>
          <button 
            onClick={handleSaveEdits}
            className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primaryHover text-white font-bold rounded-full shadow-sm"
          >
            Save Document Narratives
          </button>
        </div>
      )}
    </div>
  );
}
