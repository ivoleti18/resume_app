# Project File Breakdown

Overview of all source files in the resume app (excluding `node_modules` and `.next` build output).

---

## Root

| File | Purpose |
|------|--------|
| `package.json` | Frontend (Next.js) dependencies and scripts: `dev`, `build`, `start`, `lint` |
| `package-lock.json` | Lockfile for frontend dependencies |
| `.env.local` | Frontend env: `NEXT_PUBLIC_BACKEND_URL` (API base URL) |
| `.gitignore` | Ignore rules (node_modules, .env, .next, etc.) |
| `jsconfig.json` | JS path aliases (e.g. `@/` → `src/`) |
| `tailwind.config.js` | Tailwind CSS config |
| `README.md` | Project readme |

---

## Frontend (`src/`)

### App router pages (`src/app/`)

| File | Purpose |
|------|--------|
| `layout.js` | Root layout: fonts, `AuthProvider`, `MemberAuthProvider`, `Header`, main content |
| `page.js` | Home page |
| `globals.css` | Global styles |
| `admin/upload/page.js` | Admin resume upload (protected) |
| `auth/login/page.js` | Admin login |
| `auth/member-login/page.js` | Member login (email/password → backend JWT) |
| `auth/member-register/page.js` | Member registration (email, name, password, access code) |
| `search/page.js` | Resume search/filter (member-only via `ProtectedRoute`) |

### Components (`src/components/`)

| File | Purpose |
|------|--------|
| `ProtectedRoute.js` | Wraps member-only pages; redirects to member login if not authenticated (uses `useMemberAuth`) |
| `resume/PdfViewer.js` | Renders PDF from signed URL |
| `resume/ResumeCard.js` | Single resume card in search results |
| `ui/Header.js` | Nav: logo, Resume Search, Upload (admin), member sign in/out, admin login link |
| `ui/LogoutButton.js` | Admin logout |
| `ui/AdminWrapper.js` | Wraps admin-only UI |

### Lib (`src/lib/`)

| File | Purpose |
|------|--------|
| `api.js` | Axios instance + interceptors; `authAPI`, `resumeAPI`, `companyAPI`, `keywordAPI` |
| `AuthContext.js` | Admin auth context (login state, token, logout) |
| `MemberAuthContext.js` | Member auth: sign in/up/out via backend, JWT in localStorage, `useMemberAuth` |
| `utils.js` | Shared frontend helpers |

### Middleware

| File | Purpose |
|------|--------|
| `middleware.js` | Protects `/admin/upload`, `/profile` with admin cookie; redirects to admin login; no Supabase |

---

## Backend (`backend/`)

### Entry & config

| File | Purpose |
|------|--------|
| `package.json` | Backend deps (express, mongoose, bcrypt, jwt, multer, pdf-parse, etc.) and scripts: `start`, `dev`, `seed` |
| `.env` | Backend env: `MONGODB_URI`, `JWT_SECRET`, etc. (not committed) |
| `README.md` | Backend setup/run instructions |
| `src/server.js` | Express app: CORS, JSON, routes at `/api`, health check, error handler; calls `connectDB()` then listens |
| `src/config/database.js` | **Mongoose connect** – `connectDB()` uses `MONGODB_URI`, calls `mongoose.connect()` |

### Routes (`backend/src/routes/`)

| File | Purpose |
|------|--------|
| `index.js` | Mounts `/auth` and `/resumes` under `/api` |
| `authRoutes.js` | `POST /admin/login`, `POST /register`, `POST /member/login`, `POST /login` (unified), `GET /me`, `GET /admin/profile` |
| `resumeRoutes.js` | `GET /search`, `GET /filters`, `GET /:id/file` (stream PDF), `GET /:id`, `POST /` (upload), `PUT /:id`, `DELETE /:id`, `DELETE /all/delete` (admin) |

### Controllers (`backend/src/controllers/`)

| File | Purpose |
|------|--------|
| `authController.js` | Admin login; member register/login; `getCurrentUser` (admin or member from JWT) |
| `resumeController.js` | Upload (parse PDF, GridFS, MongoDB), search, getById, getResumeFile (stream PDF), update, delete, deleteAll, getFilters (Mongoose + GridFS) |

### Models (`backend/src/models/`) – Mongoose

| File | Purpose |
|------|--------|
| `index.js` | Exports `User`, `Resume`, `Company`, `Keyword` |
| `User.js` | Schema: email, password (hashed), firstName, lastName, role, isActive |
| `Resume.js` | Schema: name, major, graduationYear, fileId (GridFS), uploadedBy, companies[], keywords[], isActive |
| `Company.js` | Schema: name (unique) |
| `Keyword.js` | Schema: name (unique) |

### Middleware (`backend/src/middleware/`)

| File | Purpose |
|------|--------|
| `auth.js` | `authenticate` (any JWT), `authenticateAdmin`, `isAdmin` (admin-only) |
| `upload.js` | Multer config for in-memory PDF uploads |

### Utils (`backend/src/utils/`)

| File | Purpose |
|------|--------|
| `jwt.js` | `generateToken`, `verifyToken` (using `JWT_SECRET`) |
| `gridfs.js` | Upload/delete/stream PDFs in MongoDB GridFS (bucket `resumes`) |
| `resumeParser.js` | Parse PDF (pdf-parse) and optionally extract text with Gemini |

### Scripts (`backend/src/scripts/`)

| File | Purpose |
|------|--------|
| `seed.js` | Connects to DB via `connectDB()`, creates optional test member user |
| `checkPdf.js` | Standalone PDF check script (e.g. for debugging parsing) |

---

## Docs (`docs/`)

| File | Purpose |
|------|--------|
| `MIGRATION_SUPABASE_TO_MONGODB.md` | Guide: moving from Supabase to MongoDB + backend auth |
| `MIGRATION_COMPLETE.md` | Post-migration checklist, env, testing, troubleshooting |
| `PROJECT_FILE_BREAKDOWN.md` | This file |

---

## Public assets

| File | Purpose |
|------|--------|
| `public/pdf.worker.js` | PDF.js worker for client-side PDF rendering (if using react-pdf Document/Page) |

---

## Summary

- **Frontend**: Next.js 15 app; member auth via `MemberAuthContext` + backend JWT; admin auth via `AuthContext`; resume search protected by `ProtectedRoute`.
- **Backend**: Express API under `/api`; MongoDB via Mongoose + GridFS; auth (admin + member) and resume CRUD with PDFs stored in GridFS.
