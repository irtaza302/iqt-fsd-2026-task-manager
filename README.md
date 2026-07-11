# IQT-FSD-2026

# Full Stack Task Manager — Developer Assessment

A simple full-stack **Task Manager** web application built for the Full Stack Developer assessment.

**Stack:** React (Vite) · Node.js · Express · SQLite · Open-Meteo public API

---

## Submission checklist

| Step | Requirement | Status |
|------|-------------|--------|
| 1 | Video submission (2–3 min, unedited) | Submit separately with your application |
| 2 | Coding assessment (CRUD tasks + REST + DB) | ✅ This repository |
| 3 | Public API integration | ✅ Open-Meteo weather widget |
| 4 | Architecture / code-review questions | ✅ See below |
| 5 | Application starts with `IQT-FSD-2026` | ✅ |

**GitHub Repository:** https://github.com/irtaza302/iqt-fsd-2026-task-manager  
**Live Demo URL:** *(optional — e.g. Render / Railway / Vercel + backend host)*

---

## Features

### Front-end
- Responsive task list UI
- Add, edit, delete tasks
- Mark tasks as completed / incomplete
- Task stats (total / pending / done)
- Weather widget (public API integration)

### Back-end REST APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks |
| `GET` | `/api/tasks/:id` | Get one task |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/api/weather?city=London` | Weather via Open-Meteo |
| `GET` | `/api/health` | Health check |

---

## Setup instructions

### Prerequisites
- **Node.js** 18+ (recommended 20+)
- **npm** 9+

### 1. Clone the repository

```bash
git clone https://github.com/irtaza302/iqt-fsd-2026-task-manager.git
cd iqt-fsd-2026-task-manager
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Start the backend

```bash
npm start
```

API runs at **http://localhost:5000**

SQLite database file `tasks.db` is created automatically on first run.

### 4. Install frontend dependencies (new terminal)

```bash
cd frontend
npm install
```

### 5. Start the frontend

```bash
npm run dev
```

App runs at **http://localhost:5173**  
Vite proxies `/api/*` to the backend.

### Production (optional)

```bash
# Build frontend
cd frontend
npm run build

# Serve API + static build from backend
cd ../backend
npm start
```

Then open **http://localhost:5000**

---

## Database schema

**Engine:** SQLite (`backend/tasks.db`)

### Table: `tasks`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique task ID |
| `title` | TEXT | NOT NULL | Task title |
| `description` | TEXT | DEFAULT `''` | Optional details |
| `completed` | INTEGER | NOT NULL, DEFAULT `0` | `0` = pending, `1` = done |
| `created_at` | TEXT | NOT NULL, DEFAULT `datetime('now')` | Creation timestamp (UTC) |
| `updated_at` | TEXT | NOT NULL, DEFAULT `datetime('now')` | Last update timestamp |

### SQL (DDL)

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  completed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### Example row

```json
{
  "id": 1,
  "title": "Ship assessment app",
  "description": "CRUD + weather API",
  "completed": false,
  "created_at": "2026-07-11 12:00:00",
  "updated_at": "2026-07-11 12:30:00"
}
```

---

## Step 3: API integration task

