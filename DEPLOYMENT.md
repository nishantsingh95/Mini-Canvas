# Deployment Guide - Mini Design Canvas

This guide explains how to deploy **Mini Design Canvas** to **Render** (Backend API) and **Vercel** (Next.js Frontend) using MongoDB Atlas.

---

## Architecture Overview
- **Database**: MongoDB Atlas (Cloud database)
- **Backend API**: Render or Railway (Node.js Express REST API)
- **Frontend App**: Vercel (Next.js 14 App Router)

---

## Step 1: Set up MongoDB Atlas (Database)

1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free M0 cluster (or use an existing cluster).
3. Under **Database Access**, create a database user with password.
4. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere, required for dynamic cloud host IPs like Render/Vercel).
5. Click **Connect** -> **Drivers** (Node.js) and copy the connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/mini_design_canvas?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository: `https://github.com/nishantsingh95/Mini-Canvas`.
3. Configure the service settings:
   - **Name**: `mini-canvas-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Under **Environment Variables**, add:
   | Key | Value | Description |
   |---|---|---|
   | `NODE_ENV` | `production` | Production environment flag |
   | `PORT` | `5000` | Server listening port |
   | `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection URI |
   | `JWT_SECRET` | `your_secure_random_jwt_secret_key` | Secret key for auth tokens |
   | `JWT_EXPIRES_IN` | `7d` | Token expiry duration |
   | `CLIENT_ORIGIN` | `*` (or your Vercel URL) | Allowed CORS origins |

5. Click **Create Web Service**.
6. Once deployed, note down your Render backend URL (e.g. `https://mini-canvas-backend.onrender.com`).
   - Test it by opening `https://mini-canvas-backend.onrender.com/api/health` in your browser. It should return `{"status":"ok", ...}`.

---

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import the GitHub repository: `nishantsingh95/Mini-Canvas`.
3. In the project setup screen:
   - **Framework Preset**: Next.js (automatically detected)
   - **Root Directory**: Click **Edit** and choose `frontend`
4. Expand **Environment Variables** and add:
   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://mini-canvas-backend.onrender.com/api` |
   *(Ensure you append `/api` to your Render backend URL)*
5. Click **Deploy**.
6. Vercel will build and assign you a live production domain (e.g. `https://mini-canvas-xyz.vercel.app`).

---

## Step 4: Verification Checklist

- [ ] Open frontend URL: Canvas, 3D Toolbar, and isometric grid load smoothly.
- [ ] Test Auth: Register a new account or Sign In.
- [ ] Create & Save: Draw shapes, add text, click **Save to Cloud**.
- [ ] Reopen: Refresh and open saved canvas from **Open Canvases** modal.
- [ ] Export: Click **Export** -> **PNG Image** to verify canvas export.
