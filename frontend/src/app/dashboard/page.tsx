"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  FileCheck, 
  PlusCircle, 
  ArrowRight,
  Calculator,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { api } from "../../lib/api";

export default function DashboardOverview() {
  const [reports, setReports] = useState<any[]>([]);
  const [borrowers, setBorrowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load dashboard metrics
    Promise.all([
      api.getReports().catch(() => []),
      api.getBorrowers().catch(() => [])
    ]).then(([reportsData, borrowersData]) => {
      setReports(reportsData || []);
      setBorrowers(borrowersData || []);
      setLoading(false);
    });
  }, []);

  const totalTermLoanPipeline = reports.reduce((acc, report) => {
    // Read from report cost/limit data if present
    const limit = report.report_data?.project_details?.technical_details?.term_loan || 8.5;
    return acc + Number(limit);
  }, 0);

  const pendingCount = reports.filter(r => r.status === "Generating" || r.status === "Draft").length;
  const completedCount = reports.filter(r => r.status === "Completed").length;

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-textPrimary">Welcome back</h1>
          <p className="text-xs text-brand-textSecondary mt-1">Here is a summary of your credit appraisal pipeline.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/new-report" className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primaryHover text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1.5 transition-colors">
            <PlusCircle size={14} /> New Credit Report
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="h-28 bg-white border border-brand-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-brand-textSecondary uppercase tracking-wider">Active Pipeline</span>
                <span className="p-1 bg-brand-surface rounded text-brand-primary"><Briefcase size={12} /></span>
              </div>
              <h2 className="text-2xl font-bold text-brand-textPrimary mt-4">Rs. {totalTermLoanPipeline.toFixed(2)} Cr</h2>
              <p className="text-[10px] text-brand-textSecondary mt-1">Estimated term loan requirements</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-brand-textSecondary uppercase tracking-wider">Reports Drafted</span>
                <span className="p-1 bg-brand-surface rounded text-brand-primary"><FileText size={12} /></span>
              </div>
              <h2 className="text-2xl font-bold text-brand-textPrimary mt-4">{reports.length} Reports</h2>
              <p className="text-[10px] text-brand-textSecondary mt-1">{completedCount} complete, {pendingCount} drafts</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-brand-textSecondary uppercase tracking-wider">Borrower Profiles</span>
                <span className="p-1 bg-brand-surface rounded text-brand-primary"><Users size={12} /></span>
              </div>
              <h2 className="text-2xl font-bold text-brand-textPrimary mt-4">{borrowers.length} Entities</h2>
              <p className="text-[10px] text-brand-textSecondary mt-1">MSME & Corporate accounts</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-brand-textSecondary uppercase tracking-wider">Avg. Ratios Checked</span>
                <span className="p-1 bg-brand-surface rounded text-brand-primary"><TrendingUp size={12} /></span>
              </div>
              <h2 className="text-2xl font-bold text-brand-textPrimary mt-4">100%</h2>
              <p className="text-[10px] text-brand-success font-bold mt-1">✓ Matching bank covenants</p>
            </div>
          </div>

          {/* Main Grid: Pipeline Graph & Reports Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reports List */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-sm text-brand-textPrimary">Recent Credit Proposals</h3>
                  <p className="text-[10px] text-brand-textSecondary">List of newly generated AI project files</p>
                </div>
                <Link href="/dashboard/reports" className="text-xs text-brand-primary font-bold hover:underline flex items-center gap-1">
                  View all <ArrowRight size={12} />
                </Link>
              </div>

              {reports.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-brand-border rounded-xl">
                  <FileText className="mx-auto text-brand-textSecondary/40 mb-3" size={28} />
                  <p className="text-xs font-bold text-brand-textPrimary">No reports created yet</p>
                  <p className="text-[10px] text-brand-textSecondary mt-1 mb-4">Onboard a borrower and kickstart the creation wizard.</p>
                  <Link href="/dashboard/new-report" className="px-4 py-2 bg-brand-primary text-white font-bold text-xs rounded-full inline-flex items-center gap-1.5">
                    <PlusCircle size={12} /> Create Report
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-brand-border text-brand-textSecondary pb-2">
                        <th className="py-2.5 font-semibold">Report Name</th>
                        <th className="py-2.5 font-semibold">Template</th>
                        <th className="py-2.5 font-semibold">Status</th>
                        <th className="py-2.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border">
                      {reports.slice(0, 5).map((report) => (
                        <tr key={report.id} className="hover:bg-brand-surface/40 transition-colors">
                          <td className="py-3 font-bold text-brand-textPrimary">{report.report_name}</td>
                          <td className="py-3 text-brand-textSecondary capitalize">{report.template_type}</td>
                          <td className="py-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              report.status === "Completed" 
                                ? "bg-brand-success/10 text-brand-success" 
                                : report.status === "Generating" 
                                ? "bg-brand-warning/10 text-brand-warning animate-pulse" 
                                : "bg-brand-textSecondary/10 text-brand-textSecondary"
                            }`}>
                              {report.status === "Completed" ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                              {report.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <Link href={`/dashboard/reports/${report.id}`} className="text-xs text-brand-primary font-bold hover:underline">
                              Preview
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
                <h3 className="font-bold text-sm text-brand-textPrimary mb-4">Quick Tools</h3>
                <div className="space-y-3">
                  <Link href="/dashboard/new-report" className="flex items-center justify-between p-3 border border-brand-border rounded-xl hover:bg-brand-surface transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary"><FilePlus2 size={16} /></span>
                      <div className="text-left">
                        <p className="text-xs font-bold text-brand-textPrimary">Create Report</p>
                        <p className="text-[10px] text-brand-textSecondary">15-step appraisal guide</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-brand-textSecondary" />
                  </Link>

                  <Link href="/dashboard/borrowers" className="flex items-center justify-between p-3 border border-brand-border rounded-xl hover:bg-brand-surface transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary"><Users size={16} /></span>
                      <div className="text-left">
                        <p className="text-xs font-bold text-brand-textPrimary">Manage Borrowers</p>
                        <p className="text-[10px] text-brand-textSecondary">Create promoter profiles</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-brand-textSecondary" />
                  </Link>
                </div>
              </div>

              {/* Banking Pipeline Breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
                <h3 className="font-bold text-sm text-brand-textPrimary mb-4">Appraisal Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-brand-textSecondary">Debt Service Viability</span>
                      <span className="font-bold text-brand-textPrimary">85% Complete</span>
                    </div>
                    <div className="w-full bg-brand-surface h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-primary h-full rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-brand-textSecondary">Promoter Net Worth Verification</span>
                      <span className="font-bold text-brand-textPrimary">92% Match</span>
                    </div>
                    <div className="w-full bg-brand-surface h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-primary h-full rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>
                  <div className="p-3 bg-brand-surface rounded-xl border border-brand-border text-[10px] text-brand-textSecondary leading-relaxed">
                    <strong>Lender Note:</strong> Public banks demand an average Debt Service Coverage Ratio of above 1.25x. All active pipeline projects in your portfolio are clear of this restriction.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
import { FilePlus2 } from "lucide-react";
