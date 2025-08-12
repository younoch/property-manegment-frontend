# 🔧 Backend Development Instructions for Option C

## 📋 **Overview**
This guide provides step-by-step instructions to configure your NestJS backend for **Option C: Different Hosting Servers** development setup.

## 🎯 **Current Setup**
- **Frontend**: `localhost:3000` (Nuxt.js)
- **Backend**: `localhost:8000` (NestJS)
- **Goal**: Enable cross-origin authentication with cookies

## 📝 **Step 1: Update Backend Environment File**

### **Add These Lines to Your Existing Backend `.env`:**
```bash
# Frontend Domain for Cookie Setting
FRONTEND_DOMAIN=localhost:3000
BACKEND_DOMAIN=localhost:8000

# Cookie Configuration
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
COOKIE_HTTP_ONLY=true
```

### **Your Complete Backend `.env` Should Look Like:**
```bash
# Generated Environment Configuration
# Generated on: 2025-08-07T19:22:03.823Z
# WARNING: Keep this file secure and never commit it to version control

# Database Configuration (PostgreSQL) - REQUIRED
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_NAME=property_rental_management_db
DB_SYNC=true
DB_SSL=false

JWT_ACCESS_SECRET=replace-with-strong-random-secret
JWT_ACCESS_EXPIRES_IN=15m

# Application Configuration
NODE_ENV=development
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173

# Frontend Domain for Cookie Setting (ADD THESE)
FRONTEND_DOMAIN=localhost:3000
BACKEND_DOMAIN=localhost:8000

# Cookie Configuration (ADD THESE)
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
COOKIE_HTTP_ONLY=true

# Test Configuration (Optional)
TEST_PASSWORD=testpassword123

# CSRF Configuration - OPTIONAL
CSRF_SECRET=your-csrf-secret-key
CSRF_TOKEN_EXPIRY_HOURS=24
```

## 🔧 **Step 2: Update main.ts (CORS Configuration)**

### **Replace or Update Your `main.ts`:**
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS configuration for different ports
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true, // Essential for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400, // 24 hours
  });
  
  await app.listen(process.env.PORT || 8000);
}
bootstrap();
```

## 🍪 **Step 3: Update auth.controller.ts (Cookie Settings)**

### **Update Your Signin Method:**
```typescript
@Post('/signin')
async signin(@Body() body: SigninDto, @Res({ passthrough: true }) res: Response): Promise<SigninResponseDto> {
  const user = await this.authService.signin(body.email, body.password);
  const login = this.authService.issueLoginResponse(user);
  
  // Development cookie configuration (different ports)
  res.setHeader('Set-Cookie', [
    `access_token=${login.accessToken}; HttpOnly; SameSite=Lax; Domain=${process.env.COOKIE_DOMAIN}; Path=/`,
    `refresh_token=${login.refreshToken}; HttpOnly; SameSite=Lax; Domain=${process.env.COOKIE_DOMAIN}; Path=/`
  ]);
  
  // CORS headers for development
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', `http://${process.env.FRONTEND_DOMAIN}`);
  
  return login;
}
```

### **Update Your Signout Method:**
```typescript
@Post('/signout')
async signout(@Res({ passthrough: true }) res: Response): Promise<any> {
  // Clear cookies for development
  res.setHeader('Set-Cookie', [
    `access_token=; HttpOnly; SameSite=Lax; Domain=${process.env.COOKIE_DOMAIN}; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    `refresh_token=; HttpOnly; SameSite=Lax; Domain=${process.env.COOKIE_DOMAIN}; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  ]);
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', `http://${process.env.FRONTEND_DOMAIN}`);
  
  return { success: true };
}
```

## 🧪 **Step 4: Test Your Backend**

### **Start Your Backend:**
```bash
# In your backend directory
npm run start:dev

# Should start on port 8000
# Check console for CORS configuration
```

### **Expected Console Output:**
```
[Nest] 1234   - 08/07/2025, 7:22:03 PM   [NestApplication] Nest application successfully started +0ms
[Nest] 1234   - 08/07/2025, 7:22:03 PM   [NestApplication] CORS enabled for origins: http://localhost:3000,http://localhost:3001,http://localhost:5173 +0ms
```

## ✅ **Step 5: Verify Configuration**

### **Check These Endpoints:**
- `POST /auth/signin` - Should set cookies and return CORS headers
- `GET /auth/whoami` - Should accept cookies from frontend
- `POST /auth/signout` - Should clear cookies properly

### **Expected Response Headers:**
```
Set-Cookie: access_token=eyJ...; HttpOnly; SameSite=Lax; Domain=localhost; Path=/
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: http://localhost:3000
```

## 🚨 **Common Issues & Solutions**

### **Issue 1: CORS Error**
```
Access to fetch at 'http://localhost:8000/auth/signin' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution**: Ensure CORS is enabled with `credentials: true`

### **Issue 2: Cookies Not Set**
```
❌ No auth cookies found - user not authenticated
```
**Solution**: Check cookie domain and SameSite settings

### **Issue 3: Preflight Request Fails**
```
OPTIONS http://localhost:8000/auth/signin 405 Method Not Allowed
```
**Solution**: Ensure OPTIONS method is included in CORS methods

## 🎯 **What This Configuration Achieves**

1. **Enables CORS** for cross-origin requests between ports 3000 and 8000
2. **Sets Cookies** for `localhost` domain (works across different ports)
3. **Handles Preflight** requests automatically
4. **Maintains Security** with proper CORS and cookie settings
5. **Prepares for Production** with environment-based configuration

## 🔒 **Security Notes for Development**

- **HttpOnly: true** - Prevents XSS attacks (JavaScript can't read cookies)
- **SameSite: Lax** - Allows cross-origin cookies in development
- **Secure: false** - Allows HTTP in development (localhost)
- **Domain: localhost** - Works across different ports on localhost

## 🚀 **Next Steps**

1. **Update your backend** with the configuration above
2. **Test the authentication flow** end-to-end
3. **Check browser console** for any CORS or cookie issues
4. **Verify cookies** are being set and read correctly

## 📚 **Additional Resources**

- **CORS Documentation**: [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- **Cookie Security**: [OWASP Cookie Security](https://owasp.org/www-community/vulnerabilities/HttpOnly)
- **NestJS CORS**: [NestJS Documentation](https://docs.nestjs.com/techniques/security#cors)

---

**Note**: This configuration is specifically for **development with different ports**. For production with different domains, additional security measures will be required.
