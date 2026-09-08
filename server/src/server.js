import express from 'express';
import cors from 'cors';
import {
  readDb,
  writeDb,
  getCollection,
  saveCollection,
  resetDbToSeed,
} from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger for API calls
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.url}`);
  }
  next();
});

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Auth Endpoints ---
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  const db = readDb();
  let user = db.user;
  if (!user || user.email !== email) {
    user = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      title: 'Freelance Professional',
      hourlyRate: 65,
      currency: '$',
      bio: 'Independent freelancer managing multiple client projects.',
      notificationSettings: {
        email: true,
        sms: true,
        browser: true,
        sound: true,
        deadlineReminderHours: 24,
      },
    };
    db.user = user;
    writeDb(db);
  }

  res.json({ success: true, user });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, profession } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const db = readDb();
  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    title: profession || 'Independent Freelancer',
    hourlyRate: 65,
    currency: '$',
    bio: `Freelancer specializing in ${profession || 'creative and technical services'}.`,
    notificationSettings: {
      email: true,
      sms: true,
      browser: true,
      sound: true,
      deadlineReminderHours: 24,
    },
  };

  db.user = newUser;
  writeDb(db);
  res.status(201).json({ success: true, user: newUser });
});

app.get('/api/auth/me', (req, res) => {
  const db = readDb();
  res.json({ user: db.user || null });
});

app.put('/api/auth/profile', (req, res) => {
  const updates = req.body;
  const db = readDb();
  db.user = { ...(db.user || {}), ...updates };
  writeDb(db);
  res.json({ success: true, user: db.user });
});

// --- Clients Endpoints ---
app.get('/api/clients', (req, res) => {
  const clients = getCollection('clients');
  res.json(clients);
});

app.post('/api/clients', (req, res) => {
  const newClientData = req.body;
  const clients = getCollection('clients');
  const newClient = {
    ...newClientData,
    id: `cli-${Date.now()}`,
    totalBilled: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };
  clients.unshift(newClient);
  saveCollection('clients', clients);
  res.status(201).json(newClient);
});

app.put('/api/clients/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const clients = getCollection('clients');
  const index = clients.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Client not found' });

  clients[index] = { ...clients[index], ...updates };
  saveCollection('clients', clients);
  res.json(clients[index]);
});

app.delete('/api/clients/:id', (req, res) => {
  const { id } = req.params;
  let clients = getCollection('clients');
  clients = clients.filter(c => c.id !== id);
  saveCollection('clients', clients);
  res.json({ success: true, id });
});

// --- Projects Endpoints ---
app.get('/api/projects', (req, res) => {
  const projects = getCollection('projects');
  res.json(projects);
});

app.post('/api/projects', (req, res) => {
  const newProjectData = req.body;
  const projects = getCollection('projects');
  const newProject = {
    ...newProjectData,
    id: `prj-${Date.now()}`,
    spent: 0,
    progress: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };
  projects.unshift(newProject);
  saveCollection('projects', projects);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const projects = getCollection('projects');
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });

  projects[index] = { ...projects[index], ...updates };
  saveCollection('projects', projects);
  res.json(projects[index]);
});

app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  let projects = getCollection('projects');
  projects = projects.filter(p => p.id !== id);
  saveCollection('projects', projects);
  res.json({ success: true, id });
});

// --- Tasks Endpoints ---
app.get('/api/tasks', (req, res) => {
  const tasks = getCollection('tasks');
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTaskData = req.body;
  const tasks = getCollection('tasks');
  const newTask = {
    ...newTaskData,
    id: `tsk-${Date.now()}`,
    actualHours: 0,
    subtasks: newTaskData.subtasks || [],
    attachments: newTaskData.attachments || [],
    createdAt: new Date().toISOString().split('T')[0],
  };
  tasks.unshift(newTask);
  saveCollection('tasks', tasks);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const tasks = getCollection('tasks');
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  tasks[index] = { ...tasks[index], ...updates };
  saveCollection('tasks', tasks);
  res.json(tasks[index]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  let tasks = getCollection('tasks');
  tasks = tasks.filter(t => t.id !== id);
  saveCollection('tasks', tasks);
  res.json({ success: true, id });
});

// --- Time Entries Endpoints ---
app.get('/api/time-entries', (req, res) => {
  const timeEntries = getCollection('timeEntries');
  res.json(timeEntries);
});

app.post('/api/time-entries', (req, res) => {
  const newEntryData = req.body;
  const timeEntries = getCollection('timeEntries');
  const newEntry = {
    ...newEntryData,
    id: `time-${Date.now()}`,
    date: newEntryData.date || new Date().toISOString().split('T')[0],
  };
  timeEntries.unshift(newEntry);
  saveCollection('timeEntries', timeEntries);
  res.status(201).json(newEntry);
});

app.delete('/api/time-entries/:id', (req, res) => {
  const { id } = req.params;
  let timeEntries = getCollection('timeEntries');
  timeEntries = timeEntries.filter(t => t.id !== id);
  saveCollection('timeEntries', timeEntries);
  res.json({ success: true, id });
});

// --- Invoices Endpoints ---
app.get('/api/invoices', (req, res) => {
  const invoices = getCollection('invoices');
  res.json(invoices);
});

app.post('/api/invoices', (req, res) => {
  const newInvoiceData = req.body;
  const invoices = getCollection('invoices');
  const newInvoice = {
    ...newInvoiceData,
    id: `inv-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
  };
  invoices.unshift(newInvoice);
  saveCollection('invoices', invoices);
  res.status(201).json(newInvoice);
});

