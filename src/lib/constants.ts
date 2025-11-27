// API Gateway Configuration
const GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';
const PROJECT_SERVICE = process.env.NEXT_PUBLIC_PROJECT_SERVICE || '/project-management-service';

// Full API Base URL through Gateway
export const API_BASE_URL = `${GATEWAY_URL}${PROJECT_SERVICE}`;

// Debug logging
console.log('=== API Configuration ===');
console.log('GATEWAY_URL:', GATEWAY_URL);
console.log('PROJECT_SERVICE:', PROJECT_SERVICE);
console.log('API_BASE_URL:', API_BASE_URL);
console.log('========================');

export const API_ENDPOINTS = {
  PROJECTS: `${API_BASE_URL}/Project`,
  TASKS: `${API_BASE_URL}/Task`,
  ISSUES: `${API_BASE_URL}/Issue`,
  USERS: `${API_BASE_URL}/User`,
  DASHBOARD: `${API_BASE_URL}/Dashboard`,
} as const;

export const ITEMS_PER_PAGE = 10;

export const STATUS_COLORS = {
  ACTIVE: 'bg-emerald-300 text-slate-700',
  ON_HOLD: 'bg-yellow-300 text-slate-700',
  COMPLETED: 'bg-sky-300 text-slate-700',
} as const;
