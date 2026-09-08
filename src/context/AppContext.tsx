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
  PriorityLevel,
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
  login: (email: string) => boolean;
  register: (name: string, email: string, title?: string) => boolean;
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
  CLIENTS: 'meplus_clients_v1',
  PROJECTS: 'meplus_projects_v1',
  TASKS: 'meplus_tasks_v1',
  TIME_ENTRIES: 'meplus_time_entries_v1',
  INVOICES: 'meplus_invoices_v1',
  NOTIFICATIONS: 'meplus_notifications_v1',
  ACTIVE_TIMER: 'meplus_active_timer_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // User & Auth State
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : null;
  });

  // Data Collections
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
    return saved ? JSON.parse(saved) : initialTimeEntries;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Active Stopwatch Timer
  const [activeTimer, setActiveTimer] = useState<ActiveTimer>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TIMER);
    return saved
      ? JSON.parse(saved)
      : {
          isRunning: false,
          projectId: '',
          taskId: '',
          clientId: '',
          description: '',
          startTime: 0,
          elapsedSeconds: 0,
        };
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

  // Sync state changes to localStorage
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.USER);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(timeEntries));
  }, [timeEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

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

  // User Actions
  const login = (email: string) => {
    setUser({
      ...initialUser,
      email,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    });
    showToast({
      title: 'Welcome back!',
      message: `Signed in as ${email}`,
      type: 'success',
    });
    return true;
  };

  const register = (name: string, email: string, title?: string) => {
    setUser({
      ...initialUser,
      name,
      email,
      title: title || 'Independent Professional & Freelancer',
    });
    showToast({
      title: 'Account Created!',
      message: `Welcome to Me Plus, ${name}!`,
      type: 'success',
    });
    return true;
  };

  const loginDemoUser = () => {
    setUser(initialUser);
    showToast({
      title: 'Demo Mode Activated',
      message: 'Logged in as Alex Rivera with sample projects & clients.',
      type: 'info',
    });
  };

  const logout = () => {
    setUser(null);
    showToast({
      title: 'Logged Out',
      message: 'You have safely signed out of Me Plus.',
      type: 'info',
    });
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser(prev => (prev ? { ...prev, ...profile } : null));
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
      createdAt: new Date().toISOString().split('T')[0],
      totalBilled: 0,
    };
    setClients(prev => [newClient, ...prev]);
    showToast({
      title: 'Client Added',
      message: `${newClient.name} (${newClient.company}) has been added.`,
      type: 'success',
      undoAction: () => {
        setClients(prev => prev.filter(c => c.id !== newClient.id));
      },
      undoLabel: 'Undo',
    });
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
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
    showToast({
      title: 'Client Deleted',
      message: `${clientToDelete.name} was removed.`,
      type: 'warning',
      undoAction: () => {
        setClients(prev => [clientToDelete, ...prev]);
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
      spent: 0,
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects(prev => [newProject, ...prev]);
    showToast({
      title: 'Project Created',
      message: `Project "${newProject.title}" was launched.`,
      type: 'success',
      undoAction: () => {
        setProjects(prev => prev.filter(p => p.id !== newProject.id));
      },
      undoLabel: 'Undo',
    });
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
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
    showToast({
      title: 'Project Deleted',
      message: `Project "${projToDelete.title}" was deleted.`,
      type: 'warning',
      undoAction: () => {
        setProjects(prev => [projToDelete, ...prev]);
      },
      undoLabel: 'Restore',
    });
  };

  const archiveProject = (id: string) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, status: 'archived' } : p)));
    showToast({
      title: 'Project Archived',
      message: 'Project has been moved to archive.',
      type: 'info',
      undoAction: () => {
        setProjects(prev => prev.map(p => (p.id === id ? { ...p, status: 'in-progress' } : p)));
      },
      undoLabel: 'Unarchive',
    });
  };

  const restoreProject = (id: string) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, status: 'in-progress' } : p)));
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
      actualHours: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    recalculateProjectProgress(newTask.projectId, updatedTasks);

    showToast({
      title: 'Task Created',
      message: `"${newTask.title}" added to list.`,
      type: 'success',
      undoAction: () => {
        setTasks(prev => prev.filter(t => t.id !== newTask.id));
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

    showToast({
      title: 'Task Removed',
      message: `"${taskToDelete.title}" deleted.`,
      type: 'warning',
      undoAction: () => {
        setTasks(prev => [taskToDelete, ...prev]);
        recalculateProjectProgress(taskToDelete.projectId, [...nextTasks, taskToDelete]);
      },
      undoLabel: 'Undo Delete',
    });
  };

  const moveTaskStatus = (id: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const oldStatus = task.status;
    if (oldStatus === newStatus) return;

    if (newStatus === 'done') {
      // Trigger informative feedback (celebration confetti!)
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
      });
    }

    const updatedTasks = tasks.map(t =>
      t.id === id
        ? {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'done' ? new Date().toISOString().split('T')[0] : undefined,
          }
        : t
    );
    setTasks(updatedTasks);
    recalculateProjectProgress(task.projectId, updatedTasks);

    showToast({
      title: `Task Moved to ${newStatus.replace('-', ' ').toUpperCase()}`,
      message: `"${task.title}" updated.`,
      type: newStatus === 'done' ? 'success' : 'info',
      undoAction: () => {
        const revertedTasks = tasks.map(t => (t.id === id ? { ...t, status: oldStatus } : t));
        setTasks(revertedTasks);
        recalculateProjectProgress(task.projectId, revertedTasks);
      },
      undoLabel: 'Undo Move',
    });
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextSubtasks = t.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: nextSubtasks };
        }
        return t;
      })
    );
  };

  const getTaskById = (id: string) => tasks.find(t => t.id === id);

  // Time Tracker Actions
  const startTimer = (projectId: string, clientId: string, taskId?: string, description?: string) => {
    setActiveTimer({
      isRunning: true,
      projectId,
      clientId,
      taskId: taskId || '',
      description: description || 'Working on client deliverables',
      startTime: Date.now(),
      elapsedSeconds: 0,
    });
    showToast({
      title: 'Timer Started',
      message: 'Tracking billable project time live in the navbar.',
      type: 'info',
    });
  };

  const pauseTimer = () => {
    setActiveTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resumeTimer = () => {
    setActiveTimer(prev => ({ ...prev, isRunning: true }));
  };

  const updateTimerDescription = (desc: string) => {
    setActiveTimer(prev => ({ ...prev, description: desc }));
  };

  const stopTimer = () => {
    if (activeTimer.elapsedSeconds < 10) {
      // Ignore very short timer accidental clicks
      resetTimer();
      return;
    }

    const client = clients.find(c => c.id === activeTimer.clientId);
    const hourlyRate = client?.hourlyRate || user?.hourlyRate || 65;

    const newEntry: TimeEntry = {
      id: `time-${Date.now()}`,
      projectId: activeTimer.projectId,
      taskId: activeTimer.taskId || undefined,
      clientId: activeTimer.clientId,
      description: activeTimer.description || 'General Freelance Task',
      durationSeconds: activeTimer.elapsedSeconds,
      startTime: new Date(Date.now() - activeTimer.elapsedSeconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
      isBillable: true,
      hourlyRate,
      isBilled: false,
      date: new Date().toISOString().split('T')[0],
    };

    setTimeEntries(prev => [newEntry, ...prev]);

    // Update project spent
    const earned = Math.round((activeTimer.elapsedSeconds / 3600) * hourlyRate);
    setProjects(prev =>
      prev.map(p => (p.id === activeTimer.projectId ? { ...p, spent: p.spent + earned } : p))
    );

    // Update task actual hours if attached
    if (activeTimer.taskId) {
      const addedHours = Number((activeTimer.elapsedSeconds / 3600).toFixed(2));
      setTasks(prev =>
        prev.map(t =>
          t.id === activeTimer.taskId ? { ...t, actualHours: t.actualHours + addedHours } : t
        )
      );
    }

    resetTimer();

    showToast({
      title: 'Time Logged Successfully',
      message: `${Math.round(newEntry.durationSeconds / 60)} minutes logged to client (${client?.company || 'Client'}).`,
      type: 'success',
    });
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

  const addTimeEntry = (entryData: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entryData,
      id: `time-${Date.now()}`,
    };
    setTimeEntries(prev => [newEntry, ...prev]);

    // Update project budget spent
    const earned = Math.round((newEntry.durationSeconds / 3600) * newEntry.hourlyRate);
    setProjects(prev =>
      prev.map(p => (p.id === newEntry.projectId ? { ...p, spent: p.spent + earned } : p))
    );

    showToast({
      title: 'Manual Time Log Saved',
      message: `${(newEntry.durationSeconds / 3600).toFixed(1)} hrs added to time logs.`,
      type: 'success',
    });
  };

  const deleteTimeEntry = (id: string) => {
    const entry = timeEntries.find(e => e.id === id);
    if (!entry) return;
    setTimeEntries(prev => prev.filter(e => e.id !== id));
    showToast({
      title: 'Time Log Removed',
      message: 'Time entry was removed from records.',
      type: 'info',
    });
  };

  // Invoice Actions
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInvoices(prev => [newInvoice, ...prev]);

    // If paid, add to client total billed
    if (newInvoice.status === 'paid') {
      setClients(prev =>
        prev.map(c =>
          c.id === newInvoice.clientId ? { ...c, totalBilled: c.totalBilled + newInvoice.total } : c
        )
      );
    }

    showToast({
      title: 'Invoice Created',
      message: `Invoice ${newInvoice.invoiceNumber} for $${newInvoice.total.toLocaleString()} is ready.`,
      type: 'success',
    });
    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => (inv.id === id ? { ...inv, ...updates } : inv)));
    showToast({
      title: 'Invoice Updated',
      message: 'Invoice details saved.',
      type: 'success',
    });
  };

  const deleteInvoice = (id: string) => {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;
    setInvoices(prev => prev.filter(i => i.id !== id));
    showToast({
      title: 'Invoice Deleted',
      message: `${inv.invoiceNumber} was removed.`,
      type: 'warning',
      undoAction: () => setInvoices(prev => [inv, ...prev]),
      undoLabel: 'Restore',
    });
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;
    const oldStatus = inv.status;
    setInvoices(prev => prev.map(i => (i.id === id ? { ...i, status } : i)));

    if (status === 'paid' && oldStatus !== 'paid') {
      setClients(prev =>
        prev.map(c => (c.id === inv.clientId ? { ...c, totalBilled: c.totalBilled + inv.total } : c))
      );
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    showToast({
      title: `Invoice Marked as ${status.toUpperCase()}`,
      message: `Status updated for ${inv.invoiceNumber}.`,
      type: status === 'paid' ? 'success' : 'info',
    });
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast({
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.',
      type: 'info',
    });
  };

  const addNotification = (notifData: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notifData,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    if (newNotif.priority === 'urgent' || newNotif.priority === 'high') {
      playAlertChime();
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Data Reset & Backup/Restore
  const resetAllDataToDemo = () => {
    setUser(initialUser);
    setClients(initialClients);
    setProjects(initialProjects);
    setTasks(initialTasks);
    setTimeEntries(initialTimeEntries);
    setInvoices(initialInvoices);
    setNotifications(initialNotifications);
    resetTimer();

    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.CLIENTS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.TIME_ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TIMER);

    showToast({
      title: 'Reset to Demo Data',
      message: 'All data has been restored to the initial EC 9540 showcase dataset.',
      type: 'info',
    });
  };

  const exportDataAsJson = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user,
      clients,
      projects,
      tasks,
      timeEntries,
      invoices,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `MePlus_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast({
      title: 'Backup Exported',
      message: 'Your Me Plus workspace was downloaded as a JSON file.',
      type: 'success',
    });
  };

  const importDataFromJson = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.clients) setClients(parsed.clients);
      if (parsed.projects) setProjects(parsed.projects);
      if (parsed.tasks) setTasks(parsed.tasks);
      if (parsed.timeEntries) setTimeEntries(parsed.timeEntries);
      if (parsed.invoices) setInvoices(parsed.invoices);
      if (parsed.user) setUser(parsed.user);

      showToast({
        title: 'Workspace Restored',
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
