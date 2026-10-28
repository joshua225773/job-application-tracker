# TrackApply — Job Application Tracker (MERN Stack)

[![MERN Stack](https://img.shields.io/badge/Stack-MongoDB%20%7C%20Express%20%7C%20React%20%7C%20Node.js-blue.svg)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Completed-success.svg)]()
[![License](https://img.shields.io/badge/License-ISC-green.svg)]()

> Final Assessment Exit Examination — Full Stack Development (MERN)  
> A production-grade web application built to record, manage, and audit job applications through a verified state machine workflow, automated company-scoped sequence ID generator, duplicate conflict prevention, and 7-day follow-up tracking.

---

## 📸 Working Application Screenshots

### 1. Dashboard Overview, Metrics Counters & Overdue Alert
The dashboard displays aggregated status counts, active overdue alerts (7+ days elapsed in `Applied` status), backend-driven search and filter controls, and reactive application cards with company-scoped identifiers.

![TrackApply Dashboard Overview](screenshots/dashboard-overview.svg)

---

### 2. Application Details & Status Progression Timeline
Detailed audit trail of all historical status transitions with precise timestamps and milestone remarks, alongside the auto-computed 7-day follow-up target date.

![TrackApply Status Progression Timeline](screenshots/status-timeline.svg)

---

## 📂 Repository Architecture

```text
job-application-tracker/
├── backend/
│   ├── config/
│   │   └── database.js               # MongoDB connection with reconnect handlers
│   ├── controllers/
│   │   └── jobApplicationController.js # REST controllers with business validations
│   ├── models/
│   │   └── JobApplication.js         # Mongoose schema, transitions & virtuals
│   ├── routes/
│   │   └── jobApplicationRoutes.js   # Express REST route definitions
│   ├── utils/
│   │   └── idGenerator.js            # Auto-generated JA-<CODE>-<SEQ> engine
│   ├── .env                          # Backend environment variables
│   ├── package.json                  # Backend dependencies & run scripts
│   └── server.js                     # Express entrypoint & error middlewares
├── frontend/
│   ├── public/
│   │   └── favicon.svg               # Application branding icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApplicationCard.jsx   # Card view with safeguards & actions
│   │   │   ├── ApplicationFormModal.jsx # Add/Edit modal with 409 duplicate alert
│   │   │   ├── ApplicationTable.jsx  # Responsive data table view
│   │   │   ├── DeleteConfirmModal.jsx # Confirmation dialog with safeguards
│   │   │   ├── FilterBar.jsx         # Search and status dropdown controls
│   │   │   ├── Header.jsx            # Brand header & quick actions
│   │   │   ├── MetricsOverview.jsx   # Top status counters & overdue banner
│   │   │   ├── StatusBadge.jsx       # Coloured status badge & overdue tag
│   │   │   ├── StatusTransitionModal.jsx # Valid transitions dropdown modal
│   │   │   └── TimelineModal.jsx     # Vertical history timeline
│   │   ├── services/
│   │   │   └── applicationService.js # Fetch API client integration
│   │   ├── utils/
│   │   │   └── constants.js          # Allowed transitions, enums & styling config
│   │   ├── App.jsx                   # Central state orchestration
│   │   ├── index.css                 # Tailwind directives & custom animations
│   │   └── main.jsx                  # React DOM root entrypoint
│   ├── index.html                    # HTML5 shell
│   ├── package.json                  # Frontend dependencies
│   ├── postcss.config.js             # PostCSS Tailwind plugins
│   ├── tailwind.config.js            # Tailwind CSS design system tokens
│   └── vite.config.js                # Vite build and proxy configuration
├── screenshots/
│   ├── dashboard-overview.svg        # Dashboard overview visual
│   └── status-timeline.svg           # Status progression timeline visual
├── .env                              # Root environment configuration
├── .gitignore                        # Git exclusion rules (.env kept per instructions)
├── package.json                      # Workspace runner scripts
└── README.md                         # Complete project documentation & API guide
```

---

## ⚙️ Environment Variables (`.env`)

Per the exam submission requirements, the project includes `.env` files with test credentials for evaluator execution:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://exam_student:ExamSecurePass2026@cluster0.mernexam.mongodb.net/job_tracker_db?retryWrites=true&w=majority

# Client Application URL
CLIENT_URL=http://localhost:5173
```

> **Note**: If MongoDB Atlas cannot be reached due to network/firewall policies, you can update `MONGODB_URI` to a local MongoDB instance: `mongodb://127.0.0.1:27017/job_tracker_db`.

---

## 🚀 Setup & Execution Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
# Server will start on http://localhost:5000
```

### 2. Frontend Setup
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Launch Vite development server
npm run dev
# Frontend will be live on http://localhost:5173
```

### 3. Alternative Single-Command Startup (Root)
From the root directory of the repository:
```bash
npm run backend   # Starts backend on :5000
npm run frontend  # Starts frontend on :5173
```

---

## 📋 Comprehensive REST API Reference

All responses strictly follow the standardized JSON format:
```json
{
  "success": true,
  "message": "Human-readable description",
  "data": { ... }
}
```

| Method | Endpoint | Description | Request Body | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/applications` | Create a new job application | `{ company, role, jobType, appliedDate, expectedSalary?, notes? }` | `201 Created`<br>`400 Bad Request`<br>`409 Conflict` |
| `GET` | `/api/applications` | Retrieve applications with query filters | None (Query: `?status=...&search=...`) | `200 OK`<br>`500 Server Error` |
| `GET` | `/api/applications/stats` | Retrieve aggregate counts per status & overdue | None | `200 OK` |
| `GET` | `/api/applications/:id` | Get application details by ID or Application ID | None | `200 OK`<br>`404 Not Found` |
| `PUT` | `/api/applications/:id` | Edit mutable application fields | `{ company, role, jobType, expectedSalary?, notes? }` | `200 OK`<br>`400 Bad Request`<br>`404 Not Found`<br>`409 Conflict` |
| `PATCH` | `/api/applications/:id/status` | Transition status along the state machine | `{ status, notes? }` | `200 OK`<br>`400 Invalid Transition`<br>`404 Not Found` |
| `DELETE` | `/api/applications/:id` | Delete application (only if Applied or Final) | None | `200 OK`<br>`400 Action Prohibited`<br>`404 Not Found` |

---

## 🛡️ Business Rules & Implementation Details

### 1. Auto-generated Application ID
- Format: `JA-<first 3 letters of company in uppercase>-<3-digit sequence>` (e.g. `JA-INF-001`, `JA-GOO-002`).
- Generated exclusively by backend (`utils/idGenerator.js`); client cannot set or override it.
- Sequence counter increments dynamically per company code based on existing records.

### 2. Status Workflow & State Machine
Every application starts with `Applied`. The transitions are strictly enforced:
- **`Applied`** ➔ `Interview` or `Rejected`
- **`Interview`** ➔ `Offer` or `Rejected`
- **`Offer`** ➔ `Accepted` or `Declined`
- **`Accepted`**, **`Declined`**, **`Rejected`** are terminal statuses and cannot be altered.
- **Backend**: Returns `400 Bad Request` with an exact explanation of allowed transitions if violated.
- **Frontend**: The dropdown renders only the valid next statuses for the current stage.

### 3. Status History & Timeline Audit
- Every status transition is logged to `statusHistory` with `{ status, changedAt, notes }`.
- Initial creation automatically seeds an `Applied` history record.
- Displayed on the frontend in an interactive vertical timeline.

### 4. Auto Follow-up Date & Overdue Indicator
- Automatically calculated as `appliedDate + 7 days`.
- If an application remains in `Applied` status past this date, backend returns `isOverdue: true`.
- Frontend displays a bright red **"Follow-up Overdue"** badge on cards and table rows.

### 5. Duplicate Rule
- Adding the same `Company` and `Job Role` (case-insensitive) while an earlier application for that pair is still active (`Applied`, `Interview`, or `Offer`) is blocked.
- Backend responds with `409 Conflict`.
- Frontend catches `409` and displays the exact warning banner directly on the form.

### 6. Delete Safeguard Rule
- An application can be deleted **only** if its status is `Applied` or a final status (`Accepted`, `Declined`, `Rejected`).
- Applications in `Interview` or `Offer` status **cannot** be deleted; backend returns `400 Bad Request`.
- Frontend asks for confirmation before deletion and disables the Delete button for active stages.

### 7. Immutable Fields on Edit
- During edits, `Application ID` and `Applied Date` are strictly disabled and read-only.
- Backend rejects attempts to modify these fields.
