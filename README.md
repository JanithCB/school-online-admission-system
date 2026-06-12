# School Online Admission System

A full-stack internship assessment project. This system allows students to submit admission applications, and administrators to view, edit statuses, and manage these applications via a dashboard.

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS, shadcn/ui, TypeScript, Axios
- **Backend:** Django, Django REST Framework, Python
- **Database:** MySQL
- **File Storage:** Local File System (Django Media Root)

## Features
- **Application Form:** Collects applicant name, grade level, gender, and extracurricular activities.
- **File Uploads:** Supports image uploads with live preview, and document uploads strictly validated for PDF, DOC, and DOCX formats.
- **Admin Dashboard:** Lists all submissions in a clean data table.
- **Summary Widgets:** Displays real-time counts of applications in Processing, Accepted, and Rejected states.
- **Management Actions:** Directly change application status or delete records from the dashboard.

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL Server running locally on port 3306

### 1. Backend Setup (Django)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create the MySQL Database & Run Migrations:
   Make sure your MySQL server is running (e.g., via XAMPP or native service). The default connection uses `root` user with no password.
   ```bash
   python create_db.py
   python manage.py makemigrations
   python manage.py migrate
   ```
5. Start the Django Server:
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000/api/applications/`

### 2. Frontend Setup (Next.js)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

## Architecture Highlights
- **Decoupled Architecture:** Clean separation between the UI (Next.js client) and the API logic (Django).
- **TypeScript & Validation:** Client-side form validations and strict file type checking prevent bad data from reaching the server.
- **UI/UX Polish:** Uses Tailwind CSS and shadcn/ui to build a premium, responsive, and interactive user interface.
- **MVP Focus:** Built without complex unnecessary abstractions, focusing purely on delivering the requested features rapidly and reliably.
