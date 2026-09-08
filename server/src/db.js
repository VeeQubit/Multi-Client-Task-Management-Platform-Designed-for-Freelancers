import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initial seed data with userId isolation
export const initialSeed = {
  users: [
    {
      id: 'usr-1',
      name: 'Alex Rivera',
      email: 'alex.rivera@gmail.com',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      title: 'Senior Graphic & UI Designer',
      hourlyRate: 65,
      currency: '$',
      bio: 'Specialized in building modern web interfaces, digital branding, and UI systems.',
      notificationSettings: {
        email: true,
        sms: true,
        browser: true,
        sound: true,
        deadlineReminderHours: 24,
      },
    },
    {
      id: 'usr-demo',
      name: 'Alex Rivera',
      email: 'demo@meplus.io',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      title: 'Senior Graphic & UI Designer',
      hourlyRate: 65,
      currency: '$',
      bio: 'Specialized in building modern web interfaces, digital branding, and UI systems.',
      notificationSettings: {
        email: true,
        sms: true,
        browser: true,
        sound: true,
        deadlineReminderHours: 24,
      },
    },
  ],
  user: null,
  clients: [
    {
      id: 'cli-1',
      userId: 'usr-1',
      name: 'Sarah Jenkins',
      company: 'Sarah Jenkins',
      email: 'sarah.j@gmail.com',
      phone: '+1 (555) 234-5678',
      color: '#128C7E',
      status: 'active',
      hourlyRate: 75,
      currency: '$',
      totalBilled: 14200,
      notes: 'Key client for branding websites and landing pages.',
      createdAt: '2026-01-10',
    },
    {
      id: 'cli-2',
      userId: 'usr-1',
      name: 'Marcus Vance',
      company: 'Marcus Vance',
      email: 'mvance@gmail.com',
      phone: '+1 (555) 876-5432',
      color: '#059669',
      status: 'active',
      hourlyRate: 90,
      currency: '$',
      totalBilled: 28500,
      notes: 'Working on mobile design system and dashboard views.',
      createdAt: '2026-02-01',
    },
    {
      id: 'cli-3',
      userId: 'usr-1',
      name: 'Elena Rostova',
      company: 'Elena Rostova',
      email: 'elena@gmail.com',
      phone: '+44 20 7946 0912',
      color: '#0d9488',
      status: 'active',
      hourlyRate: 60,
      currency: '$',
      totalBilled: 9800,
      notes: 'Building interactive student quiz modules and responsive frontend.',
      createdAt: '2026-03-15',
    },
  ],
  projects: [
    {
      id: 'prj-1',
      userId: 'usr-1',
      clientId: 'cli-1',
      title: 'Nova Design System & E-Commerce Landing',
      description: 'End-to-end design system, component library, and high-converting marketing landing pages.',
      status: 'in-progress',
      priority: 'high',
      budget: 6500,
      spent: 4200,
      startDate: '2026-08-15',
      deadline: '2026-09-15',
      progress: 68,
      tags: ['Design System', 'UI/UX'],
      createdAt: '2026-08-15',
    },
    {
      id: 'prj-2',
      userId: 'usr-1',
      clientId: 'cli-2',
      title: 'Pulse Financial Analytics Dashboard',
      description: 'Real-time crypto and fiat portfolio analytics with dark mode and CSV exports.',
      status: 'in-progress',
      priority: 'urgent',
      budget: 9000,
      spent: 7200,
      startDate: '2026-08-01',
      deadline: '2026-09-08',
      progress: 82,
      tags: ['Dashboard', 'FinTech'],
      createdAt: '2026-08-01',
    },
    {
      id: 'prj-3',
      userId: 'usr-1',
      clientId: 'cli-3',
      title: 'EduVerse Interactive Student Portal',
      description: 'Gamified learning modules with responsive quiz interface and performance reports.',
      status: 'planning',
      priority: 'medium',
      budget: 4000,
      spent: 800,
      startDate: '2026-08-25',
      deadline: '2026-09-30',
      progress: 25,
      tags: ['EdTech', 'Responsive UI'],
      createdAt: '2026-08-25',
    },
  ],
  tasks: [
    {
      id: 'tsk-1',
      userId: 'usr-1',
      projectId: 'prj-2',
      clientId: 'cli-2',
      title: 'Finalize Dark Theme Contrast & Color Tokens',
      description: 'Ensure all financial charts and badges satisfy WCAG 2.1 AA accessibility ratios.',
      status: 'todo',
      priority: 'urgent',
      dueDate: '2026-09-08',
      estimatedHours: 4,
      actualHours: 0,
      subtasks: [
        { id: 'sub-1', title: 'Audit color tokens against contrast grid', completed: true },
        { id: 'sub-2', title: 'Update Tailwind theme configuration', completed: false },
        { id: 'sub-3', title: 'Test chart readability with color-blind simulators', completed: false },
      ],
      tags: ['Accessibility', 'UI Design'],
      attachments: [],
      createdAt: '2026-08-28',
    },
    {
      id: 'tsk-2',
      userId: 'usr-1',
      projectId: 'prj-1',
      clientId: 'cli-1',
      title: 'Build Interactive Checkout Form & Validation',
      description: 'Multi-step checkout with instant inline validation and error recovery.',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-09-10',
      estimatedHours: 6,
      actualHours: 3.5,
      subtasks: [
        { id: 'sub-4', title: 'Create wireframe step indicator', completed: true },
        { id: 'sub-5', title: 'Implement credit card input formatting', completed: true },
        { id: 'sub-6', title: 'Write comprehensive field validators', completed: false },
      ],
      tags: ['Form Design', 'Validation'],
      attachments: [],
      createdAt: '2026-08-29',
    },
    {
      id: 'tsk-3',
      userId: 'usr-1',
      projectId: 'prj-1',
      clientId: 'cli-1',
      title: 'Design Hero Illustration & Icon Set',
      description: 'Vector SVG asset collection for landing page hero and value propositions.',
      status: 'review',
      priority: 'medium',
      dueDate: '2026-09-12',
      estimatedHours: 5,
      actualHours: 5,
      subtasks: [
        { id: 'sub-7', title: 'Draft 3 illustration concepts in Figma', completed: true },
        { id: 'sub-8', title: 'Export SVGs optimized with SVGO', completed: true },
      ],
      tags: ['Illustrations', 'Assets'],
      attachments: [],
      createdAt: '2026-08-30',
    },
    {
      id: 'tsk-4',
      userId: 'usr-1',
      projectId: 'prj-3',
      clientId: 'cli-3',
      title: 'Interactive Quiz Component Prototype',
      description: 'Create engaging multiple choice and drag-and-drop question types with audio feedback.',
      status: 'done',
      priority: 'medium',
      dueDate: '2026-09-05',
      estimatedHours: 8,
      actualHours: 7.5,
      subtasks: [
        { id: 'sub-9', title: 'Wireframe student quiz view', completed: true },
        { id: 'sub-10', title: 'Implement drag-and-drop ranking question', completed: true },
        { id: 'sub-11', title: 'Add progress bar and instant score calculation', completed: true },
      ],
      tags: ['Prototype', 'Component'],
      attachments: [],
      createdAt: '2026-08-25',
      completedAt: '2026-09-05',
    },
  ],
  timeEntries: [
    {
      id: 'time-1',
      userId: 'usr-1',
      projectId: 'prj-2',
      clientId: 'cli-2',
      date: '2026-09-02',
      durationSeconds: 9000, // 2.5 hrs
      hourlyRate: 90,
      description: 'Live testing dark mode contrast on financial chart widgets',
      isBillable: true,
      isBilled: false,
    },
    {
      id: 'time-2',
      userId: 'usr-1',
      projectId: 'prj-1',
      clientId: 'cli-1',
      date: '2026-09-01',
      durationSeconds: 12600, // 3.5 hrs
      hourlyRate: 75,
      description: 'Designing interactive checkout validation flow',
      isBillable: true,
      isBilled: false,
    },
    {
      id: 'time-3',
      userId: 'usr-1',
      projectId: 'prj-3',
      clientId: 'cli-3',
      date: '2026-08-31',
      durationSeconds: 3600, // 1 hr
      hourlyRate: 60,
      description: 'Sprint planning and milestone alignment call',
      isBillable: true,
      isBilled: true,
    },
  ],
  invoices: [
    {
      id: 'inv-101',
      userId: 'usr-1',
      invoiceNumber: 'INV-2026-001',
      clientId: 'cli-1',
      projectId: 'prj-1',
      issueDate: '2026-08-15',
      dueDate: '2026-08-30',
      status: 'paid',
      items: [
        { id: 'itm-1', description: 'Design System Architecture & Tokens', quantity: 20, rate: 75, amount: 1500 },
        { id: 'itm-2', description: 'Responsive Marketing Page Templates', quantity: 30, rate: 75, amount: 2250 },
      ],
      subtotal: 3750,
      taxRate: 5,
      taxAmount: 187.5,
      discount: 0,
      total: 3937.5,
      currency: '$',
      notes: 'Thank you for your business! Payment received via Stripe transfer.',
      clientName: 'Sarah Jenkins',
      clientCompany: 'Sarah Jenkins',
      clientEmail: 'sarah.j@gmail.com',
      createdAt: '2026-08-15',
    },
    {
      id: 'inv-102',
      userId: 'usr-1',
      invoiceNumber: 'INV-2026-002',
      clientId: 'cli-2',
      projectId: 'prj-2',
      issueDate: '2026-09-01',
      dueDate: '2026-09-15',
      status: 'sent',
      items: [
        { id: 'itm-3', description: 'Crypto Portfolio Charts & Telemetry', quantity: 40, rate: 90, amount: 3600 },
        { id: 'itm-4', description: 'Security & Key Encryption UI Flow', quantity: 20, rate: 90, amount: 1800 },
      ],
      subtotal: 5400,
      taxRate: 0,
      taxAmount: 0,
      discount: 0,
      total: 5400,
      currency: '$',
      notes: 'Net 14 payment terms. Please wire to registered bank coordinates.',
      clientName: 'Marcus Vance',
      clientCompany: 'Marcus Vance',
      clientEmail: 'mvance@gmail.com',
      createdAt: '2026-09-01',
    },
  ],
  notifications: [
    {
      id: 'notif-1',
      userId: 'usr-1',
      title: 'Urgent Task Deadline Approaching',
      message: '"Finalize Dark Theme Contrast" is due today!',
      type: 'deadline',
      priority: 'urgent',
      timestamp: '10 minutes ago',
      read: false,
      relatedId: 'tsk-1',
      relatedType: 'task',
    },
    {
      id: 'notif-2',
      userId: 'usr-1',
      title: 'Invoice Payment Received',
      message: 'Sarah Jenkins paid INV-2026-001 ($3,937.50)',
      type: 'invoice',
      priority: 'high',
      timestamp: '2 hours ago',
      read: false,
      relatedId: 'inv-101',
      relatedType: 'invoice',
    },
  ],
};

