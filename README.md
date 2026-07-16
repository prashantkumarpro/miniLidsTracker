# Mini Leads Tracker

A Full Stack Lead Management CRM application built as part of the **FasterQ Full Stack Developer Internship Assignment**.

The application allows sales representatives to manage customer leads, update lead status, search and filter leads, maintain notes history, and securely access the system using JWT Authentication.

---

## 🛠️ Tech Stack

### Frontend
* **Next.js** (App Router & Client SSR)
* **JavaScript** (ES6+)
* **Tailwind CSS** (V4 Utility Engine)
* **Fetch API** (Centralized API layers)

### Backend
* **Node.js** (Server runtime)
* **Express.js** (REST API framework)
* **MongoDB & Mongoose** (NoSQL Database & Object Modeling)
* **JWT Authentication** (Secure token-based auth)
* **bcryptjs** (Salted password hashing)
* **express-validator** (Server-side schema validation sanitizers)

---

## ✨ Features Implemented

* **Secure JWT Authentication**: Protected backend routes and client-side page route redirects based on token verification.
* **Full CRUD Operations**: Create, Read, Update, and Delete customer leads in real-time.
* **Search & Filter Command Bar**: Search leads by Name or Phone with keyboard shortcut listeners (`Ctrl + K` or `Cmd + K` focuses search).
* **Interactive Pipeline Chips**: Filter leads by status state with dynamic counts reflecting the active quantity inside each stage chip.
* **Communication Logs Timeline**: Maintain note history logs linked to lead status changes in a visual vertical path.
* **Responsive Carousel Metrics**: Horizontal swiping stats panels displaying lead distribution counts and animated ratio bars.
* **Horizontal Swipe Lead Cards Carousel**: Native mobile swiping and desktop Arrow Button slide navigation controllers on hover.
* **Infinite Scroll Pagination**: Swiping/scrolling near the end of the carousel triggers dynamic page fetches, appending new leads in real-time.
* **Loading Skeletons**: Hand-crafted animating skeletons (`StatsCardSkeleton` and `LeadCardSkeleton`) to ensure a smooth transition state before initial data builds.
* **Lazy Loading Performance**: Next.js code-splitting (`next/dynamic`) for modal components reduces bundle weights, improving initial First Contentful Paint (FCP).
* **Database Isolation Security**: Redirected tests to an isolated test collection (`mini-leads-tracker-test`), protecting active development records during test execution.
* **Clean Code Architecture**: Separated MVC controllers, models, schema validation layers, and modular reusable components.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
Create a `.env` file in the `backend/` directory using the template below:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
MONGODB_URI_TEST=your_mongodb_test_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend/` directory using the template below:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 🚀 Setup & Run Instructions

### 1. Clone Repository
```bash
git clone <repository-url>
cd miniLidsTracker
```

### 2. Run Backend
```bash
cd backend
npm install
npm run dev
```
* Backend runs on **`http://localhost:5000`**

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
* Frontend runs on **`http://localhost:3000`**

---

## 🌐 Live URLs

* **Frontend Dashboard Website**: [https://mini-lids-tracker.vercel.app/](https://mini-lids-tracker.vercel.app/)
* **Backend API Base URL**: [https://minilidstracker-production.up.railway.app/api/v1](https://minilidstracker-production.up.railway.app/api/v1/health)

---

## 🧠 AI Usage
AI tools were used to assist with:
* Planning the project structure and clean component layouts
* Code suggestions, refactoring helper classes, and fixing styling classes
* Debugging viewport CSS height collapses in flex layouts
* Structuring complete documentation

*All generated code was thoroughly reviewed, understood, tested, and modified to fit active CRM workflow needs. I understand how the application works, can debug the codebase, and can confidently extend it by adding new features.*

---

## 📋 Assignment Requirements Status

* **Authentication (JWT)**: ✅ Complete
* **CRUD Operations (Leads)**: ✅ Complete
* **Search Functionality**: ✅ Complete
* **Status Pipeline Filters**: ✅ Complete
* **Notes Timeline Management**: ✅ Complete
* **Server-side Schema Validation**: ✅ Complete
* **Fully Responsive Carousel UI**: ✅ Complete
* **Frontend Vercel Deployment**: ✅ Complete
* **Backend Railway Deployment**: ✅ Complete
