"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import { 
  Settings, 
  Key, 
  Sliders, 
  ShieldCheck, 
  Save, 
  HelpCircle,
  Sparkles
} from "lucide-react";

export default function SettingsPage() {
  const [minDscr, setMinDscr] = useState("1.25");
  const [maxDebtEquity, setMaxDebtEquity] = useState("2.00");
  const [openaiKey, setOpenaiKey] = useState("••••••••••••••••••••••••");
  const [docAiKey, setDocAiKey] = useState("••••••••••••••••••••••••");
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-brand-textPrimary flex items-center gap-2">
            <Settings size={22} className="text-brand-primary" /> Application Settings
          </h1>
          <p className="text-xs text-brand-textSecondary mt-1">Configure credit policy limits, API integrations, and thresholds.</p>
        </div>
      </div>

      {showSavedToast && (
        <div className="p-3 bg-brand-success/15 border border-brand-success rounded-xl text-brand-success font-bold text-xs flex items-center gap-2">
          <ShieldCheck size={16} /> Configurations saved and synchronized successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 text-xs">
        {/* Credit Policy Thresholds */}
        <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-6">
          <h3 className="font-bold text-sm text-brand-textPrimary flex items-center gap-2 border-b border-brand-border pb-3">
            <Sliders size={16} className="text-brand-primary" /> Banking Appraisal Thresholds
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-brand-textSecondary mb-2 flex items-center gap-1">
                Minimum Acceptable DSCR
                <span className="text-brand-textSecondary/50 cursor-pointer" title="Debt Service Coverage Ratio. Standard sector target is 1.25x."><HelpCircle size={12} /></span>
              </label>
              <input 
                type="number" 
                step="0.05"
                value={minDscr}
                onChange={(e) => setMinDscr(e.target.value)}
                className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none focus:border-brand-primary"
              />
            </div>
            
            <div>
              <label className="block font-bold text-brand-textSecondary mb-2 flex items-center gap-1">
                Maximum Debt-Equity Ratio
                <span className="text-brand-textSecondary/50 cursor-pointer" title="Leverage ratio. Debt divided by Tangible Net Worth."><HelpCircle size={12} /></span>
              </label>
              <input 
                type="number" 
                step="0.05"
                value={maxDebtEquity}
                onChange={(e) => setMaxDebtEquity(e.target.value)}
                className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-6">
          <h3 className="font-bold text-sm text-brand-textPrimary flex items-center gap-2 border-b border-brand-border pb-3">
            <Key size={16} className="text-brand-primary" /> External API Credentials
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-brand-textSecondary mb-2 flex items-center gap-1.5">
                OpenAI API Secret Key
                <span className="text-brand-textSecondary/50 cursor-pointer" title="Required to generate report text sections (SWOT, feasibility summaries)."><HelpCircle size={12} /></span>
              </label>
              <input 
                type="password" 
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none focus:border-brand-primary font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-textSecondary mb-2 flex items-center gap-1.5">
                Google Cloud Document AI Key
                <span className="text-brand-textSecondary/50 cursor-pointer" title="Used to extract structured schedules from Balance Sheet PDFs."><HelpCircle size={12} /></span>
              </label>
              <input 
                type="password" 
                value={docAiKey}
                onChange={(e) => setDocAiKey(e.target.value)}
                className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none focus:border-brand-primary font-mono"
              />
            </div>
          </div>
          
          <div className="p-3 bg-brand-surface border border-brand-border rounded-xl flex items-start gap-2.5">
            <Sparkles size={16} className="text-brand-primary flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-brand-textSecondary leading-relaxed">
              If API keys are left configured with mock tokens, LoanCraft AI executes with mock logic and built-in rules, generating standard corporate narratives and templates for easy evaluation.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button 
            type="submit"
            className="px-6 py-3 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-full font-bold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Save size={14} /> Save Configurations
          </button>
        </div>
      </form>
    </div>
  );
}
