# backend
````markdown
# backend

## Setup

1. Go to project folder

> cd backend

2. Install Dependencies

> npm run setup

3. Create a `.env` with the following variables (example):

```
MONGODB_URI=mongodb://username:password@host:port/dbname
PORT=5000
JWT_SECRET=your_jwt_secret
# FRONTEND URL shown to users (used for redirects)
CLIENT_URL=http://localhost:5173

# CORS: set comma-separated production origins (example for production):
# CORS_ORIGIN=https://rsherbal.shop,https://www.rsherbal.shop

# Google OAuth (create credentials in Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
# This must match the callback URL you register with Google, e.g.:
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Optional: set COOKIE_DOMAIN to share cookies across subdomains (example: .rsherbal.shop)
COOKIE_DOMAIN=
```

## Run (development)

1. Start Server

> npm start

2. Open in url or using an Endpoint tester (postman)

> http://127.0.0.1:3000/

## Production checklist (Vercel frontend, Render backend)

- On Google Cloud Console (APIs & Services → Credentials) update your OAuth client:
	- Authorized redirect URIs:
		- `https://rsherbal.shop/api/auth/google/callback`
		- `https://www.rsherbal.shop/api/auth/google/callback`
	- Authorized JavaScript origins:
		- `https://rsherbal.shop`
		- `https://www.rsherbal.shop`

- In your Render backend environment variables, set:
	- `NODE_ENV=production`
	- `CLIENT_URL=https://rsherbal.shop`
	- `CORS_ORIGIN=https://rsherbal.shop,https://www.rsherbal.shop`
	- `GOOGLE_CALLBACK_URL=https://rsherbal.shop/api/auth/google/callback`
	- `JWT_SECRET` to a long random secret
	- `COOKIE_DOMAIN=.rsherbal.shop` (if you want cookies shared across `www` / root domain)

- In Vercel, ensure your frontend is served from `https://rsherbal.shop` (or set custom domain) and that any environment variables referencing the backend point to the Render domain/API base URL.

- Ensure TLS/HTTPS is enabled for both Vercel and Render (required for `Secure` cookies and SameSite=None).

- After deployment, remove any development-only CORS allowances or temporary redirect shims.

````