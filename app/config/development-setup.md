# 🚀 Development Setup for Different Hosting Servers

## 🎯 **Current Development Configuration**

Your frontend is now configured to work with **Option C: Different Hosting Servers** in development mode.

## 📁 **Environment Configuration**

### **Create `.env.development` file in your project root:**

```bash
# Development Environment - Different Hosting Servers
# Frontend: localhost:3000 (Nuxt.js)
# Backend:  localhost:8000 (NestJS) - Different port to simulate different hosting

NODE_ENV=development
NUXT_PUBLIC_FRONTEND_PORT=3000
NUXT_PUBLIC_BACKEND_PORT=8000
NUXT_PUBLIC_FRONTEND_DOMAIN=localhost:3000
NUXT_PUBLIC_BACKEND_DOMAIN=localhost:8000
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Cookie settings for development
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
COOKIE_HTTP_ONLY=false
```

## 🔧 **Backend Configuration Required**

### **1. Update your NestJS main.ts:**

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS configuration for development (different ports)
  app.enableCors({
    origin: [
      'http://localhost:3000',  // Frontend
      'http://localhost:3001',  // Alternative frontend port
      'http://127.0.0.1:3000'  // Alternative localhost
    ],
    credentials: true, // Essential for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-CSRF-Token',
      'Accept',
      'Origin'
    ],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400, // 24 hours
  });
  
  await app.listen(process.env.PORT || 8000);
}
bootstrap();
```

### **2. Update your auth.controller.ts:**

```typescript
@Post('/signin')
async signin(@Body() body: SigninDto, @Res({ passthrough: true }) res: Response): Promise<SigninResponseDto> {
  const user = await this.authService.signin(body.email, body.password);
  const login = this.authService.issueLoginResponse(user);
  
  // Development cookie configuration (different ports)
  res.setHeader('Set-Cookie', [
    `access_token=${login.accessToken}; HttpOnly; SameSite=Lax; Domain=localhost; Path=/`,
    `refresh_token=${login.refreshToken}; HttpOnly; SameSite=Lax; Domain=localhost; Path=/`
  ]);
  
  // CORS headers for development
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  
  return login;
}

@Post('/signout')
async signout(@Res({ passthrough: true }) res: Response): Promise<any> {
  // Clear cookies for development
  res.setHeader('Set-Cookie', [
    `access_token=; HttpOnly; SameSite=Lax; Domain=localhost; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    `refresh_token=; HttpOnly; SameSite=Lax; Domain=localhost; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  ]);
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  
  return { success: true };
}
```

### **3. Backend Environment Variables (.env):**

```bash
# Backend environment variables
PORT=8000
FRONTEND_DOMAIN=localhost:3000
BACKEND_DOMAIN=localhost:8000
NODE_ENV=development
```

## 🎨 **Frontend Configuration (Already Done)**

Your frontend is now configured to:
- ✅ **Detect cross-origin scenarios** automatically
- ✅ **Handle different ports** in development
- ✅ **Provide detailed logging** for debugging
- ✅ **Work with both same and different** hosting setups

## 🧪 **Testing Your Setup**

### **1. Start Your Backend:**
```bash
# In your backend directory
npm run start:dev
# Should start on port 8000
```

### **2. Start Your Frontend:**
```bash
# In your frontend directory (current)
npm run dev
# Should start on port 3000
```

### **3. Test Authentication:**
- Go to `/cookie-test` page
- Click "Check Cookie Access" to see cross-origin detection
- Try logging in at `/auth/login`
- Check browser console for detailed logs

## 🔍 **Expected Console Output:**

### **Before Login:**
```
⚠️ Cross-origin development detected
Frontend origin: http://localhost:3000
Backend origin: http://localhost:8000
Cross-origin cookies will require proper CORS setup
```

### **After Login (if working):**
```
✅ Auth cookie found: access_token = eyJhbGciOiJIUzI1NiIs...
✅ Authentication successful via cookie + user info
```

## 🚨 **Common Issues & Solutions:**

### **Issue 1: CORS Error**
```
Access to fetch at 'http://localhost:8000/auth/signin' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution**: Ensure your backend CORS is properly configured (see above)

### **Issue 2: Cookies Not Set**
```
❌ No auth cookies found - user not authenticated
```
**Solution**: Check backend cookie headers and CORS configuration

### **Issue 3: Preflight Request Fails**
```
OPTIONS http://localhost:8000/auth/signin 405 Method Not Allowed
```
**Solution**: Ensure OPTIONS method is handled in CORS configuration

## 🎯 **Next Steps:**

1. **Update your backend** with the CORS and cookie configuration above
2. **Set environment variables** in both frontend and backend
3. **Test the authentication flow** end-to-end
4. **Check console logs** for any issues
5. **Verify cookies** are being set and read correctly

## 🔒 **Security Notes for Development:**

- **HttpOnly: false** - Allows JavaScript access for debugging
- **SameSite: Lax** - More permissive for development
- **Secure: false** - Allows HTTP in development
- **Domain: localhost** - Works across different ports

## 🚀 **Production Migration:**

When you're ready for production, simply:
1. **Change environment variables** to your production domains
2. **Update backend CORS** to allow production frontend domain
3. **Set cookies** for your production frontend domain
4. **Enable HTTPS** and secure cookie flags

Your frontend will automatically adapt to the new configuration!
