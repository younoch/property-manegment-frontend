import { writeFileSync } from 'fs'

const content = `Last updated: ${new Date().toISOString()}
LeaseDirector sitemap and meta data refreshed.
`

writeFileSync('./public/reboot.txt', content)
console.log('✅ reboot.txt updated.')
