const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    const url = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
    return `${url}/api/v1`;
  }
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' ? 'http://localhost:8000/api/v1' : '/api/v1';
  }
  return 'http://backend:8000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

async function request(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  
  // Set mock auth token to match standard deps.py check
  headers.set('Authorization', 'Bearer pk_test_mock');
  
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  // Handle binary download responses (PDF/Word)
  const contentType = response.headers.get('Content-Type');
  if (contentType && (contentType.includes('pdf') || contentType.includes('word') || contentType.includes('octet-stream'))) {
    return response.blob();
  }

  return response.json();
}

export const api = {
  // Auth
  getCurrentUser: () => request('/auth/me'),

  // Borrowers
  getBorrowers: () => request('/borrowers'),
  getBorrower: (id: string) => request(`/borrowers/${id}`),
  createBorrower: (data: any) => request('/borrowers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Projects
  getProjects: () => request('/projects'),
  getProject: (id: string) => request(`/projects/${id}`),
  createProject: (data: any) => request('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  createProjectLoan: (projectId: string, data: any) => request(`/projects/${projectId}/loans`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getProjectLoans: (projectId: string) => request(`/projects/${projectId}/loans`),
  createProjectFinancials: (projectId: string, data: any) => request(`/projects/${projectId}/financials`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getProjectFinancials: (projectId: string) => request(`/projects/${projectId}/financials`),

  // Calculators
  calculateProjectedCashFlow: (data: any) => request('/calc/projected-cash-flow', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  calculateSensitivity: (data: any) => request('/calc/sensitivity', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  autofillProposal: (companyName: string, prompt: string) => request('/calc/autofill', {
    method: 'POST',
    body: JSON.stringify({ company_name: companyName, prompt }),
  }),

  // OCR
  uploadDocument: (projectId: string, docType: string, file: File) => {
    const formData = new FormData();
    formData.append('project_id', projectId);
    formData.append('doc_type', docType);
    formData.append('file', file);
    return request('/ocr/upload', {
      method: 'POST',
      body: formData,
    });
  },
  getDocumentStatus: (docId: string) => request(`/ocr/document/${docId}`),

  // Reports
  getReports: () => request('/reports'),
  getReport: (id: string) => request(`/reports/${id}`),
  createReport: (data: any) => request('/reports', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateReport: (id: string, data: any) => request(`/reports/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  generateReport: (reportId: string, includeAi: boolean = true) => request('/reports/generate', {
    method: 'POST',
    body: JSON.stringify({ report_id: reportId, include_ai_sections: includeAi }),
  }),
  exportReportPdfUrl: (reportId: string) => `${API_BASE_URL}/reports/${reportId}/export/pdf`,
  exportReportDocxUrl: (reportId: string) => `${API_BASE_URL}/reports/${reportId}/export/docx`,

  // Admin
  getAdminAnalytics: () => request('/admin/analytics'),
  getAdminTemplates: () => request('/admin/templates'),
  getAdminUsers: () => request('/admin/users'),
};
