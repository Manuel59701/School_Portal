# School Management Portal — Crea8orz Academy

A full-featured, modern School Management System with a public school website, role-based dashboards (Student, Class Teacher, Main Admin), a live termly result-card engine with PDF export, and a PHP + MySQL REST API.

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 18 + Vite, lucide-react icons, jsPDF (server-side-free PDF rendering) |
| State     | `localStorage`-backed external store with cross-tab sync (`useSyncExternalStore`) |
| Backend   | PHP REST API (JSON), PDO MySQL connection with JSON-file fallbacks |
| Database  | MySQL / MariaDB (`backend/database/schema.sql`) |
| Dev proxy | Vite proxies `/api` → `http://localhost:8000` |

## Project Structure

```
School Portal/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # View router: landing → login → dashboard
│   │   ├── components/
│   │   │   ├── LandingPage.jsx      # Public website
│   │   │   ├── LoginPage.jsx        # Role-based auth + demo login
│   │   │   ├── StudentDashboard.jsx # Read-only termly result view
│   │   │   ├── TeacherDashboard.jsx # Gradebook entry + report cards
│   │   │   ├── AdminDashboard.jsx   # Classes, teachers, results, newsletter
│   │   │   ├── ResultCardEditor.jsx # Report-card form + preview
│   │   │   └── ResultCard.jsx       # Rendered report card
│   │   ├── lib/
│   │   │   ├── academics.js         # Class/arm/term constants, seeded rosters
│   │   │   ├── portalStore.js       # Scores, commits, sessions, persistence
│   │   │   ├── resultCard.js        # Grading bands, record building, summaries
│   │   │   └── resultCardImage.js   # Canvas + jsPDF PDF export
│   │   └── mockData.js              # Seed classes, teachers, announcements
│   └── vite.config.js               # Dev server + /api proxy
└── backend/
    ├── config/database.php          # PDO connection + CORS
    ├── database/schema.sql          # Full relational schema + seed data
    └── api/
        ├── auth/login.php           # Role-based authentication
        ├── newsletter/subscribe.php # Landing-page lead capture
        ├── teacher/results.php      # Result publish/read (GET/POST)
        ├── teacher/upload_ocr.php   # Result-sheet image → structured rows
        ├── admin/classes.php        # Class CRUD (GET/POST)
        └── admin/teachers.php       # Teacher account CRUD (GET/POST)
```

---

## Features

### Public Website (Landing Page)
- Sticky navigation with smooth-scroll sections: **About Us**, **Academic Sections**, **Campus News**, **Newsletter & Contact**.
- Full-screen **hero slideshow** (4 slides) with auto-play, arrows, and dot indicators.
- Scrolling **news ticker** with admissions, achievement, and event headlines.
- About section with school stats and **scroll-reveal animations**.
- **Academic Divisions**: Early Years (Nursery), Primary (Grades 1–6), Junior & Senior Secondary (JSS/SSS).
- **Campus News & Announcements** board (academic, achievement, campus-life categories).
- **Newsletter subscription form** — posts to `/api/newsletter/subscribe.php`, falls back to `localStorage`, with success/error feedback.
- Footer portal links (Student Result Portal, Teacher Grading Suite, Main Admin Management).

### Authentication
- Three role tabs: **Student**, **Class Teacher**, **Main Admin**.
- Cinematic login panel: Ken Burns photo slideshow (auto-advancing every 6s), show/hide password toggle, forgot-password helper.
- Tries the PHP API first; if unavailable, an **offline fallback** authenticates demo accounts so the portal works with zero backend setup.
- **Quick-demo fill buttons** prefill credentials for each role.
- Logout returns to the landing page; staff logouts **wipe session scores** so nothing leaks into the next session.

### Student Dashboard
- **Termly result sheet** with academic-year and term selectors.
- Stats cards: subjects released (X / 15) and badges for each published subject.
- **Read-only Termly Progress Report Card** compiled from committed gradebook entries.
- Live summary: termly average, certificate count (subjects ≥ 90%), honour-roll eligibility (average ≥ 75), uncommitted-draft warnings.
- **Download PDF** button with auto-generated filename (`StudentName_Term_Year.pdf`).
- Empty state messaging while teachers are still entering scores.

### Class Teacher Dashboard
- **Gradebook panel**
  - Select class level (JSS 1–3 / SSS 1–3), arm (A/B/C), subject (15-subject catalogue), term, and academic year.
  - Score fields capped at **Class Work 10 · Home Work 10 · Test 20 · Exam 60 = 100**.
  - Live entered-count and class-average metrics.
  - Roster table with **search**, **sortable columns** (name / student ID), and **pagination** (20 per page).
  - **Commit/Publish subject** — makes scores official and instantly visible to students; guards against empty commits.
  - **Reset all results** (confirmation required) to wipe drafts and published subjects.
  - Toast-style notices (success/error, auto-dismiss, Esc to close).
- **Report Card panel**
  - Full `ResultCardEditor`: pick any student (searchable), set report date, year, term, class-teacher and principal names.
  - Toggle **“Include uncommitted draft scores”** for preview only.
  - Show/hide card preview, live badges (average, certificates, drafts), **Download PDF**.