// Demo Identification Sets
const DEMO_PROJECT_TITLES = new Set([
  'nova design system & e-commerce landing',
  'fintech pulse analytics & crypto dashboard',
  'pulse financial analytics dashboard',
  'eduverse interactive lms gamification',
  'eduverse interactive student portal',
  'apex iot telemetry real-time portal',
  'nova studio brand identity guidelines pdf',
]);

const DEMO_CLIENT_NAMES = new Set([
  'sarah jenkins',
  'marcus vance',
  'elena rostova',
  'david kim',
  'clara oswald',
  'nova brand studio',
  'fintech pulse corp',
  'eduverse learning',
  'apex robotics & iot',
  'biohealth solutions',
  'nova studio',
  'fintech pulse',
]);

const DEMO_CLIENT_EMAILS = new Set([
  'sarah.j@novastudio.design',
  'sarah.j@gmail.com',
  'mvance@fintechpulse.io',
  'mvance@gmail.com',
  'elena@eduverse.org',
  'elena@gmail.com',
  'david.kim@apexrobotics.io',
  'clara.o@biohealth.co',
]);

const DEMO_INVOICE_NUMBERS = new Set([
  'inv-2026-001',
  'inv-2026-002',
  'inv-2026-003',
  'inv-2026-004',
  'inv-2026-005',
  'inv-2026-006',
]);

