# 🚀 Classroom Management App

A real-time classroom management tool built with React 19 and Node.js TypeScript, enabling instructors to manage students, assign lessons, and communicate via live chat. The app supports secure SMS-based login, role-based dashboards, and real-time updates using Socket.io and Firebase.

## ✨ Features

- 🏬 User Authentication: Login via phone number with a 6-digit SMS code (Twilio) or email with a 6-digit OTP code, saving JWT token to localStorage.
- 🌐 Role-Based Dashboards: Instructor and Student dashboards
- 🧑‍🏫 Instructor Dashboard:
Add new students (name, phone, email) with email verification link.
Edit/delete student profiles.
Assign lessons (title, description) to students.
View student list with details and lesson statuses.
Real-time chat with students (Socket.io).
- 🎓 Student Dashboard:
View and mark assigned lessons as done.
Edit personal profile (name, email, phone).
Real-time chat with instructors (Socket.io).
- 💬 Real-Time Messaging: Secure, instant chat with message history (optional Firebase persistence).
- ⚙️ Built with React 19
- 🎨 TailwindCSS V4 styling
- 💅 ShadcnUI components

## 🛠️ Tech Stack

### Frontend

- React, Typescript, Tanstack Query, Zustand, TailwindCSS, ShadcnUI

### Backend

- Node.js, Express, TypeScript, Firebase, Twilio, Socket.io

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 20.0 or higher)
- npm or yarn
- Git
- Twilio Account (for SMS)
- Firebase Account (for database)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/sonwjnn/classroom-management-app.git
cd classroom-management-app
```

### 2. Install Dependencies

```bash
# Frontend source
cd frontend
npm install

# Backend source
cd backend
npm install
```

### 3. Environment Setup

Create .env files in both frontend and backend directories:
# Frontend .env
```env
VITE_APP_URL=
VITE_SERVER_URL=
VITE_API_BASE_URL=
```

# Backend .env
```env
APP_URL=

FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=


TWILIO_RECOVERY_CODE=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
TO_PHONE_NUMBER=

MAIL_PASSWORD=
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_IGNORE_TLS=
MAIL_SECURE=
MAIL_REQUIRE_TLS=
MAIL_DEFAULT_EMAIL=
MAIL_DEFAULT_NAME=
MAIL_CLIENT_PORT=

JWT_SECRET=
```

### 4. Run Development Server

```bash
# Frontend source
cd frontend
npm run dev

# Backend source
cd backend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website in your browser.

## 📁 Project Structure

```
classroom-management-app/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── chat/
│   │   │   ├── home/
│   │   │   ├── instructors/
│   │   │   ├── messages/
│   │   │   ├── students/
│   │   │   └── users/
│   │   ├── providers/
│   │   ├── routes/
│   │   ├── store/
│   │   ├── App.tsx
│   │   ├── constants.ts
│   │   ├── main.tsx
│   │   ├── types.ts
│   │   └── endpoints.ts
│   ├── .env
│   ├── .eslintrc.js
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── handlers/
│   │   ├── lib/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── socket/
│   │   ├── global.d.ts
│   │   ├── server.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
```
