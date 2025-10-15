export default defineEventHandler((event) => {
    const host = getRequestHeader(event, 'host')
    const proto = getRequestHeader(event, 'x-forwarded-proto')
  
    // Redirect to HTTPS
    if (proto && proto !== 'https') {
      return sendRedirect(event, `https://${host}${event.path}`, 301)
    }
  
    // Redirect non-www to www
    if (host && !host.startsWith('www.')) {
      return sendRedirect(event, `https://www.${host}${event.path}`, 301)
    }
  })
  