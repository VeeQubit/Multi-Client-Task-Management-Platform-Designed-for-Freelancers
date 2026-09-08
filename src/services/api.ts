import {
  UserProfile,
  Client,
  Project,
  Task,
  TimeEntry,
  Invoice,
  AppNotification,
} from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Health
  checkHealth: () => fetchJson<{ status: string }>('/health'),

  // Auth
  login: (email: string) =>
    fetchJson<{ success: boolean; user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  register: (name: string, email: string, profession?: string) =>
    fetchJson<{ success: boolean; user: UserProfile }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, profession }),
    }),

  getCurrentUser: () => fetchJson<{ user: UserProfile | null }>('/auth/me'),

  updateProfile: (profile: Partial<UserProfile>) =>
    fetchJson<{ success: boolean; user: UserProfile }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),

  // Clients
  getClients: () => fetchJson<Client[]>('/clients'),
  createClient: (client: Omit<Client, 'id' | 'createdAt' | 'totalBilled'>) =>
    fetchJson<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    }),
  updateClient: (id: string, updates: Partial<Client>) =>
    fetchJson<Client>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteClient: (id: string) =>
    fetchJson<{ success: boolean; id: string }>(`/clients/${id}`, {
      method: 'DELETE',
    }),

  // Projects
  getProjects: () => fetchJson<Project[]>('/projects'),
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'spent' | 'progress'>) =>
    fetchJson<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    }),
  updateProject: (id: string, updates: Partial<Project>) =>
    fetchJson<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteProject: (id: string) =>
    fetchJson<{ success: boolean; id: string }>(`/projects/${id}`, {
      method: 'DELETE',
    }),

  // Tasks
  getTasks: () => fetchJson<Task[]>('/tasks'),
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'actualHours'>) =>
    fetchJson<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),
  updateTask: (id: string, updates: Partial<Task>) =>
    fetchJson<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteTask: (id: string) =>
    fetchJson<{ success: boolean; id: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    }),

  // Time Entries
  getTimeEntries: () => fetchJson<TimeEntry[]>('/time-entries'),
  createTimeEntry: (entry: Omit<TimeEntry, 'id'>) =>
    fetchJson<TimeEntry>('/time-entries', {
      method: 'POST',
      body: JSON.stringify(entry),
    }),
  deleteTimeEntry: (id: string) =>
    fetchJson<{ success: boolean; id: string }>(`/time-entries/${id}`, {
      method: 'DELETE',
    }),

  // Invoices
  getInvoices: () => fetchJson<Invoice[]>('/invoices'),
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) =>
    fetchJson<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    }),
  updateInvoice: (id: string, updates: Partial<Invoice>) =>
    fetchJson<Invoice>(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteInvoice: (id: string) =>
    fetchJson<{ success: boolean; id: string }>(`/invoices/${id}`, {
      method: 'DELETE',
    }),

  // Notifications
  getNotifications: () => fetchJson<AppNotification[]>('/notifications'),
  markNotificationRead: (id: string) =>
    fetchJson<{ success: boolean }>(`/notifications/${id}/read`, {
      method: 'PUT',
    }),
  clearNotifications: () =>
    fetchJson<{ success: boolean }>('/notifications', {
      method: 'DELETE',
    }),

  // AI Chat
  sendAiMessage: (message: string) =>
    fetchJson<{ reply: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  // Reset Data
  resetData: () => fetchJson<{ success: boolean }>('/reset', { method: 'POST' }),
};

