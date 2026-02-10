# Security Documentation

This document outlines the security features implemented in the WasteChain API.

## 🔒 Security Features

### 1. Helmet - HTTP Security Headers

Helmet helps secure Express apps by setting various HTTP headers. It's configured with:

- **Content Security Policy (CSP)**: Prevents XSS attacks by controlling which resources can be loaded
- **XSS Protection**: Enables browser's built-in XSS filter
- **MIME Type Sniffing Prevention**: Prevents browsers from interpreting files as different MIME types
- **Clickjacking Protection**: Prevents pages from being embedded in frames
- **HSTS**: HTTP Strict Transport Security for HTTPS enforcement

**Configuration**: Configured in `src/main.ts` with Swagger-compatible settings.

---

### 2. CORS (Cross-Origin Resource Sharing)

CORS is configured to control which origins can access the API.

**Features**:
- Configurable allowed origins via environment variable
- Credentials support enabled
- Allowed methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Custom headers support (Content-Type, Authorization, etc.)
- 24-hour preflight cache

**Configuration**:
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

**Default Origins** (if not configured):
- `http://localhost:3000`
- `http://localhost:5173`

---

### 3. Rate Limiting (Throttling)

Rate limiting protects the API from abuse, brute-force attacks, and DDoS attempts.

#### Global Rate Limit
- **Default**: 100 requests per minute
- **Configurable** via environment variables

#### Authentication Endpoints (Stricter Limits)
- **Login**: 5 attempts per minute
- **Google OAuth**: 10 attempts per minute
- **OTP Request**: 3 requests per minute (prevents SMS/WhatsApp abuse)
- **OTP Verify**: 5 attempts per minute
- **Authenticator Login**: 10 attempts per minute

#### Exempted Endpoints
- `/auth/profile` - Authenticated profile endpoint (rate limiting skipped)

**Configuration**:
```env
THROTTLE_TTL=60000        # Time window in milliseconds (default: 1 minute)
THROTTLE_LIMIT=100        # Max requests per window (default: 100)
```

**Response**: When rate limit is exceeded, API returns:
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

---

## 🔐 Authentication & Authorization

### JWT Authentication
- JWT tokens with configurable expiration (default: 1 hour)
- Bearer token authentication
- Token validation on protected routes

### Multiple Authentication Methods
1. **Email/Password** - Traditional authentication
2. **Google OAuth** - Social authentication
3. **WhatsApp OTP** - Phone-based authentication
4. **DID Authentication** - Decentralized identity
5. **Authenticator/TOTP** - Time-based one-time passwords

### Role-Based Access Control (RBAC)
- Roles: `HOUSEHOLD`, `COLLECTOR`, `RECYCLER`, `ADMIN`
- Role guards protect sensitive endpoints
- Custom decorators for role-based access

---

## 🛡️ Security Best Practices

### Password Security
- Passwords are hashed using bcrypt (10 rounds)
- Minimum password length: 6 characters
- Passwords never stored in plain text

### Token Security
- JWT secrets should be strong and stored in environment variables
- Tokens expire after 1 hour (configurable)
- Refresh token support (infrastructure ready)

### Input Validation
- All DTOs use `class-validator` for input validation
- SQL injection prevention via TypeORM parameterized queries
- XSS prevention via Helmet CSP headers

### Error Handling
- Generic error messages to prevent information leakage
- Detailed errors logged server-side only
- Consistent error response format

---

## 🔧 Environment Variables

### Required Security Variables

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id

# WhatsApp API (if using)
WHATSAPP_ACCESS_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
```

---

## 🚨 Security Headers

The following security headers are automatically set by Helmet:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy: [configured per environment]`

---

## 📊 Rate Limiting Details

### How It Works
1. Requests are tracked per IP address
2. Each endpoint has its own rate limit counter
3. Counters reset after the time window (TTL) expires
4. Exceeding limits returns HTTP 429 status

### Custom Rate Limits

To add custom rate limits to endpoints:

```typescript
import { Throttle } from '@nestjs/throttler';
import { SkipThrottle } from '../common/decorators/throttle.decorator';

@Controller('example')
export class ExampleController {
  // Custom rate limit: 10 requests per minute
  @Throttle({ limit: 10, ttl: 60000 })
  @Get('endpoint')
  getData() {
    // ...
  }

  // Skip rate limiting
  @SkipThrottle()
  @Get('public')
  getPublicData() {
    // ...
  }
}
```

---

## 🔍 Security Monitoring

### Logging
- All authentication attempts are logged
- Failed login attempts are tracked
- Rate limit violations are logged
- Security events are recorded in application logs

### Recommended Monitoring
- Monitor rate limit violations
- Track failed authentication attempts
- Alert on unusual traffic patterns
- Review security logs regularly

---

## 🚀 Production Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong, random value
- [ ] Set `CORS_ORIGIN` to your production frontend URLs only
- [ ] Configure `THROTTLE_LIMIT` based on expected traffic
- [ ] Enable HTTPS (required for HSTS)
- [ ] Review and adjust Helmet CSP policies
- [ ] Set `NODE_ENV=production`
- [ ] Disable database synchronization (`PG_SYNC=false`)
- [ ] Use strong database passwords
- [ ] Enable database SSL connections
- [ ] Set up proper firewall rules
- [ ] Configure backup and disaster recovery
- [ ] Set up monitoring and alerting
- [ ] Review and update dependencies regularly
- [ ] Implement proper secret management (e.g., AWS Secrets Manager)

---

## 📚 Additional Resources

- [NestJS Security Best Practices](https://docs.nestjs.com/security/authentication)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet Documentation](https://helmetjs.github.io/)
- [Rate Limiting Best Practices](https://www.cloudflare.com/learning/bots/what-is-rate-limiting/)

---

## 🐛 Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** create a public GitHub issue
2. Email security concerns to: [antonygatitu327@gmail.com ]
3. Include details about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

---

## 📝 Changelog

### 2026-01-27
- ✅ Implemented Helmet security headers
- ✅ Configured CORS with environment-based origins
- ✅ Added global rate limiting (100 req/min)
- ✅ Added strict rate limits for authentication endpoints
- ✅ Created security documentation

---

**Last Updated**: 2026-02-10
**Maintained By**: WasteChain Security Team
