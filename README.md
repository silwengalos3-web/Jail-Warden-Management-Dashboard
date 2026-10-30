# JailTrack — XianFire Warden Portal

JailTrack is a Warden-only jail facility management starter built on the XianFire repository's Express + MVC + Sequelize + `.xian` conventions. The `.xian` renderer compiles Handlebars-compatible templates and registers shared partials.

## Included modules

- Warden login (no public registration)
- Dashboard: PDL counts, pending transfers, open incidents, facility occupancy
- PDL records: create, search, view, and update status
- Transfer management: create, approve, reject, and audit decisions
- Incident management: record, review, and update investigation status
- Reports: status summaries and print-to-PDF
- Account list, notifications list, audit trail

## Requirements

- Node.js 20+
- MySQL 8+
- npm

## Setup (Windows CMD)

1. Create a MySQL database:

```sql
CREATE DATABASE jailtrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Copy `.env.example` to `.env` and update DB credentials and `SESSION_SECRET`.

3. Install dependencies and prepare the database:

```bash
npm install
npm run migrate
npm run seed:warden
npm run xian
```

4. Open `http://localhost:3000`.

Initial login values are read from `.env`:
- Email: `WARDEN_EMAIL`
- Password: `WARDEN_PASSWORD`

Change the initial password before using real records. Do not commit `.env`.

## Notes

- `npm run migrate` uses Sequelize `sync({ alter: true })`; back up the database before schema changes. For production, replace this with reviewed, versioned migrations.
- This starter uses the default in-memory Express session store. It is for local development only. Use a persistent session store and HTTPS in deployment.
- Add CSRF protection, stricter validation, secure backup policy, and a formally reviewed access-control policy before handling real PDL data.
- Transfer approval changes the PDL status to `Transferred`. Confirm the destination facility has formally accepted the transfer before treating the transfer as completed in a production workflow.
- Reports are summaries and should be verified against official source records before external submission.
- The starter stores no sensitive medical details and should not be populated with real personal information until the institution approves the system and security controls.

## MVC layout

```text
controllers/   Request and business logic
middleware/    Warden authentication
models/        Sequelize models and MySQL connection
routes/        Express route definitions
utils/         Audit helper
views/         XianFire-compatible .xian views
public/        CSS assets
index.js       Express application entry
migrate.js     Database table initialization
seedWarden.js  One-time initial Warden account creation
```
