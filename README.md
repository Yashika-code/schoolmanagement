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
>
> When deploying the frontend (e.g., Vercel), append its domain(s) to `CORS_ORIGIN`. Wildcards such as `https://*.vercel.app` are now supported so preview URLs keep working without manual updates.

### Frontend (`client/.env`)
```
VITE_API_URL=http://localhost:5000
```
> Update `VITE_API_URL` to your deployed API base (e.g., Render/Heroku URL) before building on Vercel/Netlify; Vite inlines the value during build so leaving it at `localhost` causes production requests to fail with a network error.

## Local Development
```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Run backend API (http://localhost:5000)
cd server && npm run dev

# 3. Run frontend SPA (http://localhost:5173)
cd client && npm run dev
```
Seed the first admin by calling `POST /api/auth/register` (e.g., via Thunder Client/Postman). Subsequent account creation is controlled via the admin dashboard.

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

## Deployment Guide
### Backend → Render or Heroku
1. Push the repo to GitHub.
2. Provision a MongoDB Atlas cluster and grab the connection string.
3. **Render**
   - Create a new Web Service → pick the `server` subfolder.
   - Set build command `cd server && npm install` and start command `cd server && npm start` (or use monorepo build scripts).
   - Configure environment variables from `server/.env` (PORT, MONGO_URI, JWT_SECRET, CORS_ORIGIN, etc.).
4. **Heroku**
   - Create app → configure Config Vars (same as above).
   - Add a buildpack for Node.js, set `NPM_CONFIG_PRODUCTION=false` if using dev deps, and set `Procfile` (e.g., `web: npm start --prefix server`).
5. Update `VITE_API_URL` in the frontend env to point to the deployed API URL (e.g., `https://school-api.onrender.com`).

### Frontend → Vercel or Netlify
1. Ensure `client/.env` has `VITE_API_URL` pointing to the deployed backend.
2. Commit and push.
3. **Vercel**
   - Import the repo.
   - Set the root directory to `client`.
   - Build command `npm run build`, output `dist`.
   - Add environment variable `VITE_API_URL`.
4. **Netlify**
   - Create new site → select repo.
   - Base directory `client`, build command `npm run build`, publish directory `client/dist`.
   - Configure env var `VITE_API_URL`.

After deployment, test login + CRUD + attendance flows from the hosted frontend.

## Testing & Notes
- Frontend production build: `cd client && npm run build` (already verified).<br>
- Backend relies on a running MongoDB instance. Use `mongod` locally or Atlas in the cloud.
- Chunk-size warnings during Vite build stem from bundling the entire dashboard; enable dynamic imports or adjust `build.chunkSizeWarningLimit` if needed.

## Next Ideas
- Add notifications/email workflows for attendance anomalies.
- Extend analytics (per-class insights, export to CSV/PDF).
- Integrate file uploads for report cards and assignments.
- Add automated tests (Jest + React Testing Library / Supertest).
