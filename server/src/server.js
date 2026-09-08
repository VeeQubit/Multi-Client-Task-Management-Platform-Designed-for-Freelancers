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

// Helper to get active userId from request
function getReqUserId(req) {
  return req.query.userId || req.headers['x-user-id'] || req.body?.userId;
}

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Auth Endpoints ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  const db = readDb();
  const users = db.users || [];
  const normalizedEmail = email.trim().toLowerCase();

  // Find user by email
  const existingUser = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!existingUser) {
    return res.status(401).json({
      error: 'Invalid credentials: No account is registered with this email. Please create an account first.',
    });
  }

  // If password provided, verify password
  if (password && existingUser.password && existingUser.password !== password) {
    return res.status(401).json({
      error: 'Invalid credentials: The password you entered is incorrect. Please check and try again.',
    });
  }

  // Remove password before sending to client
  const { password: _, ...safeUser } = existingUser;
  db.user = safeUser;
  writeDb(db);

  res.json({ success: true, user: safeUser });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, profession } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Full name is required' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const db = readDb();
  const users = db.users || [];
  const normalizedEmail = email.trim().toLowerCase();

  // Check duplicate email
  const alreadyExists = users.some(u => u.email.toLowerCase() === normalizedEmail);
  if (alreadyExists) {
    return res.status(409).json({
      error: 'An account with this email address already exists. Please sign in instead.',
    });
  }

  const newUserId = `usr-${Date.now()}`;
  const newUser = {
    id: newUserId,
    name: name.trim(),
    email: normalizedEmail,
    password,
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

  users.push(newUser);
  db.users = users;

  // Add a welcoming notification for this new user in their fresh workspace
  const notifications = db.notifications || [];
  notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: newUserId,
    title: 'Welcome to Me Plus!',
    message: `Hello ${newUser.name}, your workspace is ready. Click "+ New Client" to start managing projects.`,
    type: 'system',
    priority: 'medium',
    timestamp: 'Just now',
    read: false,
  });
  db.notifications = notifications;

  const { password: _, ...safeUser } = newUser;
  db.user = safeUser;
  writeDb(db);

  res.status(201).json({ success: true, user: safeUser });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  const db = readDb();
  const users = db.users || [];
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return res.status(404).json({
      error: 'No registered account found with this email address. Please verify your email.',
    });
  }

  res.json({
    success: true,
    message: 'Account verified! You may now set your new password.',
    email: normalizedEmail,
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  const db = readDb();
  const users = db.users || [];
  const normalizedEmail = email.trim().toLowerCase();
  const index = users.findIndex(u => u.email.toLowerCase() === normalizedEmail);

  if (index === -1) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  users[index].password = newPassword;
  db.users = users;
  writeDb(db);

  res.json({
    success: true,
    message: 'Your password has been successfully updated! You can now sign in.',
  });
});

app.get('/api/auth/me', (req, res) => {
  const db = readDb();
  res.json({ user: db.user || null });
});

app.put('/api/auth/profile', (req, res) => {
  const updates = req.body;
  const db = readDb();
  db.user = { ...(db.user || {}), ...updates };
  // Update in users array as well
  if (db.users && db.user) {
    const idx = db.users.findIndex(u => u.id === db.user.id);
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...updates };
    }
  }
  writeDb(db);
  res.json({ success: true, user: db.user });
});

// --- Clients Endpoints ---
app.get('/api/clients', (req, res) => {
  const userId = getReqUserId(req);
  const clients = getCollection('clients', userId);
  res.json(clients);
});

app.post('/api/clients', (req, res) => {
  const newClientData = req.body;
  const userId = getReqUserId(req) || 'usr-1';
  const clients = getCollection('clients');
  const newClient = {
    ...newClientData,
    id: `cli-${Date.now()}`,
    userId: newClientData.userId || userId,
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
  const userId = getReqUserId(req);
  const projects = getCollection('projects', userId);
  res.json(projects);
});

app.post('/api/projects', (req, res) => {
  const newProjectData = req.body;
  const userId = getReqUserId(req) || 'usr-1';
  const projects = getCollection('projects');
  const newProject = {
    ...newProjectData,
    id: `prj-${Date.now()}`,
    userId: newProjectData.userId || userId,
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
  const userId = getReqUserId(req);
  const tasks = getCollection('tasks', userId);
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTaskData = req.body;
  const userId = getReqUserId(req) || 'usr-1';
  const tasks = getCollection('tasks');
  const newTask = {
    ...newTaskData,
    id: `tsk-${Date.now()}`,
    userId: newTaskData.userId || userId,
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
  const userId = getReqUserId(req);
  const timeEntries = getCollection('timeEntries', userId);
  res.json(timeEntries);
});

app.post('/api/time-entries', (req, res) => {
  const newEntryData = req.body;
  const userId = getReqUserId(req) || 'usr-1';
  const timeEntries = getCollection('timeEntries');
  const newEntry = {
    ...newEntryData,
    id: `time-${Date.now()}`,
    userId: newEntryData.userId || userId,
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
  const userId = getReqUserId(req);
  const invoices = getCollection('invoices', userId);
  res.json(invoices);
});

app.post('/api/invoices', (req, res) => {
  const newInvoiceData = req.body;
  const userId = getReqUserId(req) || 'usr-1';
  const invoices = getCollection('invoices');
  const newInvoice = {
    ...newInvoiceData,
    id: `inv-${Date.now()}`,
    userId: newInvoiceData.userId || userId,
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
  const userId = getReqUserId(req);
  const notifs = getCollection('notifications', userId);
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
  const userId = getReqUserId(req);
  let notifs = getCollection('notifications');
  if (userId) {
    notifs = notifs.filter(n => n.userId !== userId);
  } else {
    notifs = [];
  }
  saveCollection('notifications', notifs);
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
    const userId = getReqUserId(req);
    const projects = getCollection('projects', userId);
    const tasks = getCollection('tasks', userId);
    const pending = tasks.filter(t => t.status !== 'done').length;
    reply = `📊 **Workspace Status Summary**:\n• You currently have **${projects.length} active projects**.\n• **${pending} tasks** are in your pipeline.\n• Keep up the momentum! Organize your client milestones and prioritize urgent tasks.`;
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
