import { writeFileSync } from 'fs'

const content = `Last updated: ${new Date().toISOString()}
LeaseDirector sitemap and meta data refreshed.
`

writeFileSync('./public/reboot.txt', content)
console.log('✅ reboot.txt updated.')

// Ensure robots.txt has correct directives for crawlers and sitemap
const robotsContent = `User-agent: *\nAllow: /\nSitemap: https://www.leasedirector.com/sitemap.xml\n`
writeFileSync('./public/robots.txt', robotsContent)
console.log('✅ robots.txt ensured/updated.')
