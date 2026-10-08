# Telemetry Controller API

Embedded Controller Telemetry & Authentication Service built with Node.js and Express.

## Tech Stack
- **Runtime:** Node.js (>=20)
- **Framework:** Express
- **Auth:** JSONWebToken, Cookie-Parser, Helmet, CORS
- **Storage:** In-Memory JSON Store (Zero external database required)

## Quick Start
```bash
npm install
npm start
```
Server runs on `http://localhost:7200`.

## Endpoints
- `GET /api/dashboard` - 1 Hz real-time telemetry stream (Velocity, Pressure, Temperature) with 100-sample sliding buffer
- `POST /api/auth/validate-email` - Credential & session validation
- `POST /api/auth/login` - User authentication & signed cookie issue
- `GET /api/auth/profile` - Authenticated operator profile
- `GET /api/auth/logout` - Session invalidation
