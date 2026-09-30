// API client for the PHP + MySQL backend (see /php-project).
// Auth uses PHP native sessions (cookies), so every request sends credentials: 'include'.
const BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

// Use the same configurable backend for endpoints fetched outside the API client too.
export function apiUrl(path: string) {
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

export interface TimelineStep {
  label: string;
  date: string;
  note?: string | null;
}

export interface Ticket {
  id: string;
  building: string;
  area: string;
  type: string;
  description: string;
  image?: string | null;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  statusLabel: string;
  reporter: string;
  reporterEmail: string;
  reporterPhone: string;
  assignee?: string | null;
  staffNote?: string | null;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineStep[];
}

export interface Meta {
  buildings: string[];
  issueTypes: string[];
  statusLabels: Record<string, string>;
  staff: string[];
}

export interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byType: { type: string; c: number }[];
  byBuilding: { building: string; c: number }[];
  byMonth: { month: string; total: number; resolved: number }[];
  avgResolutionByBuilding: { building: string; hours: number }[];
}

export interface HistoryItem { id: number; time: string; ticket: string; status: string; statusLabel: string; by: string | null; note: string | null; }
export interface HistoryData { summary: { total: number; pending: number; in_progress: number; resolved: number; closed: number }; items: HistoryItem[]; }
export interface AdminUser { id: number; name: string; studentId: string | null; email: string; phone: string | null; faculty: string | null; role: 'user' | 'admin'; status: 'active' | 'suspended'; problemCount: number; }
export interface SystemSettings { [key: string]: string; }

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };
  const res = await fetch(apiUrl(path), { ...options, headers, credentials: 'include' });
  let data: any = null;
  try { data = await res.json(); } catch { /* no body */ }
  if (!res.ok) {
    throw new Error(data?.error || `เกิดข้อผิดพลาด (${res.status})`);
  }
  return data;
}

export const api = {
  register: (payload: { name: string; studentId?: string; email: string; phone?: string; faculty?: string; password: string }) =>
    request('/auth/register.php', { method: 'POST', body: JSON.stringify(payload) }),
  login: (email: string, password: string) =>
    request('/auth/login.php', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request('/auth/logout.php', { method: 'POST' }),
  me: () => request('/auth/me.php'),
  updateMe: (payload: Partial<{ name: string; studentId: string; phone: string; faculty: string }>) =>
    request('/auth/me.php', { method: 'PATCH', body: JSON.stringify(payload) }),
  changePassword: (currentPassword: string, newPassword: string) =>
    request('/auth/change-password.php', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }),

  meta: () => request('/meta.php'),

  listTickets: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v))).toString();
    return request(`/tickets/list.php${qs ? `?${qs}` : ''}`);
  },
  getTicket: (id: string) => request(`/tickets/get.php?id=${encodeURIComponent(id)}`),
  createTicket: (payload: { building: string; area: string; type: string; description: string; image?: string | null }) =>
    request('/tickets/create.php', { method: 'POST', body: JSON.stringify(payload) }),
  updateTicket: (id: string, payload: Partial<{ status: string; assignee: string; staffNote: string }>) =>
    request(`/tickets/update.php?id=${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) }),

  stats: () => request('/stats.php'),

  history: (): Promise<HistoryData> => request('/history.php'),

  listUsers: (): Promise<{ users: AdminUser[] }> => request('/users/list.php'),
  createUser: (p: Record<string, string>) => request('/users/save.php', { method: 'POST', body: JSON.stringify(p) }),
  updateUser: (id: number, p: Record<string, string>) => request(`/users/save.php?id=${id}`, { method: 'PATCH', body: JSON.stringify(p) }),
  deleteUser: (id: number) => request(`/users/delete.php?id=${id}`, { method: 'DELETE' }),

  getSettings: (): Promise<{ settings: SystemSettings }> => request('/settings.php'),
  saveSettings: (p: SystemSettings): Promise<{ settings: SystemSettings }> => request('/settings.php', { method: 'PUT', body: JSON.stringify(p) }),

  nettestLatest: () => request('/nettest/latest.php'),
  nettestSaveResult: (payload: { downloadMbps: number; uploadMbps: number; pingMs: number }) =>
    request('/nettest/save.php', { method: 'POST', body: JSON.stringify(payload) }),
};
