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
CLIENT_URL=http://localhost:5173

# Google OAuth (create credentials in Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
# This must match the callback URL you register with Google, e.g.:
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

## Run

1. Start Server

> npm start

2. Open in url or using an Endpoint tester (postman)

> http://127.0.0.1:3000/