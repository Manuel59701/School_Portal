# School Management Portal

A full-featured, modern School Management System built strictly according to the Project Specification.

## Structure
- `/frontend`: Modern React + Vite application featuring:
  - Public Landing Page with interactive slideshow & high-resolution campus photography
  - Newsletter subscription form with automated feedback
  - Role-based Login (Student, Class Teacher, Main Admin)
  - Student Dashboard: Termly result sheet, cumulative performance profile, PDF export/print
  - Class Teacher Dashboard: Direct CA/Exam marks entry & OCR snapshot upload conversion
  - Main Admin Console: Classes, teacher assignments, result audits, and newsletter subscriber tracking
- `/backend`: PHP REST API & MySQL Database schema:
  - `/backend/database/schema.sql`: Full relational schema for Nursery, Primary, and Secondary
  - `/backend/config/database.php`: PDO database connection & CORS
  - `/backend/api/auth/login.php`: Authentication endpoint
  - `/backend/api/newsletter/subscribe.php`: Lead capture endpoint
  - `/backend/api/teacher/results.php` & `upload_ocr.php`: Result grading & OCR conversion
  - `/backend/api/admin/classes.php` & `teachers.php`: Administrative management

## Quick Start

### 1. Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
The application will launch on `http://localhost:5173`.

### 2. Backend PHP Server (Optional)
```bash
cd backend
php -S localhost:8000
```
Import `backend/database/schema.sql` into your MySQL server (e.g. via phpMyAdmin or MySQL CLI).
