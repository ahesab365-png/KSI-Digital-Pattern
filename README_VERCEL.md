# Vercel Deployment Guide

This project has been prepared for seamless deployment on Vercel.

## Deployment Options

### Option 1: Deploying as Separate Projects (Recommended)
1. **Backend**:
   - Push the code to GitHub.
   - Create a new project in Vercel and select the `backend` folder as the **Root Directory**.
   - Add the following environment variables:
     - `DB_URI`: Your MongoDB Atlas connection string.
     - `CLOUD_NAME`, `API_KEY`, `API_SECRET`: Your Cloudinary credentials.
     - `NODE_ENV`: `production`

2. **Frontend**:
   - Create another project in Vercel and select the `frontend` folder as the **Root Directory**.
   - Add the following environment variable:
     - `VITE_API_BASE_URL`: The URL of your deployed backend (e.g., `https://your-backend.vercel.app`).

### Option 2: Monorepo Deployment
You can also deploy from the root and configure Vercel to handle both, but separate projects are usually easier to manage for independent scaling and environment variables.

---

## Technical Changes Made:
- **Backend**:
  - Modified `src/app.bootstrap.js` to export the Express app for Serverless compatibility.
  - Added `vercel.json` to handle routing.
  - Updated `config/config.service.js` to support Vercel environment variables directly.
- **Frontend**:
  - Replaced hardcoded `localhost:7000` with `import.meta.env.VITE_API_BASE_URL`.
  - Prepared the app to interact with the production API.

---
**Developed by Antigravity AI**
