# Hypermarketplace Frontend

Modern React 19 + TypeScript frontend application for Hypermarketplace, built with Vite, Axios, and React Router.

---

## 🚀 Environment Configuration

The application is completely decoupled from the Spring Boot backend and requires only a single environment variable to configure the target backend:

| Variable | Description | Local / Development | Production |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of the Hypermarketplace Spring Boot backend | `http://localhost:8080` | `https://api.yourdomain.com` (or your cloud container URL) |

### Setting Up Environment Variables

1. For local development, create or edit `.env` in the `frontend` root:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```
2. For production deployments (Vercel, Netlify, Cloudflare Pages, Docker), configure `VITE_API_BASE_URL` in the platform's Environment Variables settings panel before initiating the build.
3. Vite bakes variables prefixed with `VITE_` into the static JavaScript bundle at compile time.

---

## 🛠️ Development & Build Commands

All commands should be executed from the `frontend/` directory:

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Run TypeScript type check and compile production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 📦 Project Structure

```
frontend/
├── src/
│   ├── api/             # Centralized Axios client & API endpoints
│   ├── components/      # Reusable UI components
│   │   ├── admin/       # Admin-specific layout and components
│   │   ├── bookings/    # Booking modal & table rows
│   │   ├── common/      # ErrorBoundary, ProtectedRoute, Pagination, Loading
│   │   ├── layout/      # Navbar, Layout, Footer
│   │   ├── notifications/# In-app notification bell & dropdown
│   │   ├── providers/   # Provider cards & profiles
│   │   ├── reviews/     # Review modals & lists
│   │   └── services/    # Service listing cards
│   ├── context/         # AuthContext & ToastContext
│   ├── pages/           # Customer, Provider, and Admin route pages
│   └── types/           # Complete TypeScript DTO interfaces matching backend
├── dist/                # Production distribution build (generated via npm run build)
├── .env                 # Local environment configuration
└── DEPLOYMENT.md        # Production deployment documentation
```

---

## 🔒 Authentication & Role Security

- JWT tokens are automatically stored in `localStorage` upon login.
- Axios request interceptor attaches `Authorization: Bearer <token>` to all protected calls.
- Axios response interceptor redirects to `/login` upon `401 Unauthorized`.
- Client-side routes are guarded by `<ProtectedRoute allowedRoles={[...]}>` for `CUSTOMER`, `PROVIDER`, and `ADMIN` roles.
