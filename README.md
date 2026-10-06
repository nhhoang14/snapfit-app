# SnapFit

> **AI-Powered Photography Assistant for iOS & Android**  
> SnapFit helps users take better photos by analyzing reference images and providing real-time AI guidance for pose, composition, camera angle, and distance.

---

## 🏗 Project Architecture

```text
snapfit-app/
├── backend/          # RESTful API (Node.js, Express, TypeScript, Prisma 7)
├── mobile/           # Cross-platform mobile app (React Native)
└── README.md
```

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Mobile** | React Native (iOS & Android) |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database & ORM** | PostgreSQL, Prisma ORM 7 (`@prisma/adapter-pg`) |
| **Validation & Auth** | Zod, bcrypt |
| **AI / Vision** | Python (Pose Estimation, Composition Analysis) |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `>= 20.x`
- **PostgreSQL**: `>= 15.x` (Running on `localhost:5432` or Docker)
- **Package Manager**: `npm`

---

### 1. Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your real PostgreSQL credentials:
# DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<dbname>"

# 4. Run database migrations
npx prisma migrate dev

# 5. Start development server (hot-reload)
npm run dev
```

Server will start at: `http://localhost:3000`

---

## 📡 API Reference (Backend)

Base URL: `http://localhost:3000/api`

### Authentication (`/auth`)

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user account | `{ "email": "...", "displayName": "...", "password": "..." }` |

---

## 🗄 Database Management (Prisma)

Useful commands when working in `backend/`:

```bash
# Apply schema changes and create a new migration
npx prisma migrate dev --name <migration_name>

# Open visual web GUI to view/edit database records
npx prisma studio

# Validate schema integrity
npx prisma validate

# Re-generate Prisma Client
npx prisma generate
```

---

## 🔒 Security Best Practices
- Never commit `.env` or sensitive credentials to Git (configured in `.gitignore`).
- Passwords must always be hashed with `bcrypt` before storage.
- All request payloads are strictly validated using `Zod` schemas.
