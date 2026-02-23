# School Management System (MERN)

A full-stack school management platform with secure authentication, role-aware dashboards, CRUD modules for academic resources, and attendance tracking. Built with Node.js, Express, MongoDB, React, Redux Toolkit, Vite, and Tailwind CSS.

## Highlights
- 🔐 JWT authentication with admin/teacher/student roles and protected API routes.
- 📚 CRUD flows for students, teachers, classes, subjects, and attendance.
- 📊 Responsive dashboards with live stats and attendance charts (Recharts).
- 🧑‍🏫 Role-aware UX: teachers mark attendance, students view their records, admins manage everything.
- 🧱 Modular code structure with reusable Redux CRUD helpers and Axios interceptor.

## Role-Based Access Control
Fine-grained permissions live in `server/src/config/permissions.js` and are enforced by the `authorizePermissions` middleware. Each API route declares the permission it needs, and roles map to allowed actions:

| Permission | Admin | Teacher | Student | Description |
|------------|:-----:|:-------:|:-------:|-------------|
| `students:read` | ✅ | ✅ | ✅ (self) | View student records (students restricted to their own row in controllers). |
| `students:write` | ✅ | ❌ | ❌ | Create/update/delete students. |
| `teachers:read` | ✅ | ✅ (self) | ❌ | View teacher info. |
| `teachers:write` | ✅ | ❌ | ❌ | Manage teachers. |
| `classes:read` | ✅ | ✅ | ✅ | View class listings. |
| `classes:write` | ✅ | ❌ | ❌ | Manage classes. |
| `subjects:read` | ✅ | ✅ | ✅ | View subjects. |
| `subjects:write` | ✅ | ❌ | ❌ | Manage subjects. |
| `attendance:read` | ✅ | ✅ | ✅ (auto-scoped) | View attendance records (students auto-filtered to their sessions). |
| `attendance:write` | ✅ | ✅ | ❌ | Mark attendance. |

## Tech Stack
- **Backend:** Node.js, Express 5, MongoDB/Mongoose, JWT, Bcrypt, Express Validator.
- **Frontend:** React 19 + Vite, Redux Toolkit, React Router, Tailwind CSS, Recharts, React Icons.
- **Tooling:** Nodemon, ESLint, PostCSS, Axios.

## Folder Structure
```
.
├── server
│   ├── package.json          # Backend dependencies & scripts
│   └── src
│       ├── app.js            # Express app + middleware wiring
│       ├── server.js         # Entry point (env + DB bootstrap)
│       ├── config/           # DB + role constants
│       ├── controllers/      # Auth + domain logic
│       ├── models/           # User, Student, Teacher, Class, Subject, Attendance
│       ├── routes/           # REST endpoints per resource
│       ├── middleware/       # Auth, error handlers
│       └── utils/            # Async handler, token helpers, ApiError
├── client
│   ├── package.json          # Frontend dependencies & scripts
│   └── src
│       ├── app/store.js      # Redux store setup
│       ├── api/httpClient.js # Axios instance + interceptors
│       ├── components/       # Layout (Sidebar/Header) + ProtectedRoute
│       ├── constants/        # Role enums
│       ├── features/         # Redux slices (auth, students, teachers, classes, subjects, attendance)
│       ├── pages/            # Login, Dashboard, Students, Teachers, Classes, Subjects, Attendance
│       ├── utils/            # Storage helpers + CRUD slice factory
│       └── index.css/main.jsx/App.jsx
├── .gitignore
├── README.md
├── server/.env.example       # Backend env sample
└── client/.env.example       # Frontend env sample
```

## Environment Variables
Create `.env` files based on the samples provided.

### Backend (`server/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/school_management
USE_IN_MEMORY_DB=false
MONGOMS_VERSION=4.4.29
JWT_SECRET=supersecretjwt
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:4173,https://*.vercel.app
NODE_ENV=development
```
> Tip: set `USE_IN_MEMORY_DB=true` to automatically boot an in-memory MongoDB instance (powered by `mongodb-memory-server`) during local development. Data will reset on every restart, so keep it `false` for shared/staging/prod environments. You can tweak `MONGOMS_VERSION` if you need a different binary (4.4.x downloads are much smaller/quicker than the latest 7.x builds).

## API Route Design
| Endpoint | Method | Description | Auth / Roles |
|----------|--------|-------------|--------------|
| `/api/health` | GET | Health probe | Public |
| `/api/auth/register` | POST | Create a user (used to seed admin) | Public (production: lock down) |
| `/api/auth/login` | POST | Login, returns JWT | Public |
| `/api/students` | GET/POST | List (teachers see relevant records, students see themselves) / create student + linked user | Admin (write), Teacher/Student (read) |
| `/api/students/:id` | GET/PUT/DELETE | Student detail/update/delete | Admin (write), Teacher (read), Student (self) |
| `/api/teachers` | GET/POST | List or create teachers + linked user | Admin (write), Teacher (self view) |
| `/api/teachers/:id` | GET/PUT/DELETE | Teacher detail/update/delete | Admin (write), Teacher (self view) |
| `/api/classes` | GET/POST | Manage classes (teacher assignment, rosters) | Admin (write), Teacher/Student (read) |
| `/api/classes/:id` | GET/PUT/DELETE | Class detail/update/delete | Admin (write), Teacher/Student (read) |
| `/api/subjects` | GET/POST | Manage subjects (code, class, teacher) | Admin (write), Teacher/Student (read) |
| `/api/subjects/:id` | GET/PUT/DELETE | Subject detail/update/delete | Admin (write), Teacher/Student (read) |
| `/api/attendance` | GET/POST | View attendance (students auto-filter) / mark attendance | Teachers & Admin (mark), all roles (view) |

Auth middleware (`protect`) enforces JWT validation; `authorizeRoles` gates each route.

## Next Ideas
- Add notifications/email workflows for attendance anomalies.
- Extend analytics (per-class insights, export to CSV/PDF).
- Integrate file uploads for report cards and assignments.
- Add automated tests (Jest + React Testing Library / Supertest).
