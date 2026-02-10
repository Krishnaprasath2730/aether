# Aether Deployment Guide

## Architecture

```
┌─────────────────────┐     HTTPS/WSS     ┌─────────────────────┐
│   Frontend (Vercel) │ ←───────────────→  │ Backend (Render)    │
│   React + Vite      │                    │ Express + WebSocket │
│                     │                    │ MongoDB Atlas       │
└─────────────────────┘                    └─────────────────────┘
```

- **Frontend** → Deployed on **Vercel** (static hosting, serverless)
- **Backend** → Deployed on **Render** (or Railway/Heroku) — supports WebSockets
- **Database** → **MongoDB Atlas** (cloud)

> **Why separate?** Vercel is serverless — it kills processes after each request,
> so it **cannot host WebSockets**. Co-Browsing requires persistent connections,
> hence the backend must run on a proper server like Render.

---

## 🚀 Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. Create a database user with a username and password.
3. Whitelist all IPs: `0.0.0.0/0` (Network Access → Add IP Address).
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/aether`

---

## 🚀 Step 2: Deploy the Backend (Render.com)

1. Push your code to **GitHub**.
2. Go to [Render.com](https://render.com) → **New +** → **Web Service**.
3. Connect your GitHub repo (`aether`).
4. Configure:
   | Setting          | Value                          |
   |------------------|--------------------------------|
   | **Root Directory** | `backend`                    |
   | **Runtime**        | Node                         |
   | **Build Command**  | `npm install && npm run build` |
   | **Start Command**  | `npm start`                  |

5. Add **Environment Variables** on Render (Settings → Environment):
   ```
   PORT=8080
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aether
   JWT_SECRET=<strong-random-string>
   FRONTEND_URL=https://your-app.vercel.app
   ```
   *(Add Google OAuth and Email vars if you use those features)*

6. Click **Create Web Service** → Wait for deployment.
7. You'll get a URL like: `https://aether-backend.onrender.com`
   - **API URL**: `https://aether-backend.onrender.com/api`
   - **WebSocket URL**: `wss://aether-backend.onrender.com`

---

## 🚀 Step 3: Deploy the Frontend (Vercel)

1. Go to [Vercel](https://vercel.com) → **Import Project** from GitHub.
2. Select the `aether` repo.
3. Configure:
   | Setting              | Value       |
   |----------------------|-------------|
   | **Root Directory**     | `frontend`  |
   | **Framework Preset**   | Vite        |
   | **Build Command**      | `npm run build` |
   | **Output Directory**   | `dist`      |

4. Add **Environment Variables** on Vercel (Settings → Environment Variables):
   ```
   VITE_API_URL=https://aether-backend.onrender.com/api
   ```
   > **Note:** `VITE_WS_URL` is optional! The frontend auto-derives it from `VITE_API_URL`.
   > Only set it if your WebSocket runs on a different URL.

5. **Deploy** → Your app is live!

---

## 💻 Local Development

For local development, you need **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run dev
```
→ Server runs on `http://localhost:8080` (API + WebSocket)

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```
→ Frontend runs on `http://localhost:5173`

> When no `VITE_API_URL` is set, the frontend automatically uses `http://localhost:8080/api`.
> When no `VITE_WS_URL` is set, WebSocket automatically connects to `ws://localhost:8080`.

---

## 🔗 How URLs Auto-Detect

The frontend uses smart URL detection with this priority:

### API URL (`api.service.ts`)
```
VITE_API_URL (env var) → http://localhost:8080/api (fallback)
```

### WebSocket URL (`CoBrowseContext.tsx`)
```
VITE_WS_URL (env var) → derived from VITE_API_URL → ws://localhost:8080 (fallback)
```

**Example:** If you set `VITE_API_URL=https://aether-backend.onrender.com/api`:
- API calls → `https://aether-backend.onrender.com/api/*`
- WebSocket → `wss://aether-backend.onrender.com` (auto-derived)

---

## ⚠️ Troubleshooting

### Co-Browsing doesn't work online
- Make sure the backend is deployed and running (check Render dashboard)
- Verify `VITE_API_URL` is set correctly in Vercel
- Check browser console for WebSocket connection errors
- Render free tier sleeps after 15min of inactivity — first connection may take 30-60s

### API calls fail after deployment
- Check that `VITE_API_URL` includes `/api` at the end
- **Redeploy** the Vercel project after adding/changing env vars
- Check CORS: backend uses `cors()` which allows all origins

### MongoDB connection fails
- Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access
- Double-check the connection string (username, password, cluster name)
