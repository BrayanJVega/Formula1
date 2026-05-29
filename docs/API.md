# API Documentation

Base URL: `/api`

## Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "f1fan",
  "password": "Password123"
}

Response 201:
{
  "user": { "id": "uuid", "email": "...", "username": "...", "role": "user" },
  "accessToken": "jwt...",
  "refreshToken": "jwt..."
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}

Response 200: { "user": {...}, "accessToken": "...", "refreshToken": "..." }
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "jwt..."
}

Response 200: { "accessToken": "...", "refreshToken": "..." }
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <accessToken>
Response 200: { "user": {...} }
```

### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json
{ "email": "user@example.com" }
Response 200: { "message": "Password reset email sent if account exists" }
```

### Logout
```http
POST /auth/logout
Response 200: { "message": "Logged out successfully" }
```

## Error Responses

```json
// 400 Validation Error
{ "error": "Validation failed", "details": { "email": ["Invalid email format"] } }

// 401 Unauthorized
{ "error": "Invalid email or password" }

// 403 Forbidden
{ "error": "Admin access required" }

// 404 Not Found
{ "error": "Resource not found" }

// 429 Rate Limited
{ "error": "Too many requests, please try again later" }

// 500 Internal Server Error
{ "error": "Internal server error" }
```

## Rate Limiting

| Endpoint Group | Limit |
|---------------|-------|
| `/auth/*` | 10 requests / 15 min |
| All other `/api/*` | 100 requests / 15 min |
