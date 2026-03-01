# Portfolio Backend — Setup Guide

## What you need to do

---

### 1. Install PostgreSQL (if you haven't)

Download from https://www.postgresql.org/download/windows/

During install, set a password for the `postgres` superuser — remember it.

Then open **pgAdmin** (installed with PostgreSQL) or use the terminal:

```sql
-- Connect as postgres user, then:
CREATE DATABASE portfolio;
CREATE USER portfolio_user WITH PASSWORD 'choose_a_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;
```

---

### 2. Fill in `application.properties`

Open `src/main/resources/application.properties` and replace the placeholders:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/portfolio
spring.datasource.username=portfolio_user
spring.datasource.password=choose_a_password

spring.mail.username=your.gmail@gmail.com
spring.mail.password=xxxx xxxx xxxx xxxx   ← Gmail App Password (see below)

app.cors.allowed-origins=http://localhost:5173,https://yoursite.com
app.contact.recipient-email=your.gmail@gmail.com
```

**Getting a Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Make sure 2-Step Verification is ON
3. Search for "App Passwords" → create one named "Portfolio"
4. Paste the 16-character code into `spring.mail.password`

---

### 3. Update your frontend `vite.config.ts`

Copy the `vite.config.ts` from this folder into your `frontend/` directory.
This tells Vite to forward `/api/*` requests to the Spring Boot server during development.

---

### 4. Update `siteConfig.ts`

Open `frontend/src/config/siteConfig.ts` and make sure these match your real info:

```ts
export const SITE = {
  email: 'your.email@gmail.com',
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourprofile',
  // ...
}
```

---

### 5. Run the backend

Option A — IntelliJ IDEA (recommended):
1. Open the `backend/` folder as a project
2. It will auto-detect the Maven project
3. Click the green ▶ Run button on `PortfolioApplication.java`

Option B — Terminal:
```bash
cd backend
./mvnw spring-boot:run
```

The server starts at http://localhost:8080

---

### 6. Run both together (dev)

In one terminal:
```bash
cd backend
./mvnw spring-boot:run
```

In another terminal:
```bash
cd frontend
npm run dev
```

Visit http://localhost:5173 — the contact form and canvas will now work.

---

## What the backend does

| Endpoint | What it does |
|---|---|
| `POST /api/contact` | Saves the message to DB, emails it to your inbox |
| `GET /api/canvas` | Returns all painted pixels |
| `POST /api/canvas/pixel` | Paints or repaints a pixel (upsert) |

**Canvas rate limiting:** Each IP can place up to 500 pixels per day (configurable in `application.properties`).

**Tables created automatically** by `spring.jpa.hibernate.ddl-auto=update` — no SQL migrations needed.

---

## Deployment (when ready)

You'll need:
- A server/host that can run Java 21 (Railway, Render, Fly.io all work)
- A hosted PostgreSQL database (Railway and Render both offer free tiers)

When deploying:
1. Change `spring.jpa.hibernate.ddl-auto=update` to `validate` (safer for production)
2. Add your real domain to `app.cors.allowed-origins`
3. Set all secrets as environment variables (never commit real passwords)