### API used
**[Open-Meteo](https://open-meteo.com)** — free weather API (no API key required).

Endpoints used:
1. **Geocoding:** `https://geocoding-api.open-meteo.com/v1/search?name={city}`
2. **Forecast:** `https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...&current=temperature_2m,...`

### Short explanation of implementation
1. The frontend **Weather** widget sends the city name to our backend: `GET /api/weather?city=London`.
2. The Express route (`backend/routes/weather.js`) calls Open-Meteo’s **geocoding** API to resolve the city to latitude/longitude.
3. It then calls the **forecast** API for current temperature, humidity, wind, and weather code.
4. Results are normalized into a clean JSON response and displayed in the UI.
5. Proxying through our backend keeps CORS simple and centralizes third-party calls.

### Screenshot of working integration

Live app showing the Open-Meteo weather widget (Lahore) plus the task list:

![Open-Meteo weather API integration — Task Manager](docs/weather-integration.png)

### GitHub commit showing this work
- Implementation (`backend/routes/weather.js` + `frontend/src/components/WeatherWidget.jsx`):  
  https://github.com/irtaza302/iqt-fsd-2026-task-manager/commit/5d52eea
- Screenshot commit:  
  https://github.com/irtaza302/iqt-fsd-2026-task-manager/commit/9d64509

---

## Step 4: Code review & architecture answers

*(Each answer is under 300 words.)*

### 1. What steps would you take to secure a web application?

- **HTTPS everywhere** and secure cookies (`HttpOnly`, `Secure`, `SameSite`).
- **Authentication & authorization:** strong password hashing (bcrypt/argon2), JWT or session tokens with short expiry + refresh rotation; enforce role-based access on every protected route.
- **Input validation** on client and server; parameterized queries / ORM to prevent SQL injection; sanitize output to reduce XSS.
- **CORS** allowlist; disable unused HTTP methods; set security headers (Helmet: CSP, HSTS, X-Frame-Options).
- **Rate limiting** and brute-force protection on auth and public APIs.
- **Secrets** in environment variables / secret managers — never in git.
- **Dependency hygiene:** lockfiles, `npm audit`, automated updates.
- **Least privilege** for DB and cloud IAM roles; encrypt data at rest for sensitive fields.
- **Logging & monitoring** for anomalies; regular backups and incident response plan.

### 2. How would you improve the performance of a slow React application?

- **Measure first:** React DevTools Profiler, Lighthouse, bundle analyzer — fix real bottlenecks.
- **Code-split** routes and heavy components with `React.lazy` + `Suspense`; tree-shake and remove unused deps.
- **Memoization:** `React.memo`, `useMemo`, `useCallback` only where re-renders are expensive.
- **Virtualize** long lists (`react-window` / `react-virtuoso`).
- **Avoid unnecessary state** and prop drilling; colocate state; prefer stable keys.
- **Debounce** search/input handlers; batch updates.
- **Assets:** compress images, modern formats (WebP/AVIF), lazy-load media, CDN caching.
- **Data:** cache API responses (React Query / SWR), paginate, avoid over-fetching.
- **Build:** production build, minify, HTTP/2, prefetch critical routes.

### 3. Explain the difference between SQL and NoSQL databases and when you would use each.

**SQL** (PostgreSQL, MySQL, SQLite) stores structured data in tables with fixed schemas, relations (joins), and ACID transactions. Best for: financial systems, inventory, anything with clear relationships and strong consistency needs.

**NoSQL** (MongoDB documents, Redis key-value, Cassandra wide-column, etc.) offers flexible schemas, horizontal scale patterns, and often simpler models for nested/JSON-like data. Best for: rapidly evolving product schemas, high write throughput, content/catalogs, caching, real-time feeds — when eventual consistency is acceptable.

**When I choose:** SQL when data integrity and complex queries matter; NoSQL when flexibility and scale/speed of iteration dominate. Many systems use both (e.g. PostgreSQL as source of truth + Redis cache + search index).

### 4. How would you deploy a full-stack application to AWS, Azure, or Google Cloud?

**Example on AWS (similar ideas on Azure/GCP):**
1. **Build** frontend (`npm run build`) and containerize backend (Docker) with multi-stage build.
2. **Database:** managed SQL (RDS/Aurora) or DocumentDB/Atlas; store connection strings in Secrets Manager.
3. **Backend:** ECS Fargate / App Runner / Elastic Beanstalk behind an Application Load Balancer; auto-scaling policies.
4. **Frontend:** static files on S3 + CloudFront CDN (or host SPA from the API container).
5. **Networking & TLS:** ACM certificate, HTTPS only, private subnets for DB.
6. **CI/CD:** GitHub Actions builds, tests, pushes image to ECR, deploys on merge to `main`.
7. **Observability:** CloudWatch logs/metrics, health checks, alarms.
8. **Env config:** staging vs production parameters; never bake secrets into images.

**Azure:** App Service / Container Apps + Azure SQL + Blob/Static Web Apps + Front Door.  
**GCP:** Cloud Run + Cloud SQL + Cloud Storage + Cloud CDN + Cloud Build.

---

## Project structure

```text
Assessment/
├── README.md                 # This file (starts with IQT-FSD-2026)
├── .gitignore
├── backend/
│   ├── package.json
│   ├── server.js             # Express app entry
│   ├── db.js                 # SQLite setup + schema
│   ├── tasks.db              # Created at runtime (gitignored)
│   └── routes/
│       ├── tasks.js          # Task CRUD REST API
│       └── weather.js        # Open-Meteo integration
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js
        ├── index.css
        └── components/
            ├── TaskForm.jsx
            ├── TaskList.jsx
            └── WeatherWidget.jsx
```

---

## Quick API test (optional)

With the backend running:

```bash
# Create
curl -X POST http://localhost:5000/api/tasks -H "Content-Type: application/json" -d "{\"title\":\"Demo task\",\"description\":\"Hello\"}"

# List
curl http://localhost:5000/api/tasks

# Weather
curl "http://localhost:5000/api/weather?city=Karachi"
```

---

## License

Built for assessment purposes.
