# Hypermarketplace Frontend — Deployment Guide

This guide details how to build and deploy the React 19 + TypeScript frontend application to production hosting platforms.

---

## 1. Prerequisites & Required Environment Variables

The frontend application requires **only one** environment variable:

| Environment Variable | Description | Example Value |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | The public base URL of the deployed Spring Boot backend. Do not include a trailing slash. | `https://api.yourdomain.com` or `http://192.168.1.100:8080` |

> [!IMPORTANT]
> Because Vite embeds environment variables into the static bundle during `npm run build`, **`VITE_API_BASE_URL` must be set in your build environment before running the build step**.

---

## 2. Production Build

To build the static bundle for production:

```bash
cd frontend
npm ci
npm run build
```

This compiles TypeScript (`tsc -b`) and bundles assets via Vite into the `dist/` folder:
- `dist/index.html` — Single Page App entry point
- `dist/assets/index-*.js` — Minified React application bundle
- `dist/assets/index-*.css` — Minified stylesheet

---

## 3. Recommended Hosting Options

### Option A: Vercel (Recommended for SPAs)

1. Connect your Git repository to Vercel.
2. In the project settings, configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add the environment variable:
   - `VITE_API_BASE_URL` = `https://your-backend-api.com`
4. Add a `vercel.json` (or rewrite rule in Vercel UI) to handle client-side routing:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
5. Click **Deploy**.

---

### Option B: Netlify

1. In Netlify, select **Add new site** > **Import an existing project**.
2. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
3. Under **Site configuration > Environment variables**, add:
   - `VITE_API_BASE_URL` = `https://your-backend-api.com`
4. Create `frontend/public/_redirects` to handle React Router client-side routing:
   ```
   /*    /index.html   200
   ```
5. Trigger deploy.

---

### Option C: Nginx / Docker (Colocated with Backend or VPS)

If hosting the frontend alongside the Spring Boot backend on a VPS or container:

1. Create a production `Dockerfile`:
   ```dockerfile
   # Stage 1: Build static assets
   FROM node:22-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   ARG VITE_API_BASE_URL
   ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
   RUN npm run build

   # Stage 2: Serve via Nginx
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. Accompanying `nginx.conf`:
   ```nginx
   server {
       listen 80;
       server_name _;
       root /usr/share/nginx/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

---

## 4. Backend CORS Checklist

Before launching production traffic, verify your Spring Boot backend's `application.properties` (or `CORS_ALLOWED_ORIGINS` environment variable) includes your frontend production URL:

```properties
# Backend application.properties or environment variable
cors.allowed-origins=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

---

## 5. Local Verification of Production Build

You can verify that the built distribution connects properly to your backend before uploading:

```bash
cd frontend
# Build with target API
npm run build

# Preview static files locally on port 4173
npm run preview
```
Visit `http://localhost:4173` to test the production bundle against the active backend.
