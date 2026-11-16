# GS BUMBA TSS Student Registration

Vue 3/Vite frontend with a Node.js/Express API and MySQL database.

## Requirements

- Node.js 20 or newer
- MySQL 8 or compatible MySQL server

## Local setup

1. Install frontend packages from the project root:

   ```sh
   npm install
   ```

2. Install API packages:

   ```sh
   npm --prefix backend install
   ```

3. Copy `backend/.env.example` to `backend/.env`. Set the MySQL connection values and a random `JWT_SECRET` of at least 32 characters. Set `ADMIN_EMAIL` and a strong `ADMIN_PASSWORD` (at least 12 characters) for the initial administrator.

4. Create the MySQL database:

   ```sh
   npm run backend:init-db
   ```

   The API creates its tables automatically on startup.

5. Create the initial admin account:

   ```sh
   npm run backend:create-admin
   ```

6. In one terminal start the API; in another start the Vue app:

   ```sh
   npm run backend:dev
   npm run dev
   ```

The API listens on `http://localhost:4000`; Vite uses `http://localhost:5173`. To use another API URL, set `VITE_API_URL` to the API's `/api` URL, such as `https://api.example.com/api`. Add the deployed frontend origin to `FRONTEND_ORIGINS` in the API environment.

## Included features

- Student registration with a student login account and generated registration number
- Student and administrator login using hashed passwords and signed, expiring tokens
- Admin student list and deletion
- Student-specific marks viewing and administrator Excel (`.xlsx`) marks upload
- Public course-document downloads and administrator document upload
- Public school news and administrator news/image publishing
- Student comments and administrator comment viewing

Uploaded files are stored under `backend/uploads`; production deployments must use persistent storage and back up the MySQL database and uploaded files. The API requires HTTPS and secure production environment values when deployed.

## API routes

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/students`, `DELETE /api/students/:id` (admin)
- `GET /api/marks/my`, `POST /api/marks/upload` (authenticated/admin respectively)
- `GET /api/documents`, `POST /api/documents` (admin)
- `GET /api/news`, `POST /api/news` (admin)
- `POST /api/comments` (student), `GET /api/comments` (admin)
- `GET /api/health`

Authenticated API calls use `Authorization: Bearer <token>`. Excel uploads must include registration number, level, subject, term, score, and maximum score columns; grade is optional. Re-uploading the same student's subject and term updates that result.
