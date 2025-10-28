# Property Management Frontend

A modern property Management application built with Nuxt.js 3 and Nuxt UI 3.

## 🚀 Features

- **Authentication System**: Complete user registration, login, and role-based access control
- **Modern UI**: Built with Nuxt UI 3 components and Tailwind CSS
- **TypeScript**: Full TypeScript support for better development experience
- **Responsive Design**: Mobile-first responsive design
- **Role-Based Access**: Support for tenants, landlords, property managers, and super admins

## 🔐 Authentication System

This application implements a secure authentication system using **Pinia stores** for state management and HttpOnly cookies for secure authentication, as provided by your backend. The system includes:

### Authentication Flow
1. **User Registration** (`/auth/signup`) - Create new accounts with role selection
2. **User Login** (`/auth/login`) - Secure authentication with email/password
3. **Dashboard** (`/dashboard`) - Protected area for authenticated users
4. **Automatic Redirects** - Smart routing based on authentication status

### User Roles
- **Tenant**: Can view properties and submit maintenance requests
- **Landlord**: Can manage properties and view tenant information
- **Property Manager**: Can handle day-to-day operations
- **Super Admin**: Full system access and user management

### State Management with Pinia
- **User Store** (`app/stores/user.ts`) - Manages user data, roles, and session state
- **Auth Store** (`app/stores/auth.ts`) - Handles authentication logic and API calls
- **Global Access** - User data accessible throughout the application
- **Persistent Storage** - User data persists across page refreshes
- **Reactive Updates** - Automatic UI updates when store state changes

### Security Features
- HttpOnly cookie-based authentication (no client-side token storage)
- Automatic token refresh
- Route protection with middleware
- Role-based access control

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Backend API running (default: http://localhost:3000)

### Installation
```bash
# Install dependencies
pnpm install

# Set environment variables (optional)
cp .env.example .env
# Edit .env with your backend URL

# Start development server
pnpm dev
```

### Environment Variables
Create a `.env` file in the root directory:
```env
# Backend API Configuration
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## 📁 Project Structure

```
property-manegment-frontend/
├── app/                  # Main application directory (Nuxt 4 structure)
│   ├── app.vue          # Main app component
│   ├── pages/           # Application pages
│   │   ├── auth/        # Authentication pages
│   │   │   ├── login.vue
│   │   │   └── register.vue
│   │   ├── dashboard.vue # Main dashboard
│   │   ├── unauthorized.vue # Access denied page
│   │   ├── demo.vue      # Authentication demo page
│   │   ├── index.vue     # Landing page
│   │   └── about.vue     # About page
│   ├── layouts/          # Page layouts
│   │   └── auth.vue      # Authentication layout
│   ├── stores/           # Pinia stores
│   │   ├── user.ts       # User state management
│   │   └── auth.ts       # Authentication state management
│   ├── components/       # Vue components
│   │   └── UserProfile.vue # User profile component example
│   ├── middleware/       # Route middleware
│   │   ├── auth.ts       # Authentication guard
│   │   └── guest.ts      # Guest-only routes
│   ├── plugins/          # Nuxt plugins
│   │   ├── auth.client.ts # Client-side auth initialization
│   │   └── pinia.client.ts # Pinia store initialization
│   ├── config/           # Configuration files
│   │   └── api.ts        # API configuration
│   └── assets/           # Static assets (CSS, images)
├── nuxt.config.ts        # Nuxt configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── package.json          # Dependencies and scripts
├── config.example.ts     # Environment configuration example
└── README.md             # Project documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Backend API base URL
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Optional: Override default port
# NUXT_PORT=3000

# Optional: Environment
# NODE_ENV=development
```

**Note:** The backend URL has been updated to `http://localhost:8000/` to match your backend configuration.

**Important:** The old `useAuth` composable has been replaced with Pinia stores (`useUserStore` and `useAuthStore`) for better state management and global access to user data.

You can also copy `config.example.ts` to create your own configuration file.

### Backend API
Update the API base URL in `app/config/api.ts` or set the `NUXT_PUBLIC_API_BASE_URL` environment variable to match your backend server.

### Authentication Endpoints
The system expects these backend endpoints:
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/signout` - User logout
- `POST /auth/refresh` - Token refresh
- `GET /auth/whoami` - Get current user

## 🚀 Usage

### Using Pinia Stores

The application uses Pinia stores for global state management. Here's how to use them:

#### User Store
```typescript
// In any component
const { 
  currentUser, 
  isLoggedIn, 
  userRole, 
  hasRole, 
  isAdmin,
  displayName 
} = useUserStore();

// Check user role
if (hasRole('landlord')) {
  // Show landlord-specific content
}

// Access user data
const userName = displayName;
const userEmail = currentUser?.email;
```

#### Auth Store
```typescript
// In any component
const { 
  signin, 
  signout, 
  checkAuth, 
  isAuthenticating, 
  currentError 
} = useAuthStore();

// Login
const result = await signin({ email, password });

// Logout
await signout();

// Check authentication status
await checkAuth();
```

### Development
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Testing Authentication
1. Visit `/auth/signup` to create a new account
2. Use `/auth/login` to sign in with existing credentials
3. Access `/dashboard` to view the protected area
4. Test role-based access with different user accounts

## 🎨 UI Components

This application uses Nuxt UI 3, which provides:
- Pre-built components (UButton, UCard, UInput, etc.)
- Consistent design system
- Responsive layouts
- Accessibility features
- Dark mode support (can be enabled)

## 🔒 Security Notes

- **No Client-Side Token Storage**: Tokens are managed via HttpOnly cookies
- **Automatic Token Refresh**: Backend handles token refresh automatically
- **Route Protection**: Middleware ensures authenticated access to protected routes
- **Role-Based Access**: Users can only access features appropriate to their role

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend allows requests from your frontend domain
2. **Authentication Failing**: Check that `credentials: 'include'` is set in requests
3. **TypeScript Errors**: These are expected in Nuxt.js due to auto-imports

### Debug Mode
Enable Nuxt devtools for debugging:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true }
})
```

## 📚 API Documentation

For detailed API specifications, refer to your backend's Swagger documentation at `/api`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Need Help?** Check the backend API documentation or create an issue in the repository.
