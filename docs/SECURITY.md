# Security Documentation

## JWT Token Handling

### Token Structure

- **Access token**: Short-lived (15 min default), stored in localStorage
- **Refresh token**: Long-lived (7 days), stored in httpOnly cookie + localStorage

### Implementation

```typescript
// Server: JwtProvider (server/src/infrastructure/auth/JwtProvider.ts)
// Tokens are signed with HMAC-SHA256 using separate secrets

// Client: Axios interceptor auto-refreshes on 401
// See client/src/api/client.ts for retry logic
```

### Best Practices

- Access tokens are sent via `Authorization: Bearer <token>` header
- Refresh tokens use httpOnly cookies when available
- On 401 response, the client attempts a single silent refresh
- If refresh fails, tokens are cleared and user is redirected to `/login`
- Tokens contain `userId`, `email`, and `role` only (no sensitive data)

## Input Sanitization

### Server-Side Validation

- All inputs validated with **Zod schemas** before reaching use cases
- Express JSON body parser limited to 10kb (`express.json({ limit: '10kb' })`)
- Custom sanitization middleware strips dangerous content:

```typescript
// server/src/presentation/middleware/sanitize.middleware.ts
// Strips HTML tags, SQL-like injection patterns, and script content from inputs
```

### Client-Side Validation

- Zod schemas mirrored on client for immediate feedback
- Form inputs sanitized before submission

## Rate Limiting

### Configuration (server/src/config/rateLimit.ts)

| Endpoint Group | Window | Max Requests |
|---------------|--------|-------------|
| `/auth/*` | 15 minutes | 10 |
| All `/api/*` | 15 minutes | 100 |

### Auth-Specific Limits

- Login: 10 attempts per 15 minutes (prevents brute force)
- Registration: 10 attempts per 15 minutes (prevents account creation abuse)
- Password reset: 10 attempts per 15 minutes

## SQL Injection Prevention

- **All database queries use parameterized statements** (`$1`, `$2`, etc.)
- No string concatenation in SQL queries
- The `pg` library escapes all parameters natively

```typescript
// CORRECT (parameterized)
await query('SELECT * FROM users WHERE email = $1', [email]);

// INCORRECT (never do this)
await query(`SELECT * FROM users WHERE email = '${email}'`);
```

## XSS Protection

### Server-Side

- **Helmet middleware** sets security headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN` (or `DENY`)
  - `X-XSS-Protection: 0`
  - `Strict-Transport-Security` (when HTTPS)
  - `Content-Security-Policy` headers
- Input sanitization strips `<script>`, `onclick=`, `javascript:` patterns
- JSON responses are auto-escaped by Express/JSON

### Client-Side

- React's JSX auto-escapes output (prevents XSS by default)
- Avoid `dangerouslySetInnerHTML`
- User-generated content is rendered as text, not HTML

## CORS Configuration

```typescript
// server/src/config/cors.ts
export const corsOptions = {
  origin: env.CLIENT_URL,          // Only allow the specific client origin
  credentials: true,                // Allow cookies (refresh token)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

In production, set `CLIENT_URL` to the exact deployment URL. Avoid using wildcard (`*`) origins when credentials are enabled.

## Helmet Middleware

The server uses Helmet for HTTP security headers:

```typescript
// server/src/server.ts
app.use(helmet());
```

Helmet sets these headers by default:
- `Content-Security-Policy` - prevents XSS and data injection
- `X-Content-Type-Options` - prevents MIME-type sniffing
- `Strict-Transport-Security` - enforces HTTPS
- `X-Frame-Options` - prevents clickjacking
- `Referrer-Policy` - controls referrer headers

## Row Level Security (PostgreSQL)

RLS policies are defined in the database schema to enforce data isolation:

```sql
-- Enable RLS on tables
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own predictions
CREATE POLICY user_predictions ON predictions
  FOR ALL USING (user_id = current_setting('app.current_user_id')::UUID);

-- League members can see league data
CREATE POLICY league_members ON leagues
  FOR SELECT USING (
    id IN (SELECT league_id FROM league_members WHERE user_id = current_setting('app.current_user_id')::UUID)
  );
```

## Additional Security Measures

### Password Policy

- Minimum 8 characters
- Must contain at least one uppercase letter
- Must contain at least one number
- Passwords hashed with **bcrypt** (12 salt rounds)
- Rate-limited password reset attempts

### Session Management

- Server-side refresh token rotation (new token issued on each refresh)
- Old refresh tokens invalidated after use
- Logout clears both client-side and server-side tokens

### Error Handling

- Generic error messages to prevent information leakage:
  - Login: "Invalid email or password" (doesn't reveal which is wrong)
  - Password reset: "Password reset email sent if account exists"
- Stack traces never exposed in production (`NODE_ENV=production`)

### Dependency Security

```bash
# Audit dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Check outdated packages
npm outdated
```
