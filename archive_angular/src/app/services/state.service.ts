import { Injectable } from '@angular/core';

export interface ModuleMetadata {
  name: string;
  description: string;
  recordType: string;
  guidance: string[];
}

export interface RecordItem {
  name: string;
  details: string;
}

export interface ModuleData {
  records: RecordItem[];
  table?: string[][];
}

export interface FamilyPerson {
  id: string;
  name: string;
  relation: string;
  parent: string;
}

export interface FamilyTree {
  next: number;
  people: FamilyPerson[];
}

export interface GroupData {
  shareholders: string[][];
  beneficiaries: string[][];
  directors: string[][];
}

export interface AppState {
  [moduleName: string]: any;
  files?: number;
  familyTree?: FamilyTree;
  groupTables?: GroupData;
  costCalculation?: {
    phase1: number[];
    phase2: number[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  public activeScreen: 'dashboard' | 'moduleScreen' | 'review' = 'dashboard';
  public activeModuleName = '';
  
  public state!: AppState;

  public readonly modules: ModuleMetadata[] = [
    {
      name: 'About Borrowing Entity and Group',
      description: 'Group entities, shareholders, directors, and beneficiaries',
      recordType: 'Group entity',
      guidance: ['Borrower profile', 'Group companies and relationships', 'Shareholders and directors']
    },
    {
      name: 'List of Completed Projects by the Group',
      description: 'Every past project with delivery, sales, images, and documents',
      recordType: 'Completed project',
      guidance: ['Project profile', 'Completion and sales status', 'Project photos']
    },
    {
      name: 'Ongoing Projects',
      description: 'Every live project, construction milestone, inventory, and sales position',
      recordType: 'Ongoing project',
      guidance: ['Project and RERA details', 'Construction progress', 'Inventory and sales']
    },
    {
      name: 'Family Chart',
      description: 'People and relationships, or a completed uploaded family chart',
      recordType: 'Family member',
      guidance: ['Family member', 'Relationship', 'Supporting image']
    },
    {
      name: 'About Promoters',
      description: 'Individual promoter profiles and passport photographs',
      recordType: 'Promoter',
      guidance: ['Personal profile', 'Experience and qualification', 'Passport image']
    },
    {
      name: 'Group Shareholding Pattern',
      description: 'Shareholders and beneficiaries with ownership validation',
      recordType: 'Shareholder',
      guidance: ['Shareholder details', 'Shareholding percentage', 'Beneficiary details']
    },
    {
      name: 'About Project – Mango Mass – I and II',
      description: 'Phases, towers, unit mix, location and elevation imagery',
      recordType: 'Project phase',
      guidance: ['Phase / tower', 'Land and unit details', 'Location and elevation']
    },
    {
      name: 'Cost of Project and Means of Finance',
      description: 'Cost heads and funding sources with automatic reconciliation',
      recordType: 'Cost line',
      guidance: ['Cost heads', 'Funding sources', 'Automatic totals']
    },
    {
      name: 'Land Cost and Payment Details',
      description: 'Land parcels, cost build-up and payment milestones',
      recordType: 'Land payment',
      guidance: ['Land parcel', 'Payment milestone', 'Supporting document']
    },
    {
      name: 'Group Debt as on date',
      description: 'Every loan and facility across the group',
      recordType: 'Loan facility',
      guidance: ['Lender and facility', 'Outstanding and repayment', 'Security and documents']
    },
    {
      name: 'Group Project Sales Velocity for past 24 Months',
      description: 'Monthly project sales, collections and receivables',
      recordType: 'Project sales record',
      guidance: ['Project', 'Monthly sales', 'Collections and receivables']
    },
    {
      name: 'Group Financial Summary',
      description: 'Separate financial summary for every group company',
      recordType: 'Company financial summary',
      guidance: ['Company', 'Financial statements', 'Ratios and notes']
    },
    {
      name: 'Annexure – I',
      description: 'Transactions, block divisions, schedules and attachments',
      recordType: 'Annexure item',
      guidance: ['Transaction or schedule', 'Supporting detail', 'Attachment']
    }
  ];

  public readonly tableSchemas: { [key: string]: string[] } = {
    'About Borrowing Entity and Group': ['Company Name', 'Registered Office (Full Address)', 'Administrative office (Full Address)', 'PAN', 'CIN No.'],
    'List of Completed Projects by the Group': ['Project Name', 'Location of the project', 'Type'],
    'Ongoing Projects': ['Status', 'Units', 'Carpet Area Sq Mt', 'Carpet Area Sq ft', 'Unit Amount (Rs. In Lakhs)', 'Received Amount (Rs. In Lakhs)', 'Outstanding Amount (Rs. In Lakhs)'],
    'About Promoters': ['Name', 'Age', 'Qualification', 'Experience', 'Designation'],
    'Group Shareholding Pattern': ['Name of Shareholder', 'No. of Shares', 'Shareholding in %'],
    'About Project – Mango Mass – I and II': ['Tower', 'Floor', 'Composition', 'Unit Range', 'Total No. of units'],
    'Land Cost and Payment Details': ['Sale Deed Date', 'Sale Deed No.', 'Amount', 'Remarks'],
    'Group Debt as on date': ['Sr. No.', 'Bank', 'Company', 'Project Maped', 'Collateral Offered', 'Type', 'Sanction Amount (Rs. In Cr.)', 'O/s as on 31.12.2025'],
    'Group Project Sales Velocity for past 24 Months': ['Project Name', 'Developing Entity', 'Type', 'Total Carpet area (sq ft.)', 'Area sold (sq ft.)', 'Area unsold (sq. ft.)', 'Total Unit Value (Rs. In Lakhs)', 'Net Receivables (Rs. In Lakhs)'],
    'Group Financial Summary': ['Particulars', 'FY 2023', 'FY 2024', 'FY 2025'],
    'Annexure – I': ['Particulars', 'Details', 'Amount', 'Remarks']
  };

  constructor() {
    this.load();
  }

  public load(): void {
    const raw = localStorage.getItem('borrowerPortal');
    if (raw) {
      try {
        this.state = JSON.parse(raw);
        // Ensure sub-structures exist
        this.initDefaultSubstructures();
        return;
      } catch (e) {
        console.error('Failed to parse borrowerPortal state from localStorage, resetting to defaults.', e);
      }
    }
    this.resetToDefaults();
  }

  public save(): void {
    localStorage.setItem('borrowerPortal', JSON.stringify(this.state));
  }

  public resetToDefaults(): void {
    this.state = {
      files: 0,
      familyTree: {
        next: 5,
        people: [
          { id: '1', name: 'Primary promoter', relation: 'Promoter', parent: '' },
          { id: '2', name: 'Spouse', relation: 'Spouse', parent: '1' },
          { id: '3', name: 'Child 1', relation: 'Child', parent: '1' },
          { id: '4', name: 'Child 2', relation: 'Child', parent: '1' }
        ]
      },
      groupTables: {
        shareholders: [
          ['Shareholder 1', '1', '0'],
          ['Shareholder 2', '699999', '100']
        ],
        beneficiaries: [
          ['Beneficiary 1', '20'],
          ['Beneficiary 2', '23'],
          ['Beneficiary 3', '27'],
          ['Beneficiary 4', '30']
        ],
        directors: [
          ['First person', 'Director', ''],
          ['Second person', 'Director', ''],
          ['Third Person', 'Director', '']
        ]
      },
      costCalculation: {
        phase1: [930.09, 6731.75, 567.41, 217.97, 2359.17],
        phase2: [1155, 7165.95, 604.01, 232.03, 2511.34]
      }
    };

    // Pre-populate some empty lists for all modules so they exist in state
    this.modules.forEach(m => {
      this.state[m.name] = { records: [] };
    });

    this.save();
  }

  private initDefaultSubstructures(): void {
    if (!this.state.familyTree) {
      this.state.familyTree = {
        next: 5,
        people: [
          { id: '1', name: 'Primary promoter', relation: 'Promoter', parent: '' },
          { id: '2', name: 'Spouse', relation: 'Spouse', parent: '1' },
          { id: '3', name: 'Child 1', relation: 'Child', parent: '1' },
          { id: '4', name: 'Child 2', relation: 'Child', parent: '1' }
        ]
      };
    }
    if (!this.state.groupTables) {
      this.state.groupTables = {
        shareholders: [
          ['Shareholder 1', '1', '0'],
          ['Shareholder 2', '699999', '100']
        ],
        beneficiaries: [
          ['Beneficiary 1', '20'],
          ['Beneficiary 2', '23'],
          ['Beneficiary 3', '27'],
          ['Beneficiary 4', '30']
        ],
        directors: [
          ['First person', 'Director', ''],
          ['Second person', 'Director', ''],
          ['Third Person', 'Director', '']
        ]
      };
    }
    if (!this.state.costCalculation) {
      this.state.costCalculation = {
        phase1: [930.09, 6731.75, 567.41, 217.97, 2359.17],
        phase2: [1155, 7165.95, 604.01, 232.03, 2511.34]
      };
    }
    this.modules.forEach(m => {
      if (!this.state[m.name]) {
        this.state[m.name] = { records: [] };
      }
    });
  }

  public getModuleData(name: string): ModuleData {
    if (!this.state[name]) {
      this.state[name] = { records: [] };
    }
    return this.state[name];
  }

  public getCompletionPercentage(): number {
    let completedCount = 0;
    this.modules.forEach(m => {
      const data = this.getModuleData(m.name);
      const hasRecords = data.records && data.records.length > 0;
      const hasTable = data.table && data.table.length > 0;
      
      // If it's About Borrowing Entity, check group tables or records
      if (m.name === 'About Borrowing Entity and Group') {
        const group = this.state.groupTables;
        const groupHasData = group && (group.shareholders.length > 0 || group.beneficiaries.length > 0 || group.directors.length > 0);
        if (hasRecords || groupHasData || hasTable) {
          completedCount++;
        }
      } else if (m.name === 'Family Chart') {
        const family = this.state.familyTree;
        if (family && family.people.length > 0) {
          completedCount++;
        }
      } else if (m.name === 'Cost of Project and Means of Finance') {
        // Always completed as it has defaults
        completedCount++;
      } else {
        if (hasRecords || hasTable) {
          completedCount++;
        }
      }
    });
    return Math.round((completedCount / this.modules.length) * 100);
  }

  public getStartedModulesCount(): number {
    let startedCount = 0;
    this.modules.forEach(m => {
      const data = this.getModuleData(m.name);
      if (m.name === 'About Borrowing Entity and Group') {
        startedCount++; // Usually pre-populated
      } else if (m.name === 'Family Chart') {
        startedCount++; // Usually pre-populated
      } else if (m.name === 'Cost of Project and Means of Finance') {
        startedCount++;
      } else if (data.records && data.records.length > 0) {
        startedCount++;
      } else if (data.table && data.table.length > 0) {
        startedCount++;
      }
    });
    return startedCount;
  }

  // Cost calculations
  public getCostRowTotals(): string[] {
    const calc = this.state.costCalculation;
    if (!calc) return [];
    return calc.phase1.map((p1, index) => {
      const p2 = calc.phase2[index] || 0;
      return (p1 + p2).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    });
  }

  public getCostTotals(): { phase1: number; phase2: number; total: number } {
    const calc = this.state.costCalculation;
    if (!calc) return { phase1: 0, phase2: 0, total: 0 };
    const p1Total = calc.phase1.reduce((s, v) => s + (v || 0), 0);
    const p2Total = calc.phase2.reduce((s, v) => s + (v || 0), 0);
    return {
      phase1: p1Total,
      phase2: p2Total,
      total: p1Total + p2Total
    };
  }

  // Table columns calculations helper
  public isNumericColumn(label: string): boolean {
    return /No\.|Amount|Area|Units|Shares|%|O\/s|Receivables|FY \d/.test(label);
  }

  public getTableColTotal(moduleName: string, colIndex: number): string {
    const data = this.getModuleData(moduleName);
    if (!data.table) return '';
    const sum = data.table.reduce((acc, row) => acc + (Number(row[colIndex]) || 0), 0);
    return sum.toLocaleString('en-IN');
  }

  // Group tables calculations helper
  public getGroupTableColTotal(key: 'shareholders' | 'beneficiaries', colIndex: number): string {
    const group = this.state.groupTables;
    if (!group) return '';
    const rows = group[key];
    const sum = rows.reduce((acc, row) => acc + (Number(row[colIndex]) || 0), 0);
    if (key === 'shareholders' && colIndex === 2) {
      return sum.toFixed(2) + ' %';
    }
    if (key === 'beneficiaries' && colIndex === 1) {
      return sum.toFixed(2) + ' %';
    }
    return sum.toLocaleString('en-IN');
  }

  public setScreen(screen: 'dashboard' | 'moduleScreen' | 'review'): void {
    this.activeScreen = screen;
  }

  public openModule(name: string): void {
    this.activeModuleName = name;
    this.setScreen('moduleScreen');
  }
}
