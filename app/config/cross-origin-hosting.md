# 🌍 Cross-Origin Hosting Guide
# Frontend and Backend on Different Hosting Servers

## 🎯 **Your Hosting Scenario**
```
Frontend: https://yourapp.com (Vercel/Netlify/AWS S3)
Backend:  https://yourbackend.com (DigitalOcean/AWS EC2/Heroku)
```

## ⚠️ **Challenges & Solutions**

### **Challenge 1: CORS Configuration**
**Problem**: Browsers block cross-origin requests by default
**Solution**: Proper CORS setup on backend

### **Challenge 2: Cookie Management**
**Problem**: Cookies can't be shared across different domains
**Solution**: Set cookies for frontend domain from backend

### **Challenge 3: Security Headers**
**Problem**: Cross-origin requests need special security considerations
**Solution**: Proper SameSite and Secure cookie flags

## 🔧 **Backend Configuration (NestJS)**

### **1. CORS Setup (main.ts)**
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Essential CORS configuration for different domains
  app.enableCors({
    origin: [
      'https://yourapp.com',
      'https://www.yourapp.com',
      'http://localhost:3000' // Development
    ],
    credentials: true, // Required for cookies
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
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
```

### **2. Authentication Controller (auth.controller.ts)**
```typescript
@Post('/signin')
async signin(@Body() body: SigninDto, @Res({ passthrough: true }) res: Response): Promise<SigninResponseDto> {
  const user = await this.authService.signin(body.email, body.password);
  const login = this.authService.issueLoginResponse(user);
  
  // Cross-origin cookie configuration
  const frontendDomain = process.env.FRONTEND_DOMAIN || 'yourapp.com';
  
  res.setHeader('Set-Cookie', [
    `access_token=${login.accessToken}; HttpOnly; Secure; SameSite=None; Domain=${frontendDomain}; Path=/`,
    `refresh_token=${login.refreshToken}; HttpOnly; Secure; SameSite=None; Domain=${frontendDomain}; Path=/`
  ]);
  
  // Essential CORS headers for each response
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', `https://${frontendDomain}`);
  
  return login;
}

@Post('/signout')
async signout(@Res({ passthrough: true }) res: Response): Promise<any> {
  const frontendDomain = process.env.FRONTEND_DOMAIN || 'yourapp.com';
  
  // Clear cookies by setting expired values
  res.setHeader('Set-Cookie', [
    `access_token=; HttpOnly; Secure; SameSite=None; Domain=${frontendDomain}; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    `refresh_token=; HttpOnly; Secure; SameSite=None; Domain=${frontendDomain}; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  ]);
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', `https://${frontendDomain}`);
  
  return { success: true };
}
```

### **3. Environment Variables (.env)**
```bash
# Backend environment variables
FRONTEND_DOMAIN=yourapp.com
BACKEND_DOMAIN=yourbackend.com
NODE_ENV=production
```

## 🎨 **Frontend Configuration (Nuxt.js)**

### **1. Environment Variables (.env.production)**
```bash
NODE_ENV=production
NUXT_PUBLIC_FRONTEND_DOMAIN=yourapp.com
NUXT_PUBLIC_BACKEND_DOMAIN=yourbackend.com
NUXT_PUBLIC_API_BASE_URL=https://yourbackend.com
```

### **2. API Client Configuration**
```typescript
// app/utils/api.ts
export class ApiClient {
  constructor() {
    this.config = useApiConfig();
  }

  async get<T>(endpoint: string, options: Omit<RequestInit, 'method'> = {}): Promise<T> {
    const { API_CONFIG } = this.config;
    return await $fetch<T>(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'GET',
      credentials: 'include', // Essential for cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
  }
}
```

### **3. Authentication Store Updates**
```typescript
// app/stores/auth.ts
async checkAuth() {
  const userStore = useUserStore();
  const apiClient = createApiClient();
  
  this.setLoading(true);
  this.clearError();
  
  try {
    // For cross-origin, we need to make the API call
    // Cookies will be sent automatically by the browser
    const response = await apiClient.get<any>('/auth/whoami');
    
    if (response) {
      userStore.setUser(response as any);
      userStore.persistToStorage();
      this.updateLastAuthCheck();
      return { success: true, user: response };
    }
  } catch (error: any) {
    userStore.clearUser();
    userStore.clearStorage();
    const errorMessage = error.data?.message || error.message || 'Authentication check failed';
    this.setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    this.setLoading(false);
  }
}
```

## 🔒 **Security Considerations**

### **1. HTTPS Required**
- Both domains must use HTTPS
- SameSite=None cookies require Secure flag
- No HTTP in production

### **2. Cookie Security**
```typescript
// Secure cookie settings for cross-origin
const cookieOptions = {
  httpOnly: true,        // Prevent XSS attacks
  secure: true,          // HTTPS only
  sameSite: 'none',      // Required for cross-origin
  domain: frontendDomain, // Set for frontend domain
  path: '/',             // Available on all paths
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};
```

### **3. CORS Security**
```typescript
// Only allow specific origins
const allowedOrigins = [
  'https://yourapp.com',
  'https://www.yourapp.com'
];

app.enableCors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
});
```

## 🧪 **Testing Cross-Origin Setup**

### **1. Browser Network Tab**
- Check for OPTIONS preflight requests
- Verify CORS headers in responses
- Confirm cookies are being set

### **2. Console Logs**
- Look for CORS errors
- Check cookie accessibility
- Verify authentication flow

### **3. Common Issues & Solutions**
```typescript
// Issue: CORS preflight fails
// Solution: Handle OPTIONS requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', 'https://yourapp.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
  } else {
    next();
  }
});

// Issue: Cookies not being set
// Solution: Check domain and SameSite settings
res.setHeader('Set-Cookie', [
  `access_token=${token}; HttpOnly; Secure; SameSite=None; Domain=yourapp.com; Path=/`
]);
```

## 🚀 **Deployment Checklist**

### **Backend:**
- [ ] CORS properly configured
- [ ] Cookie domain set to frontend domain
- [ ] SameSite=None for cross-origin
- [ ] Secure flag enabled (HTTPS)
- [ ] Environment variables set

### **Frontend:**
- [ ] Environment variables configured
- [ ] API base URL points to backend
- [ ] Credentials included in requests
- [ ] Error handling for CORS issues

### **Infrastructure:**
- [ ] Both domains use HTTPS
- [ ] DNS properly configured
- [ ] SSL certificates valid
- [ ] Firewall allows cross-origin requests

## 📊 **Performance Considerations**

### **1. Preflight Requests**
- OPTIONS requests add latency
- Consider caching CORS headers
- Use maxAge to reduce preflight

### **2. Cookie Size**
- Keep tokens reasonably sized
- Consider token compression
- Monitor cookie storage limits

### **3. Network Latency**
- Choose hosting locations close to users
- Use CDN for frontend assets
- Consider API caching strategies

## 🎯 **Final Notes**

Cross-origin hosting is **absolutely achievable** and commonly used in production. The key is:

1. **Proper CORS configuration** on backend
2. **Correct cookie settings** for cross-origin
3. **HTTPS everywhere** in production
4. **Thorough testing** before deployment

This setup gives you the flexibility to choose the best hosting provider for each service while maintaining security and functionality!
