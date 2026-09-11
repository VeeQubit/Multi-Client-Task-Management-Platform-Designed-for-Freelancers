# 🛠️ Me Plus (Me+) — Backend Architecture & Technical Documentation

> **Platform**: Me Plus (`Freelancer OS`)  
> **Architecture Style**: RESTful API Micro-Service with Multi-Tenant Namespace Isolation & Local-First Hybrid Sync  
> **Server Runtime**: Node.js (ES Modules, `type: "module"`)  
> **Framework**: Express.js v5 (`express@^5.2.1`)  
> **Database Engine**: Persistent JSON Document Store (`server/data/db.json` + `db.js`)  
> **API Base URL**: `http://localhost:5000/api` (Proxied via Vite dev server at `/api`)

---

## 📑 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack & Libraries](#2-technology-stack--libraries)
3. [Data Storage & Database Architecture](#3-data-storage--database-architecture)
4. [User Isolation & Multi-Tenancy Strategy](#4-user-isolation--multi-tenancy-strategy)
5. [Complete REST API Specification](#5-complete-rest-api-specification)
   - [Authentication & User Profile](#51-authentication--user-profile)
   - [Client Management](#52-client-management)
   - [Project Management](#53-project-management)
   - [Task Management](#54-task-management)
   - [Time Tracking](#55-time-tracking)
   - [Invoices & Billing](#56-invoices--billing)
   - [In-App Notifications](#57-in-app-notifications)
   - [AI Freelancer Copilot](#58-ai-freelancer-copilot)
   - [System & Health](#59-system--health)
6. [Security, Performance & Large Payload Handling](#6-security-performance--large-payload-handling)
7. [Hybrid Offline / Vercel Deployment Architecture](#7-hybrid-offline--vercel-deployment-architecture)
8. [Automated Verification & Test Suite](#8-automated-verification--test-suite)
9. [How to Run & Test](#9-how-to-run--test)

---

## 1. Architecture Overview

Me Plus is designed as a **dual-layer, local-first hybrid full-stack system**. The backend acts as the authoritative REST API server, handling client credentials, multi-client workspace storage, project lifecycles, time tracking sessions, invoice generation, and AI intelligence.

```
                      ┌────────────────────────────────────────┐
                      │          React 19 Frontend UI          │
                      │    (Tailwind CSS, Lucide, Confetti)    │
                      └───────────────────┬────────────────────┘
                                          │
                  ┌───────────────────────┴────────────────────────┐
                  ▼                                                ▼
       [Local State & Cache]                              [API Service Layer]
   (localStorage Namespaced Keys)                        (src/services/api.ts)
   - meplus_user_v1                                                │
   - meplus_clients_user_<uid>                                     │ HTTP / REST
   - meplus_projects_user_<uid>                                    ▼
   - meplus_invoices_user_<uid>                         ┌───────────────────────┐
                                                        │   Express.js Server   │
                                                        │  (server/src/server)  │
                                                        └───────────┬───────────┘
                                                                    │
                                          ┌─────────────────────────┴─────────────────────────┐
                                          ▼                                                   ▼
                              [Data Layer (db.js)]                                [AI Copilot Engine]
                             - Deterministic User IDs                            - Rate calculation
                             - isDemoSeedEntity Guard                            - Email negotiation
                             - Atomic File I/O Sync                              - Scope-creep scripts
                                          │
                                          ▼
                               [JSON Document Database]
                                (server/data/db.json)
```

---

## 2. Technology Stack & Libraries

| Technology / Package | Version | Purpose in Backend |
|---|---|---|
| **Node.js** | `>=18.0.0` (v24 LTS) | High-performance JavaScript runtime environment with native ECMAScript Modules (`import`/`export`). |
| **Express.js** | `^5.2.1` | Next-generation web framework for routing, REST endpoints, and middleware pipeline. |
| **CORS** | `^2.8.5` | Cross-Origin Resource Sharing middleware enabling seamless communication between Vite (`:5173`) and Express (`:5000`). |
| **Body Parser (Built-in)** | `15MB Limit` | Custom-configured JSON and URL-encoded body parser supporting high-resolution base64 avatars and itemized invoice payloads. |
| **Concurrently** | `^10.0.5` | Orchestrates parallel execution of both the Vite client server and the Express API server with a single `npm run dev` command. |
| **Node Test Runner & Fetch** | Native | Self-contained automated testing framework (`server/test-auth.js`) executing 17 comprehensive test scenarios with zero extra test dependencies. |

---

## 3. Data Storage & Database Architecture

The data tier is implemented in `server/src/db.js` and backed by `server/data/db.json`.

### Database Schema Structure:
```json
{
  "users": [
    {
      "id": "usr_jaanuraj63_gmail_com",
      "name": "jaanu",
      "email": "jaanuraj63@gmail.com",
      "password": "hashed_or_plain_password",
      "avatar": "data:image/jpeg;base64,...",
      "title": "Graphic Designer & Illustrator",
      "hourlyRate": 65,
      "currency": "$",
      "bio": "Freelancer specializing in branding and UI...",
      "notificationSettings": {
        "email": true,
        "sms": true,
        "browser": true,
        "sound": true,
        "deadlineReminderHours": 24
      }
    }
  ],
  "user": { ... },
  "clients": [
    {
      "id": "cli-1788854767862",
      "userId": "usr_jaanuraj63_gmail_com",
      "name": "kamal",
      "company": "kamal",
      "email": "kamal@gmail.com",
      "phone": "0741234567",
      "color": "#f59e0b",
      "status": "active",
      "hourlyRate": 65,
      "currency": "$",
      "totalBilled": 0,
      "notes": "",
      "createdAt": "2026-09-08"
    }
  ],
  "projects": [ ... ],
  "tasks": [ ... ],
  "timeEntries": [ ... ],
  "invoices": [ ... ],
  "notifications": [ ... ]
}
```

### Key Database Subroutines:
- **`initDb()`**: Checks if `server/data/db.json` exists; if missing, creates the directory and writes the initial seed template.
- **`readDb()`**: Reads and parses `db.json` safely with exception handling and fallback recovery.
- **`writeDb(data)`**: Atomically writes updated database state formatted with 2-space indentation.
- **`getCollection(collectionName, userId)`**: Queries items belonging strictly to the requested `userId`. For real users, it automatically runs through `isDemoSeedEntity` to guarantee zero sample data pollution.
- **`saveCollection(collectionName, items)`**: Replaces or updates the specified collection in `db.json`.

---

## 4. User Isolation & Multi-Tenancy Strategy

A key innovation in the Me Plus backend is **strict namespace isolation** between evaluation accounts and real user accounts:

### 1. Deterministic User ID Generation
User IDs are computed deterministically from normalized email addresses:
$$\text{UserID}(\text{email}) = \begin{cases} 
\text{"usr-demo"} & \text{if email} = \text{"demo@meplus.io"} \\
\text{"usr-1"} & \text{if email} = \text{"alex.rivera@gmail.com"} \\
\text{"usr\_"} + \text{clean}(\text{email}) & \text{otherwise}
\end{cases}$$

### 2. Demo Seed Entity Protection (`isDemoSeedEntity`)
To prevent evaluator sample data (e.g. *Sarah Jenkins*, *Marcus Vance*, invoice `INV-2026-001`, task `tsk-1`) from leaking into newly registered accounts:
- Every `GET` and `POST` request validates entities against a comprehensive set of demo IDs, invoice numbers, client names, and project keywords.
- Evaluators logging into `demo@meplus.io` get access to the full showcase dataset.
- Newly registered real users start with a **clean slate (0 clients, 0 projects, 0 tasks, 0 invoices)**.

---

## 5. Complete REST API Specification

All endpoints are prefixed with `/api`.

### 5.1 Authentication & User Profile

#### `POST /api/auth/register`
Creates a new freelancer account.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "profession": "UI/UX Designer"
  }
  ```
- **Responses**:
  - `201 Created`: Returns `{ success: true, user: UserProfile }`
  - `400 Bad Request`: Missing fields or password $<6$ characters
  - `409 Conflict`: Email is already registered

#### `POST /api/auth/login`
Authenticates an existing user.
- **Request Body**: `{ "email": "jane@example.com", "password": "password123" }`
- **Responses**:
  - `200 OK`: Returns `{ success: true, user: UserProfile }`
  - `401 Unauthorized`: Unregistered email or invalid password

#### `POST /api/auth/forgot-password`
Verifies email address existence for account recovery.
- **Request Body**: `{ "email": "jane@example.com" }`
- **Responses**: `200 OK` (Verified) or `404 Not Found`

#### `POST /api/auth/reset-password`
Updates the password for a verified account.
- **Request Body**: `{ "email": "jane@example.com", "newPassword": "newPassword2026" }`
- **Responses**: `200 OK` or `400 Bad Request`

#### `GET /api/auth/me`
Retrieves the currently active user profile.
- **Response**: `200 OK` `{ "user": UserProfile | null }`

#### `PUT /api/auth/profile`
Updates user profile settings, biography, notification preferences, or Base64 avatar photo.
- **Request Body**: `{ "id": "usr_...", "name": "...", "avatar": "data:image/jpeg;base64,...", "bio": "..." }`
- **Response**: `200 OK` `{ "success": true, "user": UserProfile }`

---

### 5.2 Client Management

- `GET /api/clients?userId=<uid>`: Lists all clients belonging to `<uid>`.
- `POST /api/clients`: Creates a new client tagged with `userId`.
- `PUT /api/clients/:id`: Updates an existing client's details.
- `DELETE /api/clients/:id`: Removes a client record.

---

### 5.3 Project Management

- `GET /api/projects?userId=<uid>`: Lists projects for the specified user.
- `POST /api/projects`: Launches a project with budget, milestones, client linkage, and priority tags.
- `PUT /api/projects/:id`: Updates project status (`planning`, `in-progress`, `completed`, `archived`) and progress percentage.
- `DELETE /api/projects/:id`: Deletes a project.

---

### 5.4 Task Management

- `GET /api/tasks?userId=<uid>`: Returns tasks organized by project and client.
- `POST /api/tasks`: Creates a task with estimated hours, subtasks checklist, priority, and due dates.
- `PUT /api/tasks/:id`: Updates task status (`todo`, `in-progress`, `review`, `done`), subtasks, or actual hours.
- `DELETE /api/tasks/:id`: Deletes a task.

---

### 5.5 Time Tracking

- `GET /api/time-entries?userId=<uid>`: Lists all recorded work sessions.
- `POST /api/time-entries`: Logs a billable/non-billable time entry with duration (in seconds), hourly rate, and timestamp.
- `DELETE /api/time-entries/:id`: Removes a time log.

---

### 5.6 Invoices & Billing

- `GET /api/invoices?userId=<uid>`: Retrieves all itemized invoices for `<uid>`.
- `POST /api/invoices`: Generates a new invoice with itemized line items, subtotal, tax calculations, and status (`draft`, `sent`, `paid`, `overdue`).
- `PUT /api/invoices/:id`: Updates invoice line items, payment notes, or status.
- `DELETE /api/invoices/:id`: Removes an invoice.

---

### 5.7 In-App Notifications

- `GET /api/notifications?userId=<uid>`: Returns deadline alerts, payment confirmations, and system notifications.
- `PUT /api/notifications/:id/read`: Marks a single notification as read.
- `DELETE /api/notifications?userId=<uid>`: Clears all notifications for the user.

---

### 5.8 AI Freelancer Copilot

#### `POST /api/ai/chat`
Context-aware freelancer assistant capable of:
1. **Pricing & Hourly Rate Strategy**: Recommended tiered pricing packages.
2. **Payment Follow-ups**: Generates polite client reminders for overdue invoices.
3. **Scope Creep Defense**: Professional client negotiation scripts.
4. **Workload Summaries**: Synthesizes open priorities and deadlines.

- **Request Body**: `{ "message": "How do I follow up on an unpaid invoice?" }`
- **Response**: `{ "reply": "📧 Polite Payment Follow-up Draft..." }`

---

### 5.9 System & Health

- `GET /api/health`: Returns server status and ISO timestamp (`{ "status": "ok" }`).
- `POST /api/reset`: Restores the database to default seed state.

---

## 6. Security, Performance & Large Payload Handling

1. **Large Avatar Handling (15MB Limit)**:
   - Configured Express with `express.json({ limit: '15mb' })`.
   - Combined with client-side HTML5 Canvas compression ($256\times 256$, ~25KB), eliminating HTTP 413 (*Payload Too Large*) errors while preserving sharp retina quality.
2. **Password Sanitization**:
   - Authentication responses remove the `password` field before transmitting user objects over the network.
3. **Request Logging**:
   - Built-in middleware logs incoming HTTP methods and routes for real-time auditability.

---

## 7. Hybrid Offline / Vercel Deployment Architecture

Me Plus supports **two deployment and runtime topologies**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             DEPLOYMENT MODES                             │
├─────────────────────────────────────┬────────────────────────────────────┤
│ 1. Full-Stack Express Mode (Local)  │ 2. Static / Vercel Serverless Mode │
├─────────────────────────────────────┼────────────────────────────────────┤
│ • Node.js + Express API on port 5000│ • Single-Page App (SPA) on Vercel  │
│ • Vite Dev Server on port 5173      │ • Dual-layer localStorage sync     │
│ • Persistent server/data/db.json    │ • Zero external server cost        │
│ • Full CRUD REST verification       │ • Complete persistence in browser  │
└─────────────────────────────────────┴────────────────────────────────────┘
```

When deploying to platforms like **Vercel** or **Netlify**, the frontend gracefully operates using its namespaced `localStorage` persistence layer, while seamlessly syncing with any remote REST backend if configured.

---

## 8. Automated Verification & Test Suite

The backend includes a dedicated test runner in `server/test-auth.js` with **17 automated test cases**:

```text
======================================================
  ME PLUS AUTHENTICATION & VALIDATION TEST SUITE     
======================================================

  ✔ PASS - Reject login for unregistered user email (Expects 401)
  ✔ PASS - Reject login with incorrect password for existing account (Expects 401)
  ✔ PASS - Allow login with correct credentials (alex.rivera@gmail.com)
  ✔ PASS - Prevent duplicate account registration (Expects 409 Conflict)
  ✔ PASS - Register new user with custom profession ("3D Motion & VFX Designer")
  ✔ PASS - Reject forgot password for unregistered email (Expects 404)
  ✔ PASS - Verify registered email in Step 1 of Forgot Password (Expects 200)
  ✔ PASS - Reset password to new value in Step 2 of Forgot Password (Expects 200)
  ✔ PASS - Immediate login with newly reset password (Expects 200)
  ✔ PASS - Verify old password is invalidated after reset (Expects 401)
  ✔ PASS - Verify Demo Account has pre-populated clients and projects
  ✔ PASS - Verify newly registered user starts with 0 clients (Clean Slate)
  ✔ PASS - Verify newly created client is isolated to specific userId
  ✔ PASS - Verify created client persists across logout & re-login cycles
  ✔ PASS - Verify newly registered user starts with 0 invoices, 0 tasks, 0 projects (Clean Slate)
  ✔ PASS - Verify demo seed invoices cannot leak into real user workspace
  ✔ PASS - Verify custom profile avatar & bio persist across logout & login

------------------------------------------------------
  SUMMARY: Total: 17 | Passed: 17 | Failed: 0
------------------------------------------------------
```

---

## 9. How to Run & Test

```bash
# 1. Start full-stack development environment (Vite Frontend + Express Backend)
npm run dev

# 2. Run backend API & authentication test suite
npm test

# 3. Start standalone backend API server only
npm run server

# 4. Build production distribution bundle
npm run build
```

