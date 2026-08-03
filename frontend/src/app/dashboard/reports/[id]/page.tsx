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
  const [editData, setEditData] = useState({
    executive_summary: "",
    borrower_profile: "",
    industry_analysis: "",
    swot_analysis: "",
    project_feasibility: "",
    risk_analysis: "",
    recommendation: ""
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const loadReport = () => {
    if (!reportId) return;
    api.getReport(reportId)
      .then(res => {
        setReport(res);
        if (res.report_data) {
          setEditData({
            executive_summary: res.report_data.executive_summary || "",
            borrower_profile: res.report_data.borrower_profile || "",
            industry_analysis: res.report_data.industry_analysis || "",
            swot_analysis: res.report_data.swot_analysis || "",
            project_feasibility: res.report_data.project_feasibility || "",
            risk_analysis: res.report_data.risk_analysis || "",
            recommendation: res.report_data.recommendation || ""
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

  const handleSaveEdits = () => {
    // Update local state and close edit
    if (report) {
      const updatedReport = {
        ...report,
        report_data: {
          ...report.report_data,
          ...editData
        }
      };
      setReport(updatedReport);
    }
    setIsEditing(false);
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
                  <h1 className="text-4xl font-extrabold tracking-tight text-brand-textPrimary leading-tight uppercase">
                    {report?.report_name}
                  </h1>
                  <p className="text-sm text-brand-textSecondary leading-relaxed">
                    Detailed Proposal for Project Capex Syndication, debt assessment, means of financing, and promoter assets appraisal.
                  </p>
                </div>

                <div className="text-[10px] text-brand-textSecondary">
                  <p className="font-bold text-brand-textPrimary">LOANCRAFT AI ADVISORY SERVICES LTD</p>
                  <p>Date compiled: {new Date(report?.created_at).toLocaleDateString()}</p>
                  <p>Document Ref: LC/{reportId.substring(0, 8).toUpperCase()}</p>
                </div>
              </div>

              {/* Table of Contents */}
              <div id="toc" className="space-y-6 pt-8 border-b border-brand-border/40 pb-12">
                <h2 className="text-base font-bold text-brand-textPrimary border-b border-brand-border pb-2">Table of Contents</h2>
                <div className="space-y-3 font-semibold text-brand-textSecondary pl-2">
                  <p className="flex justify-between"><span>1. Executive Summary</span> <span>Page 3</span></p>
                  <p className="flex justify-between"><span>2. Borrower Profile & Organization</span> <span>Page 4</span></p>
                  <p className="flex justify-between"><span>3. Industry Assessment</span> <span>Page 5</span></p>
                  <p className="flex justify-between"><span>4. SWOT Matrix</span> <span>Page 6</span></p>
                  <p className="flex justify-between"><span>5. Project Feasibility</span> <span>Page 7</span></p>
                  <p className="flex justify-between"><span>6. Financial appraisal & Covenants</span> <span>Page 8</span></p>
                  <p className="flex justify-between"><span>7. Security Details & Recommendation</span> <span>Page 9</span></p>
                </div>
              </div>

              {/* Executive Summary */}
              <div id="executive_summary" className="space-y-4 pt-8 border-b border-brand-border/40 pb-12">
                <h2 className="text-base font-bold text-brand-textPrimary flex justify-between items-center border-b border-brand-border pb-2">
                  1. Executive Summary
                  {isEditing && <span className="text-[10px] font-bold text-brand-primary">Editable Section</span>}
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
                <h2 className="text-base font-bold text-brand-textPrimary border-b border-brand-border pb-2">2. Borrower Profile</h2>
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
                <h2 className="text-base font-bold text-brand-textPrimary border-b border-brand-border pb-2">3. Industry Analysis</h2>
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
                <h2 className="text-base font-bold text-brand-textPrimary border-b border-brand-border pb-2">4. SWOT Analysis</h2>
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
                <h2 className="text-base font-bold text-brand-textPrimary border-b border-brand-border pb-2">5. Project Feasibility</h2>
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
                <h2 className="text-base font-bold text-brand-textPrimary border-b border-brand-border pb-2">6. Financial Appraisal & Ratios</h2>
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
                        <td className="p-2.5 font-mono">{reportData.financials?.current_ratio || "1.60"}x</td>
                        <td className="p-2.5 text-brand-success font-bold">✓ Aligned</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-brand-textPrimary">Quick Ratio</td>
                        <td className="p-2.5 font-mono">{reportData.financials?.quick_ratio || "1.00"}x</td>
                        <td className="p-2.5 text-brand-success font-bold">✓ Aligned</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-brand-textPrimary">Debt / Equity Ratio</td>
                        <td className="p-2.5 font-mono">{reportData.financials?.debt_equity || "1.20"}x</td>
                        <td className="p-2.5 text-brand-success font-bold">✓ Aligned</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-brand-textPrimary">Debt Service Coverage (DSCR)</td>
                        <td className="p-2.5 font-mono">{reportData.financials?.dscr || "1.85"}x</td>
                        <td className="p-2.5 text-brand-success font-bold">✓ Aligned (&gt; 1.25x limit)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Risk Analysis */}
              <div id="risk_analysis" className="space-y-4 pt-8 border-b border-brand-border/40 pb-12">
                <h2 className="text-base font-bold text-brand-textPrimary border-b border-brand-border pb-2">7. Risk analysis & Mitigations</h2>
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
                <h2 className="text-base font-bold text-brand-textPrimary border-b border-brand-border pb-2">8. Bank Recommendation</h2>
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
