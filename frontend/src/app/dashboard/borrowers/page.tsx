"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import { 
  Users, 
  Plus, 
  Search, 
  Building, 
  MapPin, 
  Briefcase, 
  Check, 
  X,
  CreditCard,
  UserPlus,
  Trash2
} from "lucide-react";

export default function BorrowersPage() {
  const [borrowers, setBorrowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [companyName, setCompanyName] = useState("");
  const [constitution, setConstitution] = useState("Private Limited Company");
  const [industry, setIndustry] = useState("Manufacturing");
  const [regNo, setRegNo] = useState("");
  const [incDate, setIncDate] = useState("");
  const [regAddr, setRegAddr] = useState("");
  const [officeAddr, setOfficeAddr] = useState("");
  const [pan, setPan] = useState("");
  
  // Promoter details list
  const [promoters, setPromoters] = useState<any[]>([
    { name: "", age: 45, equity_percentage: 100, net_worth: 0.00 }
  ]);

  const loadData = () => {
    setLoading(true);
    api.getBorrowers()
      .then(res => {
        setBorrowers(res || []);
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

  const addPromoterRow = () => {
    setPromoters([...promoters, { name: "", age: 40, equity_percentage: 0, net_worth: 0.00 }]);
  };

  const removePromoterRow = (index: number) => {
    setPromoters(promoters.filter((_, idx) => idx !== index));
  };

  const updatePromoter = (index: number, field: string, value: any) => {
    const copy = [...promoters];
    copy[index][field] = value;
    setPromoters(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) return;

    const payload = {
      company_name: companyName,
      constitution: constitution,
      industry: industry,
      registration_number: regNo || null,
      pan: pan || null,
      date_of_incorporation: incDate || null,
      registered_address: regAddr || null,
      office_address: officeAddr || null,
      promoter_details: promoters.filter(p => p.name.trim() !== ""),
      shareholding_pattern: promoters.reduce((acc, p) => {
        if (p.name) acc[p.name] = Number(p.equity_percentage);
        return acc;
      }, {} as Record<string, number>)
    };

    try {
      await api.createBorrower(payload);
      setModalOpen(false);
      // Reset form
      setCompanyName("");
      setRegNo("");
      setIncDate("");
      setRegAddr("");
      setOfficeAddr("");
      setPan("");
      setPromoters([{ name: "", age: 45, equity_percentage: 100, net_worth: 0.00 }]);
      loadData();
    } catch (err) {
      alert("Failed to create borrower profile: " + err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the borrower profile for "${name}"?\nThis will delete all associated projects, financial statements, and reports.`)) {
      return;
    }
    try {
      await api.deleteBorrower(id);
      loadData();
    } catch (err) {
      alert("Failed to delete borrower profile: " + err);
    }
  };

  const filteredBorrowers = borrowers.filter(b => 
    b.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-brand-textPrimary">Borrower Directory</h1>
          <p className="text-xs text-brand-textSecondary mt-1">Manage borrower profiles and promoter details.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primaryHover text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus size={14} /> Add Borrower
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-brand-border shadow-sm">
        <Search size={16} className="text-brand-textSecondary" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by company name or industry sector..."
          className="bg-transparent text-xs text-brand-textPrimary outline-none flex-1 placeholder-brand-textSecondary/70"
        />
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(idx => (
            <div key={idx} className="h-44 bg-white border border-brand-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredBorrowers.length === 0 ? (
        <div className="text-center py-16 bg-white border border-brand-border rounded-2xl shadow-sm">
          <Users className="mx-auto text-brand-textSecondary/40 mb-3" size={32} />
          <p className="text-xs font-bold text-brand-textPrimary">No borrower profiles found</p>
          <p className="text-[10px] text-brand-textSecondary mt-1">Click the button in the top right to onboard your first borrower.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBorrowers.map((borrower) => (
            <div key={borrower.id} className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between hover:border-brand-primary/50 transition-colors">
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="p-2 bg-brand-surface rounded-lg text-brand-primary border border-brand-border/60">
                    <Building size={16} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-brand-textSecondary uppercase tracking-widest bg-brand-surface px-2.5 py-0.5 rounded-full border border-brand-border/60">
                      {borrower.constitution.replace("Company", "").trim()}
                    </span>
                    <button
                      onClick={() => handleDelete(borrower.id, borrower.company_name)}
                      className="p-1.5 text-brand-textSecondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                      title="Delete Profile"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-bold text-sm text-brand-textPrimary line-clamp-1">{borrower.company_name}</h3>
                
                <div className="space-y-2 mt-4 text-[10px] text-brand-textSecondary">
                  <p className="flex items-center gap-1.5"><Briefcase size={12} /> {borrower.industry}</p>
                  {borrower.registration_number && (
                    <p className="flex items-center gap-1.5"><CreditCard size={12} /> Reg: {borrower.registration_number}</p>
                  )}
                  {borrower.pan && (
                    <p className="flex items-center gap-1.5"><CreditCard size={12} /> PAN: {borrower.pan}</p>
                  )}
                  {borrower.registered_address && (
                    <p className="flex items-center gap-1.5"><MapPin size={12} className="flex-shrink-0" /> <span className="truncate">{borrower.registered_address}</span></p>
                  )}
                </div>
              </div>

              <div className="border-t border-brand-border mt-6 pt-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-brand-textPrimary">
                  {borrower.promoter_details?.length || 0} Promoters
                </span>
                <span className="text-[10px] text-brand-textSecondary">
                  Incorporated {borrower.date_of_incorporation || "N/A"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Onboarding Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-brand-border w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-brand-textPrimary flex items-center gap-1.5">
                <UserPlus size={18} className="text-brand-primary" /> Onboard Corporate Borrower
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-brand-surface rounded text-brand-textSecondary">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs text-brand-textPrimary">
              {/* Core Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Company / Entity Name *</label>
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="e.g. Acme Manufacturing Pvt Ltd"
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Constitution *</label>
                  <select 
                    value={constitution}
                    onChange={(e) => setConstitution(e.target.value)}
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none focus:border-brand-primary"
                  >
                    <option>Private Limited Company</option>
                    <option>Public Limited Company</option>
                    <option>Limited Liability Partnership (LLP)</option>
                    <option>Proprietorship</option>
                    <option>Partnership Firm</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Industry Segment *</label>
                  <select 
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none focus:border-brand-primary"
                  >
                    <option>Manufacturing</option>
                    <option>Real Estate Development</option>
                    <option>Healthcare & Hospitals</option>
                    <option>Hotel & Hospitality</option>
                    <option>Solar Energy IPP</option>
                    <option>Logistics & Warehouse</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Registration Number (CIN / LLPIN)</label>
                  <input 
                    type="text" 
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="e.g. U74999DL2024PTC123456"
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Date of Incorporation</label>
                  <input 
                    type="date" 
                    value={incDate}
                    onChange={(e) => setIncDate(e.target.value)}
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Company PAN</label>
                  <input 
                    type="text" 
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Registered Office Address</label>
                  <textarea 
                    value={regAddr}
                    onChange={(e) => setRegAddr(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-textSecondary mb-1.5">Corporate / Site Office Address</label>
                  <textarea 
                    value={officeAddr}
                    onChange={(e) => setOfficeAddr(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 border border-brand-border rounded-lg bg-brand-surface outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Promoter Information */}
              <div className="border-t border-brand-border pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-xs text-brand-textPrimary">Promoters & Equity Holders</h3>
                  <button 
                    type="button"
                    onClick={addPromoterRow}
                    className="px-3 py-1.5 bg-brand-surface border border-brand-border hover:bg-brand-border rounded-full text-[10px] font-bold inline-flex items-center gap-1"
                  >
                    <Plus size={10} /> Add Promoter
                  </button>
                </div>

                {/* Column Headers (Desktop only) */}
                <div className="hidden md:flex items-center gap-3 px-3 mb-2 text-brand-textSecondary font-bold text-[10px] uppercase tracking-wider">
                  <div className="flex-1">Name</div>
                  <div className="w-20">Age</div>
                  <div className="w-28">Equity Percentage</div>
                  <div className="w-10"></div> {/* spacer for remove button */}
                </div>

                <div className="space-y-3">
                  {promoters.map((p, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row items-center gap-3 p-3 bg-brand-surface border border-brand-border rounded-xl">
                      <div className="flex-1 w-full">
                        <input 
                          type="text" 
                          required
                          value={p.name}
                          onChange={(e) => updatePromoter(idx, "name", e.target.value)}
                          placeholder="Promoter Full Name"
                          className="w-full p-2 border border-brand-border rounded-lg bg-white outline-none"
                        />
                      </div>
                      <div className="w-full md:w-20">
                        <input 
                          type="number" 
                          required
                          value={p.age}
                          onChange={(e) => updatePromoter(idx, "age", Number(e.target.value))}
                          placeholder="Age"
                          className="w-full p-2 border border-brand-border rounded-lg bg-white outline-none"
                        />
                      </div>
                      <div className="w-full md:w-28">
                        <input 
                          type="number" 
                          required
                          value={p.equity_percentage}
                          onChange={(e) => updatePromoter(idx, "equity_percentage", Number(e.target.value))}
                          placeholder="Equity %"
                          className="w-full p-2 border border-brand-border rounded-lg bg-white outline-none"
                        />
                      </div>
                      {promoters.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removePromoterRow(idx)}
                          className="p-2 text-brand-danger hover:bg-brand-danger/10 rounded-full"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-brand-border pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-brand-border hover:bg-brand-surface rounded-full font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-full font-bold shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
