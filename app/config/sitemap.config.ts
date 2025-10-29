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
      '/support',
      '/app/auth/login',
      '/auth/**',
    ],
  
    // 🚫 Exclude app-internal pages
    exclude: [
      '/app/**',
    ]
  }
  