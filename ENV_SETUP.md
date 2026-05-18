# Environment Variables Setup Guide

This document outlines all required environment variables for deploying IvoryMist Ordering System in production.

## Backend (Render)

All these variables must be set in Render's Environment section:

### Database (Supabase)
- `SUPABASE_URL`: Your Supabase project URL
  - Format: `https://xxxxx.supabase.co`
  - Get from: Supabase Dashboard → Settings → API
  
- `SUPABASE_ANON_KEY`: Supabase anonymous/public key
  - Get from: Supabase Dashboard → Settings → API → anon key
  - Used by: Frontend for RLS-protected queries
  
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (privileged)
  - Get from: Supabase Dashboard → Settings → API → service_role key
  - Used by: Backend for admin operations bypassing RLS

### Server Configuration
- `PORT`: Server port (default: 5000)
  - Render sets this automatically, usually no need to change
  
- `ALLOWED_ORIGINS`: CORS-allowed origins (optional, uses defaults if not set)
  - Format: Comma-separated list
  - Example: `https://ivorymisterderingcafe.netlify.app,https://ivorymistorderingcafes.netlify.app`
  - Defaults to: localhost variants + both Netlify domains + Vercel

### Backend Server URL (for Client/Frontend)
- `RENDER_URL`: Your Render deployment URL (for reference/documentation)
  - Example: `https://ivorymist-mcs.onrender.com`
  - This is your backend API URL

## Frontend (Netlify)

### API Configuration
- `VITE_API_URL`: Backend API URL (optional, uses defaults if not set)
  - Format: `https://your-backend-url/api/v1`
  - Example: `https://ivorymist-mcs.onrender.com/api/v1`
  - Default behavior: Auto-detects localhost in development, uses Render in production

## Database (Supabase)

No environment variables needed for Supabase itself - it's cloud-hosted.
Your Supabase credentials (SUPABASE_URL, keys) are what you configure above.

## How to Get Your Supabase Credentials

1. Go to: https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL → `SUPABASE_URL`
   - `anon` public key → `SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`

## How to Set Environment Variables on Render

1. Go to: https://dashboard.render.com
2. Select your service (backend)
3. Go to: Environment
4. Add each variable:
   - Key: Variable name (e.g., `SUPABASE_URL`)
   - Value: The actual value
5. Click "Save"
6. Service will auto-redeploy

## How to Set Environment Variables on Netlify

1. Go to: https://app.netlify.com
2. Select your site
3. Go to: Site Settings → Build & Deploy → Environment
4. Add or edit variables
5. Site will auto-redeploy if deployed from Git

## Verification Checklist

- [ ] Render: `SUPABASE_URL` is set
- [ ] Render: `SUPABASE_ANON_KEY` is set
- [ ] Render: `SUPABASE_SERVICE_ROLE_KEY` is set
- [ ] Backend API responds at: `https://ivorymist-mcs.onrender.com/api/v1/health`
- [ ] Netlify: Frontend builds successfully
- [ ] Frontend can call backend API without CORS errors
- [ ] Menu page loads products
- [ ] Login page works
- [ ] Admin/Staff dashboards accessible after login

## Troubleshooting

### "500 Internal Server Error" on Backend
- Check: Are SUPABASE_URL and keys set on Render?
- Check: Run `curl https://ivorymist-mcs.onrender.com/api/v1/health`
- Check: Render deploy logs for error messages

### "CORS policy" error on Frontend
- Check: Are CORS origins configured correctly?
- Check: Is backend origin in `ALLOWED_ORIGINS`?
- Check: Is CORS middleware enabled in backend?

### Frontend shows "Loading..." forever
- Check: Is `VITE_API_URL` configured correctly on Netlify?
- Check: Can frontend reach backend? Test in browser console
- Check: Are there 401 errors in browser console?

### Products not loading from menu
- Check: Are Supabase credentials correct?
- Check: Does the `products` table exist in Supabase?
- Check: Does it have data?
- Run: `SELECT * FROM products;` in Supabase SQL editor

