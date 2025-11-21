export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:44318/api';

export const API_ENDPOINTS = {
  PROJECTS: `${API_BASE_URL}/Project`,
  TASKS: `${API_BASE_URL}/Task`,
  ISSUES: `${API_BASE_URL}/Issue`,
  USERS: `${API_BASE_URL}/User`,
} as const;

export const ITEMS_PER_PAGE = 10;

export const STATUS_COLORS = {
  ACTIVE: 'bg-emerald-300 text-slate-700',
  ON_HOLD: 'bg-yellow-300 text-slate-700',
  COMPLETED: 'bg-sky-300 text-slate-700',
} as const;
