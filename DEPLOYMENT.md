# Render Deployment Guide for PostAI Frontend

## Step 1: Create a New Static Site on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect your Git repository (postai-frontend)
4. Or use "Manual Deploy" and upload the files

## Step 2: Configure Static Site

- **Build Command**: (leave empty)
- **Publish Directory**: `.` (root directory)

## Step 3: Set Backend URL

Before deploying, update `config.js` or `index.html` with your backend URL:

```javascript
// In config.js or index.html
const BACKEND_URL = 'https://postai-backend.onrender.com/api';
```

Replace `postai-backend.onrender.com` with your actual backend service URL from Render.

## Step 4: Deploy

Click "Create Static Site" and Render will:
1. Deploy your static files
2. Provide a URL like: `https://postai-frontend.onrender.com`

## Step 5: Test End-to-End

1. Open your frontend URL
2. It should fetch data from the backend API
3. Check browser console for any CORS errors

## Troubleshooting

- **CORS errors**: Make sure backend has `cors` middleware enabled (already configured)
- **404 on API calls**: Verify backend URL in `config.js` is correct
- **Backend not responding**: Check backend service is running on Render

## Alternative: Same-Domain Setup

If you want frontend and backend on the same domain:
1. Deploy backend as a Web Service
2. Deploy frontend as a Static Site
3. Use Render's rewrite rules to proxy `/api/*` to backend
4. Update frontend to use relative paths: `const BACKEND_URL = '/api'`