### Main Admin Console
Four tabs:
1. **Manage Classes & Arms** — class structure & academic divisions list (18 seeded arms across JSS/SSS), enrolment counts, junior/senior badges, pagination, **Create New Class Arm** modal.
2. **Teacher Staff Accounts** — staff table with subject, assigned class, status; **Register**, **Edit** (password optional/blank keeps current), and **Delete** (confirmation modal) teacher accounts.
3. **Oversee School Results** — result registry per term/year with **Published / Pending** sub-tabs, showing class, subject, class master, drafts entered, students published, and status badges; paginated.
4. **Newsletter Subscribers** — captured landing-page emails with capture date, channel, and **Export CSV** action.
- Global **Reset all results** control with confirmation.

### Result Card Engine
- 15 subjects, weighted components (10/10/20/60).
- Nigerian grading bands: **A1 Distinction · B2/B3 Very Good/Good · C4–C6 Credit · D7/E8 Pass · F9 Fail**.
- Three explicit row states: **pending** (no scores), **draft** (entered, not committed, preview-only), **committed** (published — the only state that counts toward average/certificates).
- Auto-computed total, grade, remark, termly average, certificates, honour roll.
- Deterministic seeded rosters (30–60 students per class arm) so names/IDs stay stable across sessions.
- PDF export via canvas rendering + jsPDF, with camera-style timestamp stamp and school crest.

### Backend (PHP + MySQL)
- `schema.sql`: `users`, `classes`, `students`, `teachers`, `subjects`, `results`, `result_uploads`, `newsletter_subscribers` — plus seed accounts and classes.
- Endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login.php` | POST | Role-based login (DB verify + demo fallback), returns user + token |
| `/api/newsletter/subscribe.php` | POST | Validate & store subscriber (DB + JSON file) |
| `/api/teacher/results.php` | GET/POST | Read or publish class/subject results |
| `/api/teacher/upload_ocr.php` | POST | Upload a result-sheet image and receive parsed student rows (OCR) |
| `/api/admin/classes.php` | GET/POST | List / create class arms |
| `/api/admin/teachers.php` | GET/POST | List / create teacher accounts |

- Endpoints degrade gracefully to JSON-file storage when no database is configured.

---

## Application Flow

```
┌────────────────────────────────────────────────────────────────────┐
│ 1. LANDING PAGE (public)                                           │
│    Browse school site → subscribe to newsletter                    │
│    Click "Portal"/footer link                                      │
└───────────────────────────┬────────────────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────────────────┐
│ 2. LOGIN                                                           │
│    Choose role tab → enter ID/email + password                     │
│    (or use Quick Demo fill)                                        │
│    API auth → fallback offline auth                                │
└───────────────────────────┬────────────────────────────────────────┘
                            ▼
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐  ┌─────────────────┐  ┌──────────────────┐
│ 3a. STUDENT   │  │ 3b. TEACHER     │  │ 3c. ADMIN        │
│ View term/yr  │  │ Enter scores in │  │ Manage classes   │
│ Selectors     │  │ gradebook       │  │ Register/edit/   │
│ See released  │  │ (drafts saved   │  │ delete teachers  │
│ subjects      │  │  instantly)     │  │ Audit results:   │
│ Read-only     │  │       │         │  │  Published /     │
│ report card   │  │       ▼         │  │  Pending         │
│ Download PDF  │  │ COMMIT subject  │  │ Track newsletter │
└───────┬───────┘  │ (publish)       │  │ leads / export   │
        │          │ Preview report  │  └──────────────────┘
        │          │ card, PDF       │
        │          └────────┬────────┘
        │                   │
        └────────► scores shared via portal store ◄──────────
                   (localStorage, cross-tab sync:
                    teacher commits are visible to
                    the student instantly)
```

**End-to-end result lifecycle**

1. Teacher opens **Gradebook**, selects class arm + subject + term/year, enters CA/exam scores → stored as **draft**.
2. Teacher clicks **Commit** → the subject is **published** for that class (timestamped).
3. Store persists to `localStorage` and syncs across browser tabs in real time.
4. Student logs in, selects the same term/year → sees released-subject badges and a report card built **only from committed** subjects.
5. Student or teacher downloads the official **PDF** report card.
6. Admin monitors the same data in **Oversee School Results** (published vs. pending), and manages classes, staff accounts, and newsletter leads.
7. Logging out as teacher/admin clears the working session scores.

---

## Quick Start

### 1. Frontend (required)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

### 2. Backend PHP server (optional)
```bash
cd backend
php -S localhost:8000
```
Vite proxies `/api/*` to `http://localhost:8000`. Without the backend, the frontend uses its offline demo auth and `localStorage` data automatically.

### 3. Database (optional)
Import `backend/database/schema.sql` into MySQL/MariaDB (phpMyAdmin or `mysql < backend/database/schema.sql`). Configure credentials in `backend/config/database.php`.

### Demo credentials
Use the **Quick Demo** buttons on the login page, or:

| Role | Identifier | Password |
|------|-----------|----------|
| Student | Any admission number, e.g. `CR8/2026/S2A/001` (auto-filled) | `test123` |
| Class Teacher | `sarah.adebayo@crea8orz.academy` | `teacher123` |
| Main Admin | `admin@crea8orz.academy` | `admin123` |

### Production build
```bash
cd frontend
npm run build   # outputs to frontend/dist
```
