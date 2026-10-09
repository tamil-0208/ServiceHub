# Hypermarketplace — Deployment Guide

This guide covers everything needed to build, configure, containerize, and deploy the Hypermarketplace Spring Boot backend.

---

## 1. Environment Variables Reference

All configurations and sensitive secrets are externalized via environment variables.

| Environment Variable | Required in Prod? | Default (Local Dev) | Description |
|---|:---:|---|---|
| `PORT` | No | `8080` | HTTP port for the backend server |
| `SPRING_PROFILES_ACTIVE` | No | `default` (or `prod`) | Active Spring profile (`prod` enables strict logging, no stack traces) |
| `MONGODB_URI` | **Yes** | `mongodb://localhost:27017/servicehub` | Full MongoDB connection string (e.g., MongoDB Atlas URI) |
| `JWT_SECRET` | **Yes** | `ServiceHubSecretKeyForDevelopmentOnly123456789` | 256-bit (minimum 32-character) secret key for signing JWTs |
| `JWT_EXPIRATION_MS` | No | `3600000` (1 hour) | JWT validity duration in milliseconds |
| `CORS_ALLOWED_ORIGINS` | **Yes** | `http://localhost:3000,http://localhost:5173` | Comma-separated list of allowed frontend origins (e.g. `https://hypermarketplace.com`) |
| `PLATFORM_COMMISSION_RATE` | No | `0.10` (10%) | Commission rate deducted from provider payout |
| `PAYMENT_GATEWAY_API_KEY` | Optional | `""` | API key for production payment gateway provider |
| `PAYMENT_GATEWAY_SECRET_KEY` | Optional | `""` | Secret key for production payment gateway provider |
| `ENABLE_SWAGGER` | No | `true` | Whether Swagger UI (`/swagger-ui.html`) is accessible |

---

## 2. Docker Containerization

The backend utilizes a **multi-stage Docker build** (`eclipse-temurin:21-jdk` for compilation, `eclipse-temurin:21-jre` for runtime) to generate a lightweight, secure container image running under a non-root `spring` user.

### 2.1 Build the Docker Image

Run from the `backend/` directory:

```bash
cd backend
docker build -t hypermarketplace-backend:latest .
```

### 2.2 Run the Container Locally

Run with local/containerized environment variables:

```bash
docker run -d \
  --name hypermarketplace-api \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e MONGODB_URI="mongodb://host.docker.internal:27017/servicehub" \
  -e JWT_SECRET="MySuperSecureProductionSecretKeyWithAtLeast32Chars123" \
  -e CORS_ALLOWED_ORIGINS="http://localhost:5173" \
  hypermarketplace-backend:latest
```

To view logs:
```bash
docker logs -f hypermarketplace-api
```

To stop and remove:
```bash
docker stop hypermarketplace-api && docker rm hypermarketplace-api
```

---

## 3. Pre-Production / Go-Live Checklist

Before deploying to production (e.g. AWS ECS, GCP Cloud Run, DigitalOcean, Render, Railway, Kubernetes), verify every item:

### 1. MongoDB Atlas Configuration
- [ ] Create a production cluster on **MongoDB Atlas** (or your managed MongoDB host).
- [ ] Create a dedicated database user with `readWrite` permissions on the `servicehub` database.
- [ ] Add the deployment host/VPC IP address to Network Access IP Whitelist (or allow 0.0.0.0/0 with strong authentication).
- [ ] Set `MONGODB_URI` environment variable with standard replica set format:
  ```
  mongodb+srv://<username>:<password>@cluster.mongodb.net/servicehub?retryWrites=true&w=majority
  ```

### 2. JWT Secret Rotation
- [ ] Generate a cryptographically secure 256-bit or 512-bit string (e.g., using `openssl rand -base64 64`).
- [ ] Set the `JWT_SECRET` environment variable in your production secrets manager.
- [ ] **Never commit production JWT secrets to Git.**

### 3. CORS & Security Hardening
- [ ] Set `CORS_ALLOWED_ORIGINS` to the exact production domain(s) of the frontend (e.g., `https://app.hypermarketplace.com`). Do not use `*`.
- [ ] Ensure `SPRING_PROFILES_ACTIVE=prod` is set so stack traces are suppressed in error responses.

### 4. Admin Account Initialization
- [ ] After initial startup against MongoDB Atlas, create your primary administrator user account by registering and manually setting `role: "ADMIN"` in the database.

### 5. Health & Monitoring
- [ ] Verify endpoint accessibility: `GET /api/categories` should return `200 OK`.
- [ ] Verify OpenAPI documentation: `GET /swagger-ui.html` (if `ENABLE_SWAGGER=true`).
