# Hosting Configuration Guide

## 🏠 **Development Setup (Recommended)**

```bash
# Frontend: localhost:3000
# Backend:  localhost:3000 (same port)
# Cookies:  Work perfectly, no CORS issues

# Environment variables:
NODE_ENV=development
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## 🌍 **Production Scenarios**

### **Scenario 1: Same Domain Hosting (Recommended)**

```bash
# Frontend: https://yourapp.com
# Backend:  https://yourapp.com/api
# Cookies:  Work perfectly, most secure

# Environment variables:
NODE_ENV=production
NUXT_PUBLIC_FRONTEND_DOMAIN=yourapp.com
NUXT_PUBLIC_BACKEND_DOMAIN=yourapp.com
```

**Backend Cookie Settings:**
```typescript
res.setHeader('Set-Cookie', [
  `access_token=${token}; HttpOnly; Secure; SameSite=Strict; Domain=.yourapp.com; Path=/`,
  `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Domain=.yourapp.com; Path=/`
]);
```

### **Scenario 2: Subdomain Hosting**

```bash
# Frontend: https://app.yourdomain.com
# Backend:  https://api.yourdomain.com
# Cookies:  Work with subdomain cookies

# Environment variables:
NODE_ENV=production
NUXT_PUBLIC_FRONTEND_DOMAIN=app.yourdomain.com
NUXT_PUBLIC_BACKEND_DOMAIN=api.yourdomain.com
```

**Backend Cookie Settings:**
```typescript
res.setHeader('Set-Cookie', [
  `access_token=${token}; HttpOnly; Secure; SameSite=Strict; Domain=.yourdomain.com; Path=/`,
  `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Domain=.yourdomain.com; Path=/`
]);
```

### **Scenario 3: Different Domains (Complex)**

```bash
# Frontend: https://yourapp.com
# Backend:  https://yourbackend.com
# Cookies:  Require special CORS setup

# Environment variables:
NODE_ENV=production
NUXT_PUBLIC_FRONTEND_DOMAIN=yourapp.com
NUXT_PUBLIC_BACKEND_DOMAIN=yourbackend.com
```

**Backend Cookie Settings:**
```typescript
res.setHeader('Set-Cookie', [
  `access_token=${token}; HttpOnly; Secure; SameSite=None; Domain=yourapp.com; Path=/`,
  `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=None; Domain=yourapp.com; Path=/`
]);

// CORS headers required
res.setHeader('Access-Control-Allow-Credentials', 'true');
res.setHeader('Access-Control-Allow-Origin', 'https://yourapp.com');
```

## 🚀 **Deployment Recommendations**

### **Best Choice: Same Domain Hosting**
- ✅ **Simplest setup** - No CORS complications
- ✅ **Most secure** - Strict SameSite cookies
- ✅ **Best performance** - No cross-origin overhead
- ✅ **Easier maintenance** - Single domain to manage

### **Good Choice: Subdomain Hosting**
- ✅ **Scalable** - Separate services
- ✅ **Secure** - Subdomain cookies work well
- ⚠️ **Medium complexity** - Need proper domain setup

### **Avoid: Different Domains**
- ❌ **Complex CORS setup** required
- ❌ **Security challenges** with cross-origin cookies
- ❌ **Performance overhead** from preflight requests
- ❌ **Maintenance nightmare** for cookie policies

## 🔧 **Implementation Steps**

1. **Choose your hosting scenario**
2. **Set environment variables**
3. **Configure backend cookies accordingly**
4. **Test authentication flow**
5. **Deploy and verify**

## 📝 **Environment File Example**

Create `.env` file in your project root:

```bash
# Development
NODE_ENV=development
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Production (update with your domains)
NODE_ENV=production
NUXT_PUBLIC_FRONTEND_DOMAIN=yourapp.com
NUXT_PUBLIC_BACKEND_DOMAIN=yourapp.com
```
