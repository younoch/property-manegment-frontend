import { writeFileSync, readFileSync } from 'fs'

// Load app version from package.json
let version = '0.0.0'
try {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))
  version = pkg?.version || version
} catch {
  // keep default
}

// Environment and commit information from CI/ENV
const env = process.env.NODE_ENV || 'production'
const commit = process.env.COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || 'N/A'

// Constants
const appName = 'LeaseDirector'
const builtAt = new Date().toISOString()
const sitemapUrl = 'https://www.leasedirector.com/sitemap.xml'

// Standardized reboot.txt content
const rebootContent = [
  `Status: OK`,
  `App: ${appName}`,
  `Env: ${env}`,
  `Version: ${version}`,
  `Commit: ${commit}`,
  `BuiltAt: ${builtAt}`,
  `Sitemap: ${sitemapUrl}`,
  `Note: LeaseDirector sitemap and metadata refreshed.`,
  ''
].join('\n')

writeFileSync('./public/reboot.txt', rebootContent)
console.log('✅ reboot.txt standardized and updated.')

// Ensure robots.txt has correct directives for crawlers and sitemap
const robotsContent = `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`
writeFileSync('./public/robots.txt', robotsContent)
console.log('✅ robots.txt ensured/updated.')
