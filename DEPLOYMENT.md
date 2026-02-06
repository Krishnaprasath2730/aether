# Aether Deployment Guide

## Issue: Private vs Public Environment
The Co-Browsing feature relies on **WebSockets**, which require a long-running server process. 
- **Localhost**: Works because your computer runs both the frontend and the backend server simultaneously.
- **Vercel**: Vercel is a *serverless* platform. It freezes/kills processes immediately after a request finishes. **It cannot host a WebSocket server.**

## Solution
We have separated the application into two parts:
1.  **Frontend** (Vercel)
2.  **Backend** (Render/Railway/Heroku)

---

## 🚀 Step 1: Deploy the Backend (WebSocket Server)

We recommend using **Render.com** (it has a free tier for Web Services).

1.  Push your latest code to GitHub.
2.  Sign up/Login to [Render.com](https://render.com).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository (`aether`).
5.  **Important Settings**:
    *   **Root Directory**: `backend` (This is crucial! Tell Render to look in the backend folder)
    *   **Runtime**: Node
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
6.  Click **Create Web Service**.
7.  Wait for it to deploy. Render will give you a valid URL (e.g., `https://aether-backend.onrender.com`).
    *   *Note: Your WebSocket URL will be `wss://aether-backend.onrender.com` (replace https with wss).*

---

## 🚀 Step 2: Configure Frontend (Vercel)

Now tell your Vercel frontend where to find the socket server.

1.  Go to your **Vercel Project Dashboard**.
2.  Navigate to **Settings** -> **Environment Variables**.
3.  Add a new variable:
    *   **Key**: `VITE_WS_URL`
    *   **Value**: `wss://<your-render-url-from-step-1>` (Example: `wss://aether-backend.onrender.com`)
4.  **Save**.
5.  **Redeploy** your Vercel project (Go to Deployments -> Redeploy) so it picks up the new variable.

---

## 💻 Local Development (New Workflow)

Since we separated the backend, you now need **two terminals** to run the app locally:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
*Server runs on port 8080*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The frontend will automatically fallback to `ws://localhost:8080` when `VITE_WS_URL` is not set.