const DEMO_IDS = new Set([
  'cli-1', 'cli-2', 'cli-3', 'cli-4', 'cli-5',
  'prj-1', 'prj-2', 'prj-3', 'prj-4', 'prj-5',
  'tsk-1', 'tsk-2', 'tsk-3', 'tsk-4', 'tsk-5', 'tsk-6', 'tsk-7', 'tsk-8',
  'inv-101', 'inv-102', 'inv-103', 'inv-1', 'inv-2', 'inv-3',
  'time-1', 'time-2', 'time-3', 'time-4',
  'notif-1', 'notif-2', 'notif-3', 'notif-4',
]);

export function isDemoSeedEntity(item) {
  if (!item) return false;
  if (item.userId === 'usr-1' || item.userId === 'usr-demo') return true;

  if (typeof item.id === 'string') {
    const idLower = item.id.toLowerCase();
    if (DEMO_IDS.has(idLower)) return true;
    if (idLower.startsWith('cli-') && idLower.length <= 6) return true;
    if (idLower.startsWith('prj-') && idLower.length <= 6) return true;
    if (idLower.startsWith('tsk-') && !idLower.includes('tsk-1788') && idLower.length <= 8) return true;
    if (idLower.startsWith('inv-') && (idLower.length <= 8 || idLower.startsWith('inv-10'))) return true;
    if (idLower.startsWith('time-') && (idLower.length <= 8 || idLower.startsWith('time-10'))) return true;
    if (idLower.startsWith('notif-') && idLower.length <= 8) return true;
  }

  if (item.invoiceNumber && DEMO_INVOICE_NUMBERS.has(item.invoiceNumber.trim().toLowerCase())) return true;

  if (item.clientName && DEMO_CLIENT_NAMES.has(item.clientName.trim().toLowerCase())) return true;
  if (item.clientCompany && DEMO_CLIENT_NAMES.has(item.clientCompany.trim().toLowerCase())) return true;
  if (item.clientEmail && DEMO_CLIENT_EMAILS.has(item.clientEmail.trim().toLowerCase())) return true;

  if (item.name && DEMO_CLIENT_NAMES.has(item.name.trim().toLowerCase())) return true;
  if (item.company && DEMO_CLIENT_NAMES.has(item.company.trim().toLowerCase())) return true;
  if (item.email && DEMO_CLIENT_EMAILS.has(item.email.trim().toLowerCase())) return true;

  if (item.clientId && ['cli-1', 'cli-2', 'cli-3', 'cli-4', 'cli-5'].includes(item.clientId)) return true;
  if (item.projectId && ['prj-1', 'prj-2', 'prj-3', 'prj-4', 'prj-5'].includes(item.projectId)) return true;

  if (item.title) {
    const t = item.title.trim().toLowerCase();
    if (DEMO_PROJECT_TITLES.has(t)) return true;
    if (
      t.includes('nova design system') ||
      t.includes('pulse financial') ||
      t.includes('fintech pulse') ||
      t.includes('eduverse interactive') ||
      t.includes('apex iot telemetry') ||
      t.includes('nova studio brand') ||
      t.includes('websocket reconnect') ||
      t.includes('refactor checkout cart') ||
      t.includes('mobile navigation drawer') ||
      t.includes('audit high-contrast theme') ||
      t.includes('quiz component') ||
      t.includes('interactive quiz') ||
      t.includes('iot telemetry dashboard') ||
      t.includes('svg icon sprite') ||
      t.includes('two-factor auth') ||
      t.includes('dark theme contrast') ||
      t.includes('interactive checkout form') ||
      t.includes('hero illustration')
    ) {
      return true;
    }
  }

  if (item.description) {
    const d = item.description.trim().toLowerCase();
    if (
      d.includes('websocket reconnect') ||
      d.includes('promo code dynamic discount') ||
      d.includes('mobile gesture swipe drawer') ||
      d.includes('gamified student badge') ||
      d.includes('dark mode contrast on financial') ||
      d.includes('interactive checkout validation') ||
      d.includes('sprint planning and milestone alignment')
    ) {
      return true;
    }
  }

  return false;
}

