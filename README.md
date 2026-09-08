# Me Plus (Me+) — Multi-Client Task Management Platform for Freelancers

> **Course Project**: EC 9540 Human Computer Interaction Mini Group Project  
> **Platform Name**: **Me Plus** (`Freelancer OS`)  
> **Target Audience**: Freelancers (Software Developers, UI/UX Designers, Web/Mobile Developers, Digital Marketers, Consultants) managing 3–10+ concurrent clients.

---

## 🌟 Key Features & Sub-Task Coverage

| Sub-Task ID | Feature Description | Implementation in Me Plus |
|---|---|---|
| **ST1** | **Access the Platform** | Modern Login, Register, and **1-Click Demo Freelancer Mode** (Alex Rivera). Profile customization with custom hourly rate & currency. |
| **ST2** | **Manage Client Information** | Complete client directory, color tagging, communication preferences, contact shortcuts, total billed revenue, and client project history. |
| **ST3** | **Create & Manage Projects** | Multi-client project association, budgets, deadline milestones, priority tags, and automated progress calculation. |
| **ST4** | **Create & Organize Tasks** | **3 Interactive Views**: Drag-and-Drop **Kanban Board**, Interactive **Calendar View**, and Dense **List View** with subtask checklists. |
| **ST5** | **Monitor Project Progress** | Live Stopwatch Timer widget in navbar, automated task-to-project progress bars, and billable session logging. |
| **ST6** | **Receive & Manage Notifications** | In-app notification center with unread counters, urgent audio chimes, **Deadline Radar**, and simulated multi-channel (Email/SMS) previews. |
| **ST7** | **Review Dashboard & Reports** | High-level KPI cards, Deadline Radar, Workload Distribution by Client, and Live Activity Audit Trail. |
| **ST8** | **Complete & Archive Projects** | Soft archive, restore capability, CSV time log exports, and JSON workspace backup/restore. |
| **Bonus** | **Client Invoicing & Billing** | Generate customizable invoice slips with line items, tax/discount calculation, and print/PDF support. |
| **Bonus** | **Me Plus AI Copilot** | AI Task Deconstruction engine (auto-generates subtasks & time estimates) & Client Email Communication Drafter. |
| **Bonus** | **HCI Usability Matrix** | Interactive modal detailing how **Nielsen's 10 Usability Heuristics** and **Shneiderman's 8 Golden Rules** are satisfied. |

---

## 🚀 Quick Start Instructions

### Prerequisites
- Node.js (v18+)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 🎨 Human-Computer Interaction (HCI) Principles Implemented

1. **Visibility of System Status (Nielsen #1)**: Live stopwatch in navbar, real-time progress meters, deadline urgency badges.
2. **Match Between System & Real World (Nielsen #2)**: Client profiles with company avatars, printable invoice slips, standard kanban columns (To Do, In Progress, In Review, Done).
3. **User Control and Freedom (Nielsen #3)**: Global **Undo** button on toast alerts for deleted tasks/clients, soft project archive and 1-click restore.
4. **Consistency & Standards (Nielsen #4)**: Uniform color-coded priority pills (Urgent=Rose, High=Amber, Medium=Blue, Low=Emerald), consistent Lucide icons.
5. **Error Prevention (Nielsen #5)**: Form validation on required emails/rates, destructive action confirmation dialogs.
6. **Recognition Rather than Recall (Nielsen #6)**: Global Command Palette (`Ctrl+K`), client company chips on every task card.
7. **Flexibility & Efficiency of Use (Nielsen #7)**: Multi-view switcher (Kanban / Calendar / List), 1-click Quick Add, Omnibar shortcuts.
8. **Aesthetic & Minimalist Design (Nielsen #8)**: Sleek glassmorphism theme, Dark/Light mode toggle, uncluttered high-contrast typography.
