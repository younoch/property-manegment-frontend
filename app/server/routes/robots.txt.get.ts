import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const robotsTxt = `# www.robotstxt.org/
# https://www.robotstxt.org/robotstxt.html

User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /settings/

# Sitemaps
Sitemap: https://www.leasedirector.com/sitemap.xml`

  event.node.res.setHeader('content-type', 'text/plain')
  return robotsTxt
})
