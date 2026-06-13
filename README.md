# School Online Admission System

A full-stack web application for managing school admissions online. Built as an internship assessment project using Django REST Framework and Next.js.

---

## Project Overview

This application simulates a school's online admission process. Applicants fill out a form with their details and upload a photo and supporting document. An admin dashboard lets staff review all submissions, update statuses, and delete entries.

Authentication is intentionally omitted per the assessment brief. The focus is on form handling, file uploads, and CRUD operations.

---

## Features

**Applicant Side (`/apply`)**
- Full admission form with name, grade, gender, and extracurricular activities
- Image upload with live preview before submission
- Document upload (PDF, DOC, DOCX only)
- Client-side validation with clear error messages
- Success confirmation screen after submission

**Admin Side (`/admin/applications`)**
- Summary cards showing counts for Processing, Accepted, and Rejected applications
- Full submissions table with all applicant details
- Quick inline status change dropdown per row
- Links to open uploaded photo and document
- Edit and Delete actions per row

**Admin Review (`/admin/applications/[id]/edit`)**
- Full applicant detail view
- Status update with save confirmation
- Submission and last-updated timestamps

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | Next.js 16 (App Router), TypeScript     |
| UI Kit    | shadcn/ui, Tailwind CSS v4              |
| Forms     | React Hook Form + Zod                  |
| HTTP      | Axios                                   |
| Backend   | Django 6, Django REST Framework         |
| Database  | MySQL (via PyMySQL)                     |
| Files     | Local media storage (Django)            |

---

## Project Structure

```
school-online-admission-system/
├── backend/
│   ├── admissions/         # App: models, views, serializers, urls
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── validators.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── core/               # Django project settings
│   │   ├── settings.py
│   │   └── urls.py
│   ├── media/              # Uploaded files (auto-created)
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── app/
    │   ├── page.tsx                          # Home / landing page
    │   ├── apply/page.tsx                    # Applicant form
    │   └── admin/applications/
    │       ├── page.tsx                      # Admin list dashboard
    │       └── [id]/edit/page.tsx            # Review and edit page
    ├── components/
    │   ├── Navbar.tsx
    │   └── ui/                               # shadcn/ui components
    ├── lib/
    │   └── api.ts                            # Axios API helpers
    ├── types/
    │   └── index.ts                          # TypeScript interfaces
    └── .env.local                            # Environment variables
```

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL Server running locally
- pip and npm

---

## Setup – Backend

**1. Create and activate a virtual environment**
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

**2. Install dependencies**
```bash
pip install -r requirements.txt
```

**3. Configure environment**

Copy `.env.example` to `.env` and update if needed. By default it connects to a local MySQL server with no password (common for XAMPP/WAMP setups).

**4. Create the MySQL database**

Open MySQL and run:
```sql
CREATE DATABASE school_admission CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or run the included helper script:
```bash
python create_db.py
```

**5. Run migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

**6. (Optional) Create an admin superuser**
```bash
python manage.py createsuperuser
```

**7. Start the backend server**
```bash
python manage.py runserver
```

Backend will be running at: `http://localhost:8000`

---

## Setup – Frontend

**1. Install dependencies**
```bash
cd frontend
npm install
```

**2. Configure environment**

Copy `.env.example` to `.env.local`. The default value already points to the local Django server:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

**3. Start the development server**
```bash
npm run dev
```

Frontend will be running at: `http://localhost:3000`

---

## MySQL Setup Notes

- Default config uses `root` with no password on `localhost:3306` (standard XAMPP/WAMP setup).
- The database name must be `school_admission` unless you change `DB_NAME` in `settings.py`.
- The project uses `PyMySQL` as the MySQL driver since `mysqlclient` requires binary compilation.
- If you see `No module named 'pymysql'`, make sure you are inside the virtual environment.
- If you see connection errors, check that your MySQL service is running.

---

## API Endpoints

All endpoints are prefixed with `/api/`.

| Method   | Endpoint                              | Description                        |
|----------|---------------------------------------|------------------------------------|
| `GET`    | `/api/applications/`                  | List all applications               |
| `POST`   | `/api/applications/`                  | Submit a new application            |
| `GET`    | `/api/applications/{id}/`             | Get a single application            |
| `PATCH`  | `/api/applications/{id}/`             | Update an application (status etc.) |
| `DELETE` | `/api/applications/{id}/`             | Delete an application               |
| `GET`    | `/api/applications/status_summary/`   | Get counts by status                |

**File upload note:** `POST` and `PATCH` requests that include files must use `multipart/form-data`, not JSON.

**Sample `status_summary` response:**
```json
{
  "Processing": 4,
  "Accepted": 2,
  "Rejected": 1,
  "Total": 7
}
```

---

## Running Both Servers Together

Open two terminals:

**Terminal 1 – Backend**
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 – Frontend**
```bash
cd frontend
npm run dev
```

Then open `http://localhost:3000` in your browser.

---

## Assumptions and Simplifications

- **No authentication**: Login, sessions, and user roles are out of scope per the assignment brief.
- **No pagination**: The applications list loads all records. Acceptable for assessment scale.
- **Local file storage**: Uploaded files are saved to `backend/media/`. No cloud storage (S3 etc.) is used.
- **CORS open**: `CORS_ALLOW_ALL_ORIGINS = True` is used for simplicity. In production this would be restricted to the frontend domain only.
- **No email notifications**: Status changes do not trigger emails.
- **Single database**: No multi-tenancy or school separation.

---

## Screenshots

> Add screenshots here before submission.

| Page | Screenshot |
|------|------------|
| Home / Landing | _(add screenshot)_ |
| Application Form `/apply` | _(add screenshot)_ |
| Admin Dashboard `/admin/applications` | _(add screenshot)_ |
| Review Page `/admin/applications/[id]/edit` | _(add screenshot)_ |

---

## Git Commit Structure

This project was developed in structured commits:

1. `Add Application model and file validators`
2. `Add Application API serializers and views`
3. `Finalize backend routing and review`
4. `Add delete and full update API helper methods`
5. `Add inline status edit and delete to admin list`
6. `Frontend setup – packages, types, env, and API helper`
7. `Build robust applicant form with React Hook Form and Zod`
8. `Build admin dashboard and review pages`
9. `Polish UI with Nordic-inspired design system and landing page`
10. `Redesign /apply form to match Nordic editorial aesthetic`
11. `Redesign admin dashboard and review pages to match Nordic aesthetic`
12. `Final review – README, env examples, admin registration, cleanup`

---

## Notes for the Reviewer

- The project was built commit-by-commit to demonstrate structured development.
- All form validation runs on both the frontend (Zod) and backend (Django validators) independently.
- The `activities` field stores a JSON array in MySQL, handled gracefully on both sides.
- The `media/` folder is excluded from Git via `.gitignore`. You will need to run migrations before uploaded files work.
- Django admin is available at `http://localhost:8000/admin/` after creating a superuser.
