"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "../../../lib/api";
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from "lucide-react";

export default function ReportsListPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = () => {
    setLoading(true);
    api.getReports()
      .then(res => {
        setReports(res || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredReports = reports.filter(r => 
    r.report_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.template_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-brand-textPrimary">Loan Credit Proposals</h1>
          <p className="text-xs text-brand-textSecondary mt-1">Access all generated bank-appraisal project reports.</p>
        </div>
        <Link 
          href="/dashboard/new-report"
          className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primaryHover text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus size={14} /> New Credit Report
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-brand-border shadow-sm text-xs">
        <Search size={16} className="text-brand-textSecondary" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by report name or industry template..."
          className="bg-transparent text-xs text-brand-textPrimary outline-none flex-1 placeholder-brand-textSecondary/70"
        />
      </div>

      {/* Grid list or table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 space-y-4 animate-pulse">
          {[1, 2, 3].map(idx => (
            <div key={idx} className="h-12 bg-brand-surface rounded-xl" />
          ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-16 bg-white border border-brand-border rounded-2xl shadow-sm text-xs">
          <FileText className="mx-auto text-brand-textSecondary/40 mb-3" size={32} />
          <p className="font-bold text-brand-textPrimary">No credit proposals drafted yet</p>
          <p className="text-[10px] text-brand-textSecondary mt-1">Start the creation wizard to compile a new proposal.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-surface border-b border-brand-border text-brand-textSecondary font-semibold">
                  <th className="p-4">Proposal Name</th>
                  <th className="p-4">Industry Sector</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date Compiled</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-brand-surface/40 transition-colors">
                    <td className="p-4 font-bold text-brand-textPrimary flex items-center gap-2">
                      <FileText size={16} className="text-brand-primary" />
                      {report.report_name}
                    </td>
                    <td className="p-4 capitalize text-brand-textSecondary">{report.template_type}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        report.status === "Completed" 
                          ? "bg-brand-success/10 text-brand-success" 
                          : "bg-brand-warning/10 text-brand-warning animate-pulse"
                      }`}>
                        {report.status === "Completed" ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4 text-brand-textSecondary">
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link 
                        href={`/dashboard/reports/${report.id}`}
                        className="px-3 py-1.5 border border-brand-border hover:bg-brand-surface font-bold rounded-full inline-flex items-center gap-1"
                      >
                        <Eye size={12} /> Preview
                      </Link>
                      {report.status === "Completed" && (
                        <>
                          <a 
                            href={api.exportReportPdfUrl(report.id)}
                            target="_blank"
                            className="px-3 py-1.5 bg-brand-primary hover:bg-brand-primaryHover text-white font-bold rounded-full inline-flex items-center gap-1 shadow-xs"
                          >
                            <Download size={12} /> PDF
                          </a>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