// Deterministic user ID generator based on email
export const getDeterministicUserId = (email) => {
  const norm = (email || '').trim().toLowerCase();
  if (!norm) return 'usr-1';
  if (norm === 'demo@meplus.io' || norm === 'usr-demo') return 'usr-demo';
  if (norm === 'alex.rivera@gmail.com' || norm === 'usr-1') return 'usr-1';
  return `usr_${norm.replace(/[^a-z0-9]/g, '_')}`;
};

// Initialize DB file if not exists
export const initDb = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
  }
};

// Read whole DB
export const readDb = () => {
  initDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.users) {
      parsed.users = initialSeed.users;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading db.json, returning seed:', error);
    return initialSeed;
  }
};

// Write whole DB
export const writeDb = (data) => {
  initDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

// Collection helpers
export const getCollection = (collectionName, userId) => {
  const db = readDb();
  const items = db[collectionName] || [];
  if (!userId) return items;
  // If demo account (usr-1 or usr-demo), allow access to demo seed items
  const isDemo = userId === 'usr-1' || userId === 'usr-demo';
  if (isDemo) {
    return items.filter(item => item.userId === 'usr-1' || item.userId === 'usr-demo' || !item.userId);
  }
  // Real registered users strictly receive only their own non-demo items
  return items.filter(item => item.userId === userId && !isDemoSeedEntity(item));
};

export const saveCollection = (collectionName, items) => {
  const db = readDb();
  db[collectionName] = items;
  writeDb(db);
  return items;
};

export const resetDbToSeed = () => {
  writeDb(initialSeed);
  return initialSeed;
};

