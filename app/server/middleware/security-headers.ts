import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const responseHeaders = event.node.res.getHeaders()
  
  // Security headers
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  }

  // Set headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (!responseHeaders[key.toLowerCase()]) {
      event.node.res.setHeader(key, value)
    }
  })
  
  // Remove X-Powered-By header if present
  if (responseHeaders['x-powered-by']) {
    event.node.res.removeHeader('x-powered-by')
  }
  
  return
})
