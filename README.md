# PostAI Frontend

Static frontend for PostAI SaaS application.

## Render Deployment

### Static Site Configuration

- **Environment**: Static Site
- **Build Command**: (leave empty)
- **Publish Directory**: `.` (root directory)

The frontend will be served as a static site. Make sure to configure the backend URL if needed.

### Connecting to Backend

The frontend will try to connect to the backend API. If your backend is deployed on Render, you can:

1. Use the backend's Render URL directly in the fetch call
2. Or configure a reverse proxy/rewrite rule in Render

Update the `API_URL` in `index.html` if your backend is on a different domain.

## Local Development

Simply open `index.html` in a browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

