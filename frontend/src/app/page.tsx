"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Layers, 
  ChevronRight, 
  ArrowRight, 
  PieChart, 
  UploadCloud, 
  CheckCircle,
  HelpCircle,
  Menu,
  X
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("manufacturing");

  const industries = [
    { id: "manufacturing", name: "Manufacturing & Infrastructure", desc: "For setting up greenfield/brownfield factories, machinery financing, and capacity expansion loans." },
    { id: "realestate", name: "Real Estate & Builders", desc: "Residential complexes, commercial office spaces, and warehouse developments complying with RERA & banking margins." },
    { id: "healthcare", name: "Hospitals & Healthcare", desc: "Financing advanced diagnostic equipment, hospital layouts, and patient capacity expansions." },
    { id: "solar", name: "Solar & Renewable Energy", desc: "Feasibility evaluations, debt-service stress tests, and tariff sensitivity sheets for power purchases." },
    { id: "hospitality", name: "Hotels & Restaurants", desc: " Moratorium estimation, seasonal occupancy models, and cash flow projections for franchise builds." }
  ];

  const steps = [
    { num: "01", title: "Input Basic Details", desc: "Provide borrower metadata, promoter assets, and proposed cost of the project." },
    { num: "02", title: "OCR Financial Parse", desc: "Upload historical audited financial PDFs. LoanCraft AI automatically reads and formats schedules." },
    { num: "03", title: "Compute Banking Ratios", desc: "The engine runs Tandon, Nayak, DSCR, IRR, and sensitivity analysis conforming to credit parameters." },
    { num: "04", title: "AI Narratives & Export", desc: "Generate SWOT, credit opinion, and executive summaries, then download Word/PDF documents." }
  ];

  const testimonials = [
    { quote: "LoanCraft AI reduced our report compilation timeline from 10 days to under 30 minutes. The reports generated are directly submittable to SBI and HDFC credit teams.", author: "Rajesh Sharma", role: "Chartered Accountant, Credit Consult Group" },
    { quote: "The calculation engine's Tandon committee norms and IRR sensitivity sheets are exactly what bankers search for during appraisal. High utility and clean design.", author: "Neha Gupta", role: "Director of Finance, Vantage MSME Industry" }
  ];

  const faqs = [
    { q: "Are the reports generated accepted by major public and private sector banks?", a: "Yes. LoanCraft AI produces institutional-grade reports that match the exact formats, appraisals, and ratio structures mandated by SBI, PNB, BOB, HDFC, ICICI, and SIDBI." },
    { q: "How secure is our financial data?", a: "We prioritize security. Your uploaded balance sheets and project documents are fully encrypted at rest and in transit. We do not use user documents to train public AI models." },
    { q: "Can we export reports in editable formats?", a: "Absolutely. Reports can be exported as fully formatted Microsoft Word (.docx) files or high-definition PDF files. You can modify narratives, tables, and spacing easily." }
  ];

  return (
    <div className="bg-brand-background text-brand-textPrimary font-sans">
      {/* Header */}
      <header className="border-b border-brand-border sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-brand-textPrimary">
              LoanCraft<span className="text-brand-primary font-medium">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-textSecondary">
            <a href="#features" className="hover:text-brand-textPrimary transition-colors">Features</a>
            <a href="#industries" className="hover:text-brand-textPrimary transition-colors">Sectors</a>
            <a href="#workflow" className="hover:text-brand-textPrimary transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-brand-textPrimary transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-brand-textPrimary transition-colors">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primaryHover text-white text-sm font-medium rounded-full shadow-sm transition-colors">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-brand-textSecondary hover:text-brand-textPrimary">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-brand-border bg-white px-6 py-4 flex flex-col gap-4">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-brand-textSecondary">Features</a>
            <a href="#industries" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-brand-textSecondary">Sectors</a>
            <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-brand-textSecondary">Workflow</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-brand-textSecondary">Pricing</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-brand-textSecondary">FAQ</a>
            <hr className="border-brand-border" />
            <Link href="/dashboard" className="w-full text-center py-2.5 bg-brand-primary text-white text-sm font-medium rounded-full">Get Started</Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-surface rounded-full text-brand-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={12} /> Powered by Advanced Financial Intelligence
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-brand-textPrimary max-w-5xl mx-auto leading-tight mb-8">
            Generate Institutional-Grade Bank Loan Project Reports.
          </h1>

          <p className="text-lg md:text-xl text-brand-textSecondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Architect professional credit proposals and feasibility dossiers accepted by major public and private sector banks in minutes instead of weeks. Built for CAs, CFOs, and MSMEs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-brand-primary hover:bg-brand-primaryHover text-white font-semibold rounded-full shadow-sm flex items-center justify-center gap-2 transition-all group">
              Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-16 md:mt-24 border border-brand-border rounded-2xl shadow-premium overflow-hidden bg-brand-surface max-w-6xl mx-auto p-3">
            <div className="bg-white rounded-xl border border-brand-border/60 p-6 md:p-8 flex flex-col md:flex-row items-start justify-between text-left gap-8">
              <div className="max-w-md">
                <div className="h-6 w-12 rounded bg-brand-primary/10 flex items-center justify-center mb-4">
                  <span className="text-brand-primary text-xs font-bold">PDF</span>
                </div>
                <h4 className="font-bold text-lg text-brand-textPrimary mb-2">Stripe-styled Clean Layouts</h4>
                <p className="text-sm text-brand-textSecondary leading-relaxed">
                  Clean financial tables containing debt-equity projections, sensitivity calculations, and promoter details, combined with structured narratives prepared by AI.
                </p>
              </div>
              <div className="w-full md:w-auto flex-1 bg-brand-surface rounded-xl p-4 border border-brand-border/40 font-mono text-[11px] text-brand-textSecondary max-h-48 overflow-y-auto">
                <span className="text-brand-primary font-bold">// LOANCRAFT AI FINANCIAL APPRAISAL ENGINE v1.0</span>
                <p className="mt-2 text-brand-textPrimary">Calculating Debt Service Coverage Ratio (DSCR):</p>
                <p className="text-brand-success font-medium">PAT + Depreciation + TL Interest / (Principal + TL Interest)</p>
                <p className="mt-1">Year 2026: 12,000,000 + 4,000,000 + 3,500,000 / (5,000,000 + 3,500,000) = 2.29x</p>
                <p className="text-brand-success font-medium">✓ Average DSCR: 1.82x [Standard requirement &gt; 1.25x]</p>
                <p className="mt-2 text-brand-textPrimary">Internal Rate of Return (IRR): 18.42%</p>
                <p className="text-brand-success font-medium">✓ Net Present Value (NPV @ 10%): Rs. 4,52,32,000.00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Matrix */}
      <section id="features" className="py-20 border-t border-brand-border bg-brand-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-brand-textPrimary mb-4">
              Everything required for bank loan credit approval.
            </h2>
            <p className="text-brand-textSecondary leading-relaxed text-lg">
              Engineered by corporate bankers and accountants to eliminate manual calculations, spelling issues, and formatting headaches.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-center text-brand-primary mb-6">
                  <UploadCloud size={22} />
                </div>
                <h3 className="font-bold text-lg text-brand-textPrimary mb-3">Document AI & OCR</h3>
                <p className="text-brand-textSecondary text-sm leading-relaxed">
                  Upload audited statements or tax files. The OCR system reads income details and formats liabilities into balance sheet structures instantly.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-center text-brand-primary mb-6">
                  <PieChart size={22} />
                </div>
                <h3 className="font-bold text-lg text-brand-textPrimary mb-3">Banking Ratio Engine</h3>
                <p className="text-brand-textSecondary text-sm leading-relaxed">
                  Includes automatic DSCR, Net Worth adjustments, Working capital requirements (Tandon Method I, II and Nayak Turnover method), and IRR stress calculators.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-center text-brand-primary mb-6">
                  <Sparkles size={22} />
                </div>
                <h3 className="font-bold text-lg text-brand-textPrimary mb-3">Professional AI Writer</h3>
                <p className="text-brand-textSecondary text-sm leading-relaxed">
                  Generates industry analyses, SWOT matrices, technical feasibility text blocks, and lender risk opinions customized to your target sector.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section id="industries" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3">
              <span className="text-brand-primary font-bold text-xs uppercase tracking-widest block mb-3">Sectors Supported</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-textPrimary mb-6">
                Tailored templates for every industry.
              </h2>
              <p className="text-brand-textSecondary text-sm leading-relaxed mb-8">
                Bank credit departments look for different metrics depending on the sector. Our layouts automatically adjust tables, terms, and narratives to fit.
              </p>
              <Link href="/dashboard" className="px-6 py-3 bg-brand-primary hover:bg-brand-primaryHover text-white text-xs font-semibold rounded-full shadow-sm transition-colors inline-flex items-center gap-1.5">
                Explore Templates <ChevronRight size={14} />
              </Link>
            </div>
            
            <div className="md:w-2/3 w-full">
              <div className="flex border-b border-brand-border gap-4 overflow-x-auto pb-2">
                {industries.map((ind) => (
                  <button 
                    key={ind.id}
                    onClick={() => setActiveTab(ind.id)}
                    className={`px-4 py-2 text-xs font-bold whitespace-nowrap rounded-full transition-all ${
                      activeTab === ind.id 
                        ? "bg-brand-primary text-white" 
                        : "text-brand-textSecondary hover:text-brand-textPrimary bg-brand-surface border border-brand-border"
                    }`}
                  >
                    {ind.name}
                  </button>
                ))}
              </div>
              
              <div className="mt-8 bg-brand-surface p-8 rounded-2xl border border-brand-border">
                {industries.map((ind) => (
                  ind.id === activeTab && (
                    <div key={ind.id} className="animate-fadeIn">
                      <h4 className="font-bold text-lg text-brand-textPrimary mb-3">{ind.name}</h4>
                      <p className="text-brand-textSecondary text-sm leading-relaxed mb-6">{ind.desc}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-brand-border text-xs">
                          <span className="text-brand-primary font-bold uppercase tracking-wider block mb-1">Key Appraisals</span>
                          DSCR projection, security metrics, and raw material sensitivity models.
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-brand-border text-xs">
                          <span className="text-brand-primary font-bold uppercase tracking-wider block mb-1">Covenants Check</span>
                          Pre-configured to match major public sector bank rules.
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section id="workflow" className="py-20 bg-brand-surface border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-textPrimary mb-4">
              Simple 4-step generation workflow
            </h2>
            <p className="text-brand-textSecondary text-sm leading-relaxed">
              Create a fully compliant, Big Four quality report in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((st) => (
              <div key={st.num} className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm relative">
                <span className="absolute top-4 right-6 font-bold text-4xl text-brand-primary/10">{st.num}</span>
                <h4 className="font-bold text-base text-brand-textPrimary mb-2 mt-4">{st.title}</h4>
                <p className="text-brand-textSecondary text-xs leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-brand-surface p-8 rounded-2xl border border-brand-border flex flex-col justify-between">
                <p className="text-brand-textPrimary font-medium italic mb-6 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <h5 className="font-bold text-sm text-brand-textPrimary">{t.author}</h5>
                  <span className="text-brand-textSecondary text-xs">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-brand-surface border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-textPrimary mb-4">
              Fair, usage-based plans.
            </h2>
            <p className="text-brand-textSecondary text-sm">
              Upgrade as you scale report preparation pipelines.
            </p>
          </div>

          <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-8 text-left">
            {/* Free */}
            <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-lg text-brand-textPrimary mb-2">Startup / Sandbox</h4>
                <p className="text-brand-textSecondary text-xs mb-6">Excellent for preparing one-off proposals.</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-brand-textPrimary">Rs. 0</span>
                  <span className="text-brand-textSecondary text-sm font-medium"> / forever</span>
                </div>
                <hr className="border-brand-border mb-6" />
                <ul className="space-y-3 text-xs text-brand-textSecondary mb-8">
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-success" /> 1 Sandbox Project Report</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-success" /> Dynamic Financial calculations</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-success" /> Standard Ratio reports</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-success" /> PDF Watermarked Export</li>
                </ul>
              </div>
              <Link href="/dashboard" className="w-full text-center py-3 bg-brand-surface hover:bg-brand-border text-brand-textPrimary font-semibold text-xs rounded-full border border-brand-border transition-colors">
                Start Sandbox
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white p-8 rounded-2xl border-2 border-brand-primary shadow-sm flex flex-col justify-between relative">
              <span className="absolute top-4 right-6 bg-brand-primary text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full">POPULAR</span>
              <div>
                <h4 className="font-bold text-lg text-brand-textPrimary mb-2">Professional Consultant</h4>
                <p className="text-brand-textSecondary text-xs mb-6">Designed for Accountants and Advisors.</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-brand-textPrimary">Rs. 9,999</span>
                  <span className="text-brand-textSecondary text-sm font-medium"> / month</span>
                </div>
                <hr className="border-brand-border mb-6" />
                <ul className="space-y-3 text-xs text-brand-textSecondary mb-8">
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-primary" /> Unlimited Reports generation</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-primary" /> Full Document AI OCR imports</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-primary" /> Multi-scenario sensitivity reports</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-primary" /> High-quality Editable Word & PDF exports</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-primary" /> Custom corporate branding</li>
                </ul>
              </div>
              <Link href="/dashboard" className="w-full text-center py-3 bg-brand-primary hover:bg-brand-primaryHover text-white font-semibold text-xs rounded-full transition-colors">
                Get Started Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-tight text-brand-textPrimary text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-brand-border pb-6">
                <h4 className="font-bold text-sm text-brand-textPrimary mb-2 flex items-start gap-2">
                  <HelpCircle size={16} className="text-brand-primary mt-0.5 flex-shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-brand-textSecondary text-xs leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-border py-12 bg-white text-xs text-brand-textSecondary">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="font-bold text-sm tracking-tight text-brand-textPrimary">
              LoanCraft<span className="text-brand-primary font-medium">AI</span>
            </span>
          </div>
          <p>&copy; {new Date().getFullYear()} LoanCraft AI. All rights reserved. Made by advanced credit systems.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-textPrimary">Privacy Policy</a>
            <a href="#" className="hover:text-brand-textPrimary">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