app.put('/api/invoices/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const invoices = getCollection('invoices');
  const index = invoices.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Invoice not found' });

  invoices[index] = { ...invoices[index], ...updates };
  saveCollection('invoices', invoices);
  res.json(invoices[index]);
});

app.delete('/api/invoices/:id', (req, res) => {
  const { id } = req.params;
  let invoices = getCollection('invoices');
  invoices = invoices.filter(i => i.id !== id);
  saveCollection('invoices', invoices);
  res.json({ success: true, id });
});

// --- Notifications Endpoints ---
app.get('/api/notifications', (req, res) => {
  const notifs = getCollection('notifications');
  res.json(notifs);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const notifs = getCollection('notifications');
  const item = notifs.find(n => n.id === id);
  if (item) item.read = true;
  saveCollection('notifications', notifs);
  res.json({ success: true });
});

app.delete('/api/notifications', (req, res) => {
  saveCollection('notifications', []);
  res.json({ success: true });
});

// --- AI Chat Endpoint ---
app.post('/api/ai/chat', (req, res) => {
  const { message } = req.body;
  const query = (message || '').toLowerCase();

  let reply = "Here is my advice based on your current active workspace:";

  if (query.includes('price') || query.includes('rate') || query.includes('how much') || query.includes('quote')) {
    reply = "💡 **Pricing & Rate Strategy**:\n• Consider value-based pricing rather than strict hourly billing for milestones with high client impact.\n• For new projects, provide 3 tiered packages (Basic, Recommended, Premium) to anchor client expectations and maximize budget.";
  } else if (query.includes('email') || query.includes('follow up') || query.includes('invoice') || query.includes('overdue')) {
    reply = "📧 **Polite Payment Follow-up Draft**:\n\n*Hi [Client Name],*\n*Hope you're having a productive week! Just following up on invoice #[Number] sent on [Date]. Please let me know if you need any additional invoice copies or wire details.*";
  } else if (query.includes('scope') || query.includes('extra') || query.includes('change')) {
    reply = "🛡️ **Handling Scope Creep**:\n• Acknowledge the request positively: *'I love this idea and it will definitely improve the project!'*\n• Present clear timeline & budget addendum: *'Since this is beyond our initial milestone scope, this addition will require approx 5 hours ($350) and 2 days extension.'*";
  } else if (query.includes('summary') || query.includes('status') || query.includes('overview') || query.includes('work')) {
    const db = readDb();
    const projects = db.projects || [];
    const tasks = db.tasks || [];
    const pending = tasks.filter(t => t.status !== 'done').length;
    reply = `📊 **Workspace Status Summary**:\n• You currently have **${projects.length} active projects**.\n• **${pending} tasks** are in your pipeline.\n• Your delivery velocity is healthy! Focus on urgent milestone deadlines first.`;
  } else {
    reply = `🤖 **Me Plus AI Advisor**:\nI am here to help you manage clients, draft professional communications, negotiate milestone changes, and organize tasks. How can I assist you with your project today?`;
  }

  res.json({ reply });
});

// --- Reset Data Endpoint ---
app.post('/api/reset', (req, res) => {
  const data = resetDbToSeed();
  res.json({ success: true, data });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Me Plus Backend REST API running at http://localhost:${PORT}`);
});
