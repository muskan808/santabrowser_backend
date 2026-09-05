
# Multimedia Search — Backend (API)

Server-side API that handles user authentication, file uploads to Cloudinary, metadata storage in MongoDB, and search functionality.

Overview
- Implements REST endpoints under `/api` for authentication and file management.
- Uses JWT stored in a cookie for authentication and `multer` for handling uploads (memory storage -> streamed to Cloudinary).

Key Features
- User registration, login, logout and `me` profile endpoint
- Authenticated file upload with metadata
- File listing, retrieval, search and deletion
- Cloudinary integration for media storage

Tech stack
- Node.js + Express
- MongoDB + Mongoose
- Cloudinary for media hosting
- JWT for auth, `multer` for uploads

Prerequisites
- Node.js (recommended >= 20)
- A running MongoDB instance or connection string
- Cloudinary account (cloud name, API key, API secret)

Install

```bash
npm install
```

Run (development)

```bash
npm run dev
```

Run (production)

```bash
npm start
```

Tests & linting

```bash
npm test
npm run lint
```

Required environment variables

Provide these variables in a `.env` file or the environment. The app will throw if any are missing (unless `NODE_ENV=test`):

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret used to sign JWT tokens
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Cloudinary API key
- `CLOUDINARY_API_SECRET` — Cloudinary API secret

Optional environment variables (defaults shown)

- `PORT` — server port (default `5000`)
- `JWT_EXPIRES_IN` — JWT lifetime (default `15m`)
- `COOKIE_NAME` — access token cookie name (default `access_token`)
- `CLIENT_URL` — frontend origin for CORS (default `http://localhost:5173`)
- `MAX_FILE_SIZE_MB` — maximum upload size in MB (default `50`)

API Endpoints (summary)

- `POST /api/auth/register` — create a new user (body: `name`, `email`, `password`)
- `POST /api/auth/login` — log in (body: `email`, `password`) — sets auth cookie
- `GET /api/auth/me` — get current user profile (requires auth)
- `POST /api/auth/logout` — clear auth cookie

- `POST /api/files/upload` — upload a file (multipart `file` field) (requires auth)
- `GET /api/files` — list files (requires auth)
- `GET /api/files/search?term=...` — search files by metadata
- `GET /api/files/:id` — get file metadata (and signed URL)
- `DELETE /api/files/:id` — delete file (requires auth)

Examples

Upload (with cookie-based auth):

```bash
curl -X POST -F "file=@/path/to/image.jpg" -b cookiefile -c cookiefile http://localhost:5000/api/files/upload
```

Get profile (authenticated):

```bash
curl -b cookiefile http://localhost:5000/api/auth/me
```

Project files of interest

- `src/server.js` — server bootstrap
- `src/config/env.js` — environment and validation logic
- `src/routes/authRoutes.js` — auth routes
- `src/routes/fileRoutes.js` — file routes
- `src/controllers` — controller implementations

Deployment notes
- Ensure environment variables are set for production (MongoDB, Cloudinary, JWT secret).
- Consider using the included `docker-compose.yml` at the repo root for simple multi-service setups.

Troubleshooting
- If you see missing env variable errors, verify your `.env` file and that `NODE_ENV` is not `test`.
- Check Cloudinary credentials if uploads fail.


Real-time notifications (WebSocket)
---------------------------------

- Where: after a successful upload the backend emits a per-user notification from `src/controllers/fileController.js` by calling `emitUploadNotification(...)`.
- Socket server: `src/socket.js` sets up a Socket.IO server and uses rooms named `user:<userId>`.
- Event: `upload:notification` is emitted to the user's room with payload `{ userId, file, message }`.
- Debug/test endpoint: for development there is an unprotected helper `POST /api/debug/notify` (see `src/routes/debugRoutes.js`) that accepts JSON `{ userId, message }` and will emit a notification to the given user room.

Quick local test

1. Start backend (dev):

```bash
cd backend
npm run dev
```

2. Start the frontend (dev) and open the Dashboard, or use a Node client that connects and joins a user room.

3. Trigger a test notification from the backend (replace `u_test` with the current user's id):

```bash
curl -s -X POST -H "Content-Type: application/json" \
	-d '{"userId":"u_test","message":"Hello from test"}' \
	http://localhost:5001/api/debug/notify
```

4. The connected client in the `user:u_test` room should receive the `upload:notification` event and the Dashboard will display a temporary notice.

Security note
- The debug endpoint is intended for development only. Remove or protect it before deploying to production.


Loom video link: https://www.loom.com/share/1e9b5a3082d94a769773c28aa446bb4f
