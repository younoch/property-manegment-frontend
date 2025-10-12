// app/config/sitemap.config.ts

export const sitemapConfig = {
    hostname: 'https://www.leasedirector.com',
    gzip: true,
    path: '/sitemap.xml',
  
    // ✅ Public pages only
    routes: [
      '/',
      '/features',
      '/pricing',
      '/about',
      '/contact',
      '/privacy',
      '/terms',
      '/support'
    ],
  
    // 🚫 Exclude app-internal pages
    exclude: [
      '/dashboard/**',
      '/auth/**',
      '/leases/**',
      '/properties/**',
      '/tenants/**',
      '/units/**',
      '/users/**',
      '/maintenance/**',
      '/expenses/**',
      '/payments/**',
      '/messages/**',
      '/communication/**',
      '/settings/**',
      '/management/**',
      '/profile',
      '/test-stores',
      '/unauthorized',
      '/csrf-demo'
    ]
  }
  