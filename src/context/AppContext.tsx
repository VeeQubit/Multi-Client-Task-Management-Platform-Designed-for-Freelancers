import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Client,
  Project,
  Task,
  TaskStatus,
  TimeEntry,
  Invoice,
  InvoiceStatus,
  AppNotification,
  ActiveTimer,
} from '../types';
import {
  initialUser,
  initialClients,
  initialProjects,
  initialTasks,
  initialTimeEntries,
  initialInvoices,
  initialNotifications,
} from '../data/initialData';
import { api } from '../services/api';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  undoAction?: () => void;
  undoLabel?: string;
  duration?: number;
}

interface AppContextType {
  // Navigation & Active View
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Auth & User
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, profession?: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  loginDemoUser: () => void;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Clients
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'totalBilled'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;

  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'spent' | 'progress'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  archiveProject: (id: string) => void;
  restoreProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'actualHours'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, newStatus: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  getTaskById: (id: string) => Task | undefined;

  // Time Tracker
  activeTimer: ActiveTimer;
  startTimer: (projectId: string, clientId: string, taskId?: string, description?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  updateTimerDescription: (desc: string) => void;
  timeEntries: TimeEntry[];
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  deleteTimeEntry: (id: string) => void;

  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;

  // Notifications
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  clearAllNotifications: () => void;

  // Toast Alerts
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;

  // Global Dialogs & Modals
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  isClientModalOpen: boolean;
  setIsClientModalOpen: (open: boolean) => void;
  selectedClientForEdit: Client | null;
  setSelectedClientForEdit: (client: Client | null) => void;
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: (open: boolean) => void;
  selectedProjectForEdit: Project | null;
  setSelectedProjectForEdit: (project: Project | null) => void;
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  selectedTaskForEdit: Task | null;
  setSelectedTaskForEdit: (task: Task | null) => void;
  isInvoiceModalOpen: boolean;
  setIsInvoiceModalOpen: (open: boolean) => void;
  selectedInvoiceForEdit: Invoice | null;
  setSelectedInvoiceForEdit: (invoice: Invoice | null) => void;
  isTimeLogModalOpen: boolean;
  setIsTimeLogModalOpen: (open: boolean) => void;

  // Data Reset / Export / Import
  resetAllDataToDemo: () => void;
  exportDataAsJson: () => void;
  importDataFromJson: (jsonData: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'meplus_user_v1',
  USERS: 'meplus_registered_users_v1',
  ACTIVE_TIMER: 'meplus_active_timer_v1',
  CLIENTS_PREFIX: 'meplus_clients_user_',
  PROJECTS_PREFIX: 'meplus_projects_user_',
  TASKS_PREFIX: 'meplus_tasks_user_',
  TIME_PREFIX: 'meplus_time_user_',
  INVOICES_PREFIX: 'meplus_invoices_user_',
  NOTIFS_PREFIX: 'meplus_notifs_user_',
};

interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  title?: string;
  avatar?: string;
  hourlyRate?: number;
  currency?: string;
  bio?: string;
}

const defaultRegisteredUsers: RegisteredAccount[] = [
  {
    id: 'usr-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@gmail.com',
    password: 'password123',
    title: 'Senior Graphic & UI Designer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    hourlyRate: 65,
    currency: '$',
    bio: 'Specialized in building modern web interfaces, digital branding, and UI systems.',
  },
  {
    id: 'usr-demo',
    name: 'Alex Rivera',
    email: 'demo@meplus.io',
    password: 'password123',
    title: 'Senior Graphic & UI Designer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    hourlyRate: 65,
    currency: '$',
    bio: 'Specialized in building modern web interfaces, digital branding, and UI systems.',
  },
];

function isDemoAccount(u: UserProfile | null | undefined): boolean {
  if (!u) return false;
  return u.id === 'usr-1' || u.id === 'usr-demo' || u.email === 'alex.rivera@gmail.com' || u.email === 'demo@meplus.io';
}

function safeGetStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved);
  } catch (e) {
    console.warn(`Error parsing localStorage for ${key}`, e);
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Registered Users Directory
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredAccount[]>(() => {
    return safeGetStorage<RegisteredAccount[]>(STORAGE_KEYS.USERS, defaultRegisteredUsers);
  });

  // User & Auth State
  const [user, setUser] = useState<UserProfile | null>(() => {
    return safeGetStorage<UserProfile | null>(STORAGE_KEYS.USER, null);
  });

  // Per-User Collections Initializers
  const [clients, setClients] = useState<Client[]>(() => {
    const initial = safeGetStorage<UserProfile | null>(STORAGE_KEYS.USER, null);
    if (!initial) return [];
    if (isDemoAccount(initial)) {
      return safeGetStorage<Client[]>(`${STORAGE_KEYS.CLIENTS_PREFIX}${initial.id}`, initialClients);
    }
    return safeGetStorage<Client[]>(`${STORAGE_KEYS.CLIENTS_PREFIX}${initial.id}`, []);
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const initial = safeGetStorage<UserProfile | null>(STORAGE_KEYS.USER, null);
    if (!initial) return [];
    if (isDemoAccount(initial)) {
      return safeGetStorage<Project[]>(`${STORAGE_KEYS.PROJECTS_PREFIX}${initial.id}`, initialProjects);
    }
    return safeGetStorage<Project[]>(`${STORAGE_KEYS.PROJECTS_PREFIX}${initial.id}`, []);
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const initial = safeGetStorage<UserProfile | null>(STORAGE_KEYS.USER, null);
    if (!initial) return [];
    if (isDemoAccount(initial)) {
      return safeGetStorage<Task[]>(`${STORAGE_KEYS.TASKS_PREFIX}${initial.id}`, initialTasks);
    }
    return safeGetStorage<Task[]>(`${STORAGE_KEYS.TASKS_PREFIX}${initial.id}`, []);
  });

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    const initial = safeGetStorage<UserProfile | null>(STORAGE_KEYS.USER, null);
    if (!initial) return [];
    if (isDemoAccount(initial)) {
      return safeGetStorage<TimeEntry[]>(`${STORAGE_KEYS.TIME_PREFIX}${initial.id}`, initialTimeEntries);
    }
    return safeGetStorage<TimeEntry[]>(`${STORAGE_KEYS.TIME_PREFIX}${initial.id}`, []);
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const initial = safeGetStorage<UserProfile | null>(STORAGE_KEYS.USER, null);
    if (!initial) return [];
    if (isDemoAccount(initial)) {
      return safeGetStorage<Invoice[]>(`${STORAGE_KEYS.INVOICES_PREFIX}${initial.id}`, initialInvoices);
    }
    return safeGetStorage<Invoice[]>(`${STORAGE_KEYS.INVOICES_PREFIX}${initial.id}`, []);
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const initial = safeGetStorage<UserProfile | null>(STORAGE_KEYS.USER, null);
    if (!initial) return [];
    if (isDemoAccount(initial)) {
      return safeGetStorage<AppNotification[]>(`${STORAGE_KEYS.NOTIFS_PREFIX}${initial.id}`, initialNotifications);
    }
    return safeGetStorage<AppNotification[]>(`${STORAGE_KEYS.NOTIFS_PREFIX}${initial.id}`, [
      {
        id: `notif-welcome-${initial.id}`,
        userId: initial.id,
        title: 'Welcome to Me Plus!',
        message: `Hello ${initial.name}, your workspace is ready. Click "+ New Client" to start managing projects.`,
        type: 'system',
        priority: 'medium',
        timestamp: 'Just now',
        read: false,
      },
    ]);
  });

  // Active Stopwatch Timer
  const [activeTimer, setActiveTimer] = useState<ActiveTimer>(() => {
    return safeGetStorage<ActiveTimer>(STORAGE_KEYS.ACTIVE_TIMER, {
      isRunning: false,
      projectId: '',
      taskId: '',
      clientId: '',
      description: '',
      startTime: 0,
      elapsedSeconds: 0,
    });
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals & Dialogs
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClientForEdit, setSelectedClientForEdit] = useState<Client | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoiceForEdit, setSelectedInvoiceForEdit] = useState<Invoice | null>(null);
  const [isTimeLogModalOpen, setIsTimeLogModalOpen] = useState(false);

  // Load and sync isolated data when active user changes
  const loadUserData = useCallback((currentUser: UserProfile | null) => {
    if (!currentUser) {
      setClients([]);
      setProjects([]);
      setTasks([]);
      setTimeEntries([]);
      setInvoices([]);
      setNotifications([]);
      return;
    }

    const isDemo = isDemoAccount(currentUser);

    // Initial local storage read for immediate rendering
    const localClients = safeGetStorage<Client[]>(
      `${STORAGE_KEYS.CLIENTS_PREFIX}${currentUser.id}`,
      isDemo ? initialClients : []
    );
    const localProjects = safeGetStorage<Project[]>(
      `${STORAGE_KEYS.PROJECTS_PREFIX}${currentUser.id}`,
      isDemo ? initialProjects : []
    );
    const localTasks = safeGetStorage<Task[]>(
      `${STORAGE_KEYS.TASKS_PREFIX}${currentUser.id}`,
      isDemo ? initialTasks : []
    );
    const localTime = safeGetStorage<TimeEntry[]>(
      `${STORAGE_KEYS.TIME_PREFIX}${currentUser.id}`,
      isDemo ? initialTimeEntries : []
    );
    const localInvoices = safeGetStorage<Invoice[]>(
      `${STORAGE_KEYS.INVOICES_PREFIX}${currentUser.id}`,
      isDemo ? initialInvoices : []
    );
    const defaultWelcomeNotif: AppNotification[] = [
      {
        id: `notif-welcome-${currentUser.id}`,
        userId: currentUser.id,
        title: 'Welcome to Me Plus!',
        message: `Hello ${currentUser.name}, your workspace is ready. Click "+ New Client" to start managing projects.`,
        type: 'system',
        priority: 'medium',
        timestamp: 'Just now',
        read: false,
      },
    ];
    const localNotifs = safeGetStorage<AppNotification[]>(
      `${STORAGE_KEYS.NOTIFS_PREFIX}${currentUser.id}`,
      isDemo ? initialNotifications : defaultWelcomeNotif
    );

    setClients(localClients);
    setProjects(localProjects);
    setTasks(localTasks);
    setTimeEntries(localTime);
    setInvoices(localInvoices);
    setNotifications(localNotifs);

    // Sync from Backend REST API for this specific user
    Promise.all([
      api.getClients(currentUser.id).catch(() => null),
      api.getProjects(currentUser.id).catch(() => null),
      api.getTasks(currentUser.id).catch(() => null),
      api.getTimeEntries(currentUser.id).catch(() => null),
      api.getInvoices(currentUser.id).catch(() => null),
      api.getNotifications(currentUser.id).catch(() => null),
    ]).then(([apiClients, apiProjects, apiTasks, apiTime, apiInvoices, apiNotifs]) => {
      if (apiClients !== null) setClients(apiClients);
      if (apiProjects !== null) setProjects(apiProjects);
      if (apiTasks !== null) setTasks(apiTasks);
      if (apiTime !== null) setTimeEntries(apiTime);
      if (apiInvoices !== null) setInvoices(apiInvoices);
      if (apiNotifs !== null) {
        if (apiNotifs.length > 0) setNotifications(apiNotifs);
        else if (!isDemo) setNotifications(defaultWelcomeNotif);
      }
    });
  }, []);

  // When user changes, load their isolated data
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      loadUserData(user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
      loadUserData(null);
    }
  }, [user?.id]);

  // Persist user collections to isolated local storage keys
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`${STORAGE_KEYS.CLIENTS_PREFIX}${user.id}`, JSON.stringify(clients));
    }
  }, [clients, user?.id]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`${STORAGE_KEYS.PROJECTS_PREFIX}${user.id}`, JSON.stringify(projects));
    }
  }, [projects, user?.id]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`${STORAGE_KEYS.TASKS_PREFIX}${user.id}`, JSON.stringify(tasks));
    }
  }, [tasks, user?.id]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`${STORAGE_KEYS.TIME_PREFIX}${user.id}`, JSON.stringify(timeEntries));
    }
  }, [timeEntries, user?.id]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`${STORAGE_KEYS.INVOICES_PREFIX}${user.id}`, JSON.stringify(invoices));
    }
  }, [invoices, user?.id]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`${STORAGE_KEYS.NOTIFS_PREFIX}${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user?.id]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TIMER, JSON.stringify(activeTimer));
  }, [activeTimer]);

  // Active Timer Tick Handler
  const timerIntervalRef = useRef<number | null>(null);
  useEffect(() => {
    if (activeTimer.isRunning) {
      timerIntervalRef.current = window.setInterval(() => {
        setActiveTimer(prev => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        }));
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [activeTimer.isRunning]);

  // Global Keyboard Shortcuts (Ctrl+K for Command Palette, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast Manager
  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts(prev => [newToast, ...prev].slice(0, 5));

    const duration = toast.duration || 4500;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Sound chime for high priority alerts
  const playAlertChime = useCallback(() => {
    if (!user?.notificationSettings?.sound) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // Audio context may be blocked by browser policy
    }
  }, [user]);

  // User Actions - Strict Authentication with Bidirectional Persistence Sync
  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    // 1. Try backend REST API first
    try {
      const res = await api.login(normalizedEmail, password);
      if (res && res.user) {
        setUser(res.user);
        // Ensure user is synced in registeredUsers local directory as well
        setRegisteredUsers(prev => {
          if (!prev.some(u => u.email.toLowerCase() === normalizedEmail)) {
            return [
              ...prev,
              {
                id: res.user.id,
                name: res.user.name,
                email: normalizedEmail,
                password,
                title: res.user.title,
              },
            ];
          }
          return prev;
        });
        showToast({
          title: 'Welcome back!',
          message: `Signed in as ${res.user.name || res.user.email}`,
          type: 'success',
        });
        return { success: true };
      }
    } catch (err: any) {
      // If backend explicitly rejected due to wrong password for an account it has, return that error
      if (err?.message?.includes('password you entered is incorrect')) {
        return { success: false, error: err.message };
      }
      // If backend returned "no account registered" or network error, fall through to check local storage directory
    }

    // 2. Check local registered users directory (ensures persistence across browser sessions & Vercel deployment)
    const matched = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!matched) {
      return {
        success: false,
        error: 'Invalid credentials: No account is registered with this email. Please create an account first.',
      };
    }

    if (matched.password && matched.password !== password) {
      return {
        success: false,
        error: 'Invalid credentials: The password you entered is incorrect. Please check and try again.',
      };
    }

    // Seamless auto-sync to backend in background if backend was missing this user
    api.register(matched.name, matched.email, password, matched.title).catch(() => {});

    const authenticatedUser: UserProfile = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      avatar: matched.avatar || initialUser.avatar,
      title: matched.title || initialUser.title,
      hourlyRate: matched.hourlyRate || 65,
      currency: matched.currency || '$',
      bio: matched.bio || initialUser.bio,
      skills: initialUser.skills,
      notificationSettings: initialUser.notificationSettings,
      theme: 'light',
    };

    setUser(authenticatedUser);
    showToast({
      title: 'Welcome back!',
      message: `Signed in as ${authenticatedUser.name}`,
      type: 'success',
    });
    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    profession?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!name || !name.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // 1. Try backend REST API
    try {
      const res = await api.register(name.trim(), normalizedEmail, password, profession);
      if (res && res.user) {
        setUser(res.user);
        setRegisteredUsers(prev => [
          ...prev.filter(u => u.email.toLowerCase() !== normalizedEmail),
          {
            id: res.user.id,
            name: res.user.name,
            email: normalizedEmail,
            password,
            title: res.user.title,
          },
        ]);
        showToast({
          title: 'Account Created!',
          message: `Welcome to Me Plus, ${name}! Your fresh workspace is ready.`,
          type: 'success',
        });
        return { success: true };
      }
    } catch (err: any) {
      if (err?.message?.includes('already exists')) {
        return { success: false, error: err.message };
      }
    }

    // Check duplicate in local directory if backend was offline
    const existsLocally = registeredUsers.some(u => u.email.toLowerCase() === normalizedEmail);
    if (existsLocally) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    // Local client registration fallback (e.g. for static/Vercel environments)
    const newUserAccount: RegisteredAccount = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      title: profession || 'Independent Freelancer',
      avatar: initialUser.avatar,
    };

    setRegisteredUsers(prev => [...prev, newUserAccount]);

    const newUserProfile: UserProfile = {
      id: newUserAccount.id,
      name: newUserAccount.name,
      email: newUserAccount.email,
      avatar: initialUser.avatar,
      title: newUserAccount.title || 'Independent Freelancer',
      hourlyRate: 65,
      currency: '$',
      bio: `Freelancer specializing in ${profession || 'creative and digital services'}.`,
      skills: initialUser.skills,
      notificationSettings: initialUser.notificationSettings,
      theme: 'light',
    };

    setUser(newUserProfile);
    showToast({
      title: 'Account Created!',
      message: `Welcome to Me Plus, ${name}! Your fresh workspace is ready.`,
      type: 'success',
    });
    return { success: true };
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    try {
      const res = await api.forgotPassword(normalizedEmail);
      if (res && res.success) {
        return { success: true, message: res.message };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'No account found with this email address.' };
    }

    const found = registeredUsers.some(u => u.email.toLowerCase() === normalizedEmail);
    if (!found) {
      return {
        success: false,
        error: 'No registered account found with this email address. Please verify your email.',
      };
    }

    return {
      success: true,
      message: 'Account verified! You may now set your new password.',
    };
  };

  const resetPassword = async (
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    try {
      await api.resetPassword(normalizedEmail, newPassword);
    } catch {
      // continue with local update
    }

    setRegisteredUsers(prev =>
      prev.map(u => (u.email.toLowerCase() === normalizedEmail ? { ...u, password: newPassword } : u))
    );

    showToast({
      title: 'Password Updated',
      message: 'Your password has been changed. You can now sign in with your new password.',
      type: 'success',
    });

    return {
      success: true,
      message: 'Your password has been successfully updated! You can now sign in.',
    };
  };

  const loginDemoUser = () => {
    setUser(initialUser);
    api.login(initialUser.email, 'password123').catch(() => {});
    showToast({
      title: 'Demo Mode Activated',
      message: 'Logged in as Alex Rivera with sample projects & clients.',
      type: 'info',
    });
  };

  const logout = () => {
    resetTimer();
    setUser(null);
    showToast({
      title: 'Logged Out',
      message: 'You have safely signed out of Me Plus.',
      type: 'info',
    });
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser(prev => (prev ? { ...prev, ...profile } : null));
    api.updateProfile(profile).catch(() => {});
    showToast({
      title: 'Profile Updated',
      message: 'Your personal settings have been saved.',
      type: 'success',
    });
  };

  // Client Actions
  const addClient = (newClientData: Omit<Client, 'id' | 'createdAt' | 'totalBilled'>) => {
    const newClient: Client = {
      ...newClientData,
      id: `cli-${Date.now()}`,
      userId: user?.id || 'usr-1',
      createdAt: new Date().toISOString().split('T')[0],
      totalBilled: 0,
    };
    setClients(prev => [newClient, ...prev]);
    api.createClient(newClient).catch(() => {});
    showToast({
      title: 'Client Added',
      message: `${newClient.name} (${newClient.company}) has been added.`,
      type: 'success',
      undoAction: () => {
        setClients(prev => prev.filter(c => c.id !== newClient.id));
        api.deleteClient(newClient.id).catch(() => {});
      },
      undoLabel: 'Undo',
    });
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    api.updateClient(id, updates).catch(() => {});
    showToast({
      title: 'Client Updated',
      message: 'Client information has been updated.',
      type: 'success',
    });
  };

  const deleteClient = (id: string) => {
    const clientToDelete = clients.find(c => c.id === id);
    if (!clientToDelete) return;

    setClients(prev => prev.filter(c => c.id !== id));
    api.deleteClient(id).catch(() => {});
    showToast({
      title: 'Client Deleted',
      message: `${clientToDelete.name} was removed.`,
      type: 'warning',
      undoAction: () => {
        setClients(prev => [clientToDelete, ...prev]);
        api.createClient(clientToDelete).catch(() => {});
      },
      undoLabel: 'Restore Client',
    });
  };

  const getClientById = (id: string) => clients.find(c => c.id === id);

  // Project Actions & Recalculating Progress
  const recalculateProjectProgress = (projId: string, currentTasks: Task[]) => {
    const projTasks = currentTasks.filter(t => t.projectId === projId);
    if (projTasks.length === 0) return;
    const doneTasks = projTasks.filter(t => t.status === 'done').length;
    const progress = Math.round((doneTasks / projTasks.length) * 100);
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projId) {
          const newStatus = progress === 100 ? 'completed' : p.status === 'completed' ? 'in-progress' : p.status;
          return { ...p, progress, status: newStatus };
        }
        return p;
      })
    );
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'spent' | 'progress'>) => {
    const newProject: Project = {
      ...projectData,
      id: `prj-${Date.now()}`,
      userId: user?.id || 'usr-1',
      spent: 0,
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects(prev => [newProject, ...prev]);
    api.createProject(newProject).catch(() => {});
    showToast({
      title: 'Project Created',
      message: `Project "${newProject.title}" was launched.`,
      type: 'success',
      undoAction: () => {
        setProjects(prev => prev.filter(p => p.id !== newProject.id));
        api.deleteProject(newProject.id).catch(() => {});
      },
      undoLabel: 'Undo',
    });
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    api.updateProject(id, updates).catch(() => {});
    showToast({
      title: 'Project Saved',
      message: 'Project details have been updated.',
      type: 'success',
    });
  };

  const deleteProject = (id: string) => {
    const projToDelete = projects.find(p => p.id === id);
    if (!projToDelete) return;
    setProjects(prev => prev.filter(p => p.id !== id));
    api.deleteProject(id).catch(() => {});
    showToast({
      title: 'Project Deleted',
      message: `Project "${projToDelete.title}" was deleted.`,
      type: 'warning',
      undoAction: () => {
        setProjects(prev => [projToDelete, ...prev]);
        api.createProject(projToDelete).catch(() => {});
      },
      undoLabel: 'Restore',
    });
  };

  const archiveProject = (id: string) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, status: 'archived' } : p)));
    api.updateProject(id, { status: 'archived' }).catch(() => {});
    showToast({
      title: 'Project Archived',
      message: 'Project has been moved to archive.',
      type: 'info',
      undoAction: () => {
        setProjects(prev => prev.map(p => (p.id === id ? { ...p, status: 'in-progress' } : p)));
        api.updateProject(id, { status: 'in-progress' }).catch(() => {});
      },
      undoLabel: 'Unarchive',
    });
  };

  const restoreProject = (id: string) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, status: 'in-progress' } : p)));
    api.updateProject(id, { status: 'in-progress' }).catch(() => {});
    showToast({
      title: 'Project Restored',
      message: 'Project moved back to active status.',
      type: 'success',
    });
  };

  const getProjectById = (id: string) => projects.find(p => p.id === id);

  // Task Actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'actualHours'>) => {
    const newTask: Task = {
      ...taskData,
      id: `tsk-${Date.now()}`,
      userId: user?.id || 'usr-1',
      actualHours: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    recalculateProjectProgress(newTask.projectId, updatedTasks);
    api.createTask(newTask).catch(() => {});

    showToast({
      title: 'Task Created',
      message: `"${newTask.title}" added to list.`,
      type: 'success',
      undoAction: () => {
        setTasks(prev => prev.filter(t => t.id !== newTask.id));
        api.deleteTask(newTask.id).catch(() => {});
      },
      undoLabel: 'Undo',
    });
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const next = prev.map(t => (t.id === id ? { ...t, ...updates } : t));
      const target = next.find(t => t.id === id);
      if (target) recalculateProjectProgress(target.projectId, next);
      return next;
    });
    api.updateTask(id, updates).catch(() => {});
    showToast({
      title: 'Task Updated',
      message: 'Task changes saved successfully.',
      type: 'success',
    });
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;
    const nextTasks = tasks.filter(t => t.id !== id);
    setTasks(nextTasks);
    recalculateProjectProgress(taskToDelete.projectId, nextTasks);
    api.deleteTask(id).catch(() => {});
    showToast({
      title: 'Task Deleted',
      message: `"${taskToDelete.title}" removed.`,
      type: 'warning',
      undoAction: () => {
        setTasks(prev => [taskToDelete, ...prev]);
        api.createTask(taskToDelete).catch(() => {});
      },
      undoLabel: 'Restore',
    });
  };

  const moveTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks(prev => {
      const targetTask = prev.find(t => t.id === id);
      if (!targetTask) return prev;

      const wasNotDone = targetTask.status !== 'done';
      const isNowDone = newStatus === 'done';

      const next = prev.map(t => (t.id === id ? { ...t, status: newStatus } : t));
      recalculateProjectProgress(targetTask.projectId, next);

      // Trigger Confetti Celebration on task completion!
      if (wasNotDone && isNowDone) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#128C7E', '#25D366', '#34B7F1', '#ECE5DD', '#10B981'],
        });
      }

      return next;
    });
    api.updateTask(id, { status: newStatus }).catch(() => {});
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => {
      const next = prev.map(t => {
        if (t.id === taskId && t.subtasks) {
          const updatedSubtasks = t.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      });
      const target = next.find(t => t.id === taskId);
      if (target) {
        api.updateTask(taskId, { subtasks: target.subtasks }).catch(() => {});
      }
      return next;
    });
  };

  const getTaskById = (id: string) => tasks.find(t => t.id === id);

  // Time Tracker Actions
  const startTimer = (projectId: string, clientId: string, taskId?: string, description?: string) => {
    setActiveTimer({
      isRunning: true,
      projectId,
      clientId,
      taskId: taskId || '',
      description: description || '',
      startTime: Date.now(),
      elapsedSeconds: 0,
    });
    showToast({
      title: 'Timer Started',
      message: 'Time tracking is now live.',
      type: 'info',
    });
  };

  const pauseTimer = () => {
    setActiveTimer(prev => ({ ...prev, isRunning: false }));
    showToast({
      title: 'Timer Paused',
      message: 'Tracking paused. You can resume anytime.',
      type: 'info',
    });
  };

  const resumeTimer = () => {
    setActiveTimer(prev => ({ ...prev, isRunning: true }));
  };

  const stopTimer = () => {
    if (activeTimer.elapsedSeconds > 0) {
      const newEntry: Omit<TimeEntry, 'id'> = {
        userId: user?.id || 'usr-1',
        projectId: activeTimer.projectId,
        clientId: activeTimer.clientId,
        taskId: activeTimer.taskId || undefined,
        description: activeTimer.description || 'Tracked Freelance Session',
        durationSeconds: activeTimer.elapsedSeconds,
        startTime: new Date(activeTimer.startTime || Date.now() - activeTimer.elapsedSeconds * 1000).toISOString(),
        endTime: new Date().toISOString(),
        isBillable: true,
        hourlyRate: user?.hourlyRate || 65,
        isBilled: false,
        date: new Date().toISOString().split('T')[0],
      };
      addTimeEntry(newEntry);
    }
    resetTimer();
  };

  const resetTimer = () => {
    setActiveTimer({
      isRunning: false,
      projectId: '',
      taskId: '',
      clientId: '',
      description: '',
      startTime: 0,
      elapsedSeconds: 0,
    });
  };

  const updateTimerDescription = (description: string) => {
    setActiveTimer(prev => ({ ...prev, description }));
  };

  const addTimeEntry = (entryData: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entryData,
      id: `time-${Date.now()}`,
      userId: user?.id || 'usr-1',
    };
    setTimeEntries(prev => [newEntry, ...prev]);
    api.createTimeEntry(newEntry).catch(() => {});

    // Also update actual hours on task if specified
    if (newEntry.taskId) {
      const addedHours = Number((newEntry.durationSeconds / 3600).toFixed(2));
      setTasks(prev =>
        prev.map(t =>
          t.id === newEntry.taskId
            ? { ...t, actualHours: Number(((t.actualHours || 0) + addedHours).toFixed(2)) }
            : t
        )
      );
    }

    const hrsDisplay = (newEntry.durationSeconds / 3600).toFixed(1);
    showToast({
      title: 'Time Logged',
      message: `${hrsDisplay} hrs recorded successfully.`,
      type: 'success',
      undoAction: () => {
        setTimeEntries(prev => prev.filter(e => e.id !== newEntry.id));
        api.deleteTimeEntry(newEntry.id).catch(() => {});
      },
      undoLabel: 'Undo',
    });
  };

  const deleteTimeEntry = (id: string) => {
    setTimeEntries(prev => prev.filter(e => e.id !== id));
    api.deleteTimeEntry(id).catch(() => {});
    showToast({
      title: 'Time Entry Deleted',
      message: 'Log entry removed.',
      type: 'info',
    });
  };

  // Invoice Actions
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      userId: user?.id || 'usr-1',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInvoices(prev => [newInvoice, ...prev]);
    api.createInvoice(newInvoice).catch(() => {});

    // Update Client's total billed
    setClients(prev =>
      prev.map(c =>
        c.id === newInvoice.clientId
          ? { ...c, totalBilled: (c.totalBilled || 0) + newInvoice.total }
          : c
      )
    );

    showToast({
      title: 'Invoice Created',
      message: `Invoice #${newInvoice.invoiceNumber} created.`,
      type: 'success',
      undoAction: () => {
        setInvoices(prev => prev.filter(i => i.id !== newInvoice.id));
        api.deleteInvoice(newInvoice.id).catch(() => {});
      },
      undoLabel: 'Undo',
    });
    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(i => (i.id === id ? { ...i, ...updates } : i)));
    api.updateInvoice(id, updates).catch(() => {});
    showToast({
      title: 'Invoice Saved',
      message: 'Invoice has been updated.',
      type: 'success',
    });
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
    api.deleteInvoice(id).catch(() => {});
    showToast({
      title: 'Invoice Deleted',
      message: 'Invoice removed.',
      type: 'warning',
    });
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices(prev => prev.map(i => (i.id === id ? { ...i, status } : i)));
    api.updateInvoice(id, { status }).catch(() => {});
    showToast({
      title: 'Status Updated',
      message: `Invoice marked as ${status.toUpperCase()}.`,
      type: 'info',
    });
  };

  // Notification Actions
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    api.markNotificationRead(id).catch(() => {});
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      userId: user?.id || 'usr-1',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    if (notif.priority === 'urgent' || notif.priority === 'high') {
      playAlertChime();
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    api.clearNotifications().catch(() => {});
    showToast({
      title: 'Notifications Cleared',
      message: 'All notifications cleared.',
      type: 'info',
    });
  };

  // Data Reset & Backup
  const resetAllDataToDemo = () => {
    localStorage.clear();
    setUser(null);
    setRegisteredUsers(defaultRegisteredUsers);
    setClients([]);
    setProjects([]);
    setTasks([]);
    setTimeEntries([]);
    setInvoices([]);
    setNotifications([]);
    resetTimer();
    api.resetData().catch(() => {});
    showToast({
      title: 'Demo Data Reset',
      message: 'All application state restored to default demo state.',
      type: 'info',
    });
  };

  const exportDataAsJson = () => {
    const exportObject = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user,
      clients,
      projects,
      tasks,
      timeEntries,
      invoices,
      notifications,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `meplus_freelancer_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast({
      title: 'Backup Downloaded',
      message: 'Your workspace backup has been exported as JSON.',
      type: 'success',
    });
  };

  const importDataFromJson = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.user) setUser(parsed.user);
      if (Array.isArray(parsed.clients)) setClients(parsed.clients);
      if (Array.isArray(parsed.projects)) setProjects(parsed.projects);
      if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
      if (Array.isArray(parsed.timeEntries)) setTimeEntries(parsed.timeEntries);
      if (Array.isArray(parsed.invoices)) setInvoices(parsed.invoices);
      if (Array.isArray(parsed.notifications)) setNotifications(parsed.notifications);

      showToast({
        title: 'Data Restored',
        message: 'Successfully imported backup data.',
        type: 'success',
      });
      return true;
    } catch {
      showToast({
        title: 'Import Failed',
        message: 'Invalid JSON backup format.',
        type: 'error',
      });
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        user,
        isAuthenticated: !!user,
        login,
        register,
        forgotPassword,
        resetPassword,
        loginDemoUser,
        logout,
        updateUserProfile,
        clients,
        addClient,
        updateClient,
        deleteClient,
        getClientById,
        projects,
        addProject,
        updateProject,
        deleteProject,
        archiveProject,
        restoreProject,
        getProjectById,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        toggleSubtask,
        getTaskById,
        activeTimer,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        resetTimer,
        updateTimerDescription,
        timeEntries,
        addTimeEntry,
        deleteTimeEntry,
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        updateInvoiceStatus,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        clearAllNotifications,
        toasts,
        showToast,
        dismissToast,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isAiModalOpen,
        setIsAiModalOpen,
        isClientModalOpen,
        setIsClientModalOpen,
        selectedClientForEdit,
        setSelectedClientForEdit,
        isProjectModalOpen,
        setIsProjectModalOpen,
        selectedProjectForEdit,
        setSelectedProjectForEdit,
        isTaskModalOpen,
        setIsTaskModalOpen,
        selectedTaskForEdit,
        setSelectedTaskForEdit,
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        selectedInvoiceForEdit,
        setSelectedInvoiceForEdit,
        isTimeLogModalOpen,
        setIsTimeLogModalOpen,
        resetAllDataToDemo,
        exportDataAsJson,
        importDataFromJson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
