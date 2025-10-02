<!-- File: pages/privacy.vue -->
<template>
  <div class="min-h-screen bg-white text-gray-900 relative overflow-hidden">
    <!-- Decorative background (subtle) -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary-300/30 blur-3xl rounded-full"></div>
      <div class="absolute top-40 -right-24 w-[28rem] h-[28rem] bg-teal-200/30 blur-3xl rounded-full"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-white to-white"></div>
    </div>

    <section class="container mx-auto px-4 pt-2 md:pt-20">
      <div class="max-w-4xl mx-auto">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-extrabold">Privacy Policy</h1>
          <p class="mt-3 text-gray-600">Effective date: {{ effectiveDate }}</p>
          <p class="mt-2 text-gray-700 max-w-2xl mx-auto">This Privacy Policy explains how <strong>LeaseTrack</strong> ("we", "us", or "our") collects, uses, and safeguards information when you use our websites and services.</p>
        </div>

        <!-- Highlights -->
        <div class="mt-8 grid md:grid-cols-3 gap-4">
          <div class="p-5 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
            <h3 class="font-semibold">We respect your data</h3>
            <p class="text-sm text-gray-600 mt-1">Only what’s needed to run the product—no selling of personal data.</p>
          </div>
          <div class="p-5 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
            <h3 class="font-semibold">Security by design</h3>
            <p class="text-sm text-gray-600 mt-1">Encryption in transit, backups, least‑privilege access, and audit trails.</p>
          </div>
          <div class="p-5 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
            <h3 class="font-semibold">You’re in control</h3>
            <p class="text-sm text-gray-600 mt-1">Access, correct, export, or delete your personal data at any time.</p>
          </div>
        </div>

        <!-- TOC -->
        <nav class="mt-10 p-5 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
          <h3 class="font-semibold">In this policy</h3>
          <ul class="mt-2 text-sm text-primary-700 grid sm:grid-cols-2 gap-y-1">
            <li><a href="#info-we-collect" class="hover:underline">1. Information we collect</a></li>
            <li><a href="#how-we-use" class="hover:underline">2. How we use information</a></li>
            <li><a href="#legal-bases" class="hover:underline">3. Legal bases</a></li>
            <li><a href="#sharing" class="hover:underline">4. Sharing & processors</a></li>
            <li><a href="#cookies" class="hover:underline">5. Cookies & analytics</a></li>
            <li><a href="#retention" class="hover:underline">6. Data retention</a></li>
            <li><a href="#security" class="hover:underline">7. Security</a></li>
            <li><a href="#international" class="hover:underline">8. International transfers</a></li>
            <li><a href="#your-rights" class="hover:underline">9. Your rights</a></li>
            <li><a href="#children" class="hover:underline">10. Children</a></li>
            <li><a href="#changes" class="hover:underline">11. Changes</a></li>
            <li><a href="#contact" class="hover:underline">12. Contact us</a></li>
          </ul>
        </nav>

        <!-- Sections -->
        <PolicySection id="info-we-collect" title="1. Information we collect">
          <ul class="list-disc ms-5 text-gray-700 space-y-2">
            <li><strong>Account data</strong>: name, email, password (hashed), role, organization/portfolio details.</li>
            <li><strong>Billing data</strong>: plan, invoices, transaction references (processed by our payment provider; we do not store card numbers).</li>
            <li><strong>Product data</strong>: properties/units, leases, tenants, invoices, payments, documents you upload.</li>
            <li><strong>Usage & device data</strong>: IP address, browser/OS, pages viewed, actions (for security and product improvements).</li>
            <li><strong>Support data</strong>: messages you send via forms, chat, or email, and related attachments.</li>
          </ul>
        </PolicySection>

        <PolicySection id="how-we-use" title="2. How we use information">
          <ul class="list-disc ms-5 text-gray-700 space-y-2">
            <li>Provide and maintain the service (authentication, core features, backups).</li>
            <li>Process billing and account administration.</li>
            <li>Detect, prevent, and respond to fraud, abuse, or security incidents.</li>
            <li>Improve the product (e.g., troubleshooting, analytics, new features).</li>
            <li>Communicate with you (service updates, transactional emails, support).</li>
            <li>Comply with legal obligations and enforce our <NuxtLink to="/terms" class="text-primary-700 underline">Terms</NuxtLink>.</li>
          </ul>
        </PolicySection>

        <PolicySection id="legal-bases" title="3. Legal bases (GDPR/UK GDPR)">
          <ul class="list-disc ms-5 text-gray-700 space-y-2">
            <li><strong>Contract</strong>: to deliver the service you signed up for.</li>
            <li><strong>Legitimate interests</strong>: to secure our platform and improve features, balanced with your privacy.</li>
            <li><strong>Consent</strong>: for optional communications or certain cookies/analytics where required.</li>
            <li><strong>Legal obligation</strong>: to meet regulatory and tax requirements.</li>
          </ul>
        </PolicySection>

        <PolicySection id="sharing" title="4. Sharing & processors">
          <p class="text-gray-700">We do not sell personal data. We share limited information with trusted <em>processors</em> that help us operate the service, under data processing agreements. Typical categories include:</p>
          <ul class="list-disc ms-5 text-gray-700 space-y-2 mt-2">
            <li>Cloud hosting and storage</li>
            <li>Email delivery and customer support tools</li>
            <li>Payment processing and subscription management</li>
            <li>Analytics and error monitoring</li>
          </ul>
          <p class="text-gray-700 mt-2">We may disclose information if required by law or to protect the rights, property, or safety of LeaseTrack, our users, or the public.</p>
        </PolicySection>

        <PolicySection id="cookies" title="5. Cookies & analytics">
          <p class="text-gray-700">We use cookies and similar technologies to keep you signed in, remember preferences, and understand product usage. Where required, we will request consent before setting non‑essential cookies. You can control cookies via your browser settings.</p>
        </PolicySection>

        <PolicySection id="retention" title="6. Data retention">
          <p class="text-gray-700">We retain personal data for as long as your account is active or as needed to provide the service. After account closure, we retain only what is necessary for legitimate business or legal purposes, then delete or anonymize data safely.</p>
        </PolicySection>

        <PolicySection id="security" title="7. Security">
          <ul class="list-disc ms-5 text-gray-700 space-y-2">
            <li>Encryption in transit (HTTPS)</li>
            <li>Backups and disaster recovery</li>
            <li>Least‑privilege access and audit logs</li>
            <li>Secure development practices and vulnerability patching</li>
          </ul>
          <p class="text-gray-700 mt-2">No method of transmission or storage is 100% secure, but we work to protect your information using commercially reasonable safeguards.</p>
        </PolicySection>

        <PolicySection id="international" title="8. International transfers">
          <p class="text-gray-700">Your data may be processed in countries outside your own. Where required, we use appropriate safeguards (such as Standard Contractual Clauses) to protect your information when it is transferred internationally.</p>
        </PolicySection>

        <PolicySection id="your-rights" title="9. Your rights">
          <p class="text-gray-700">Depending on your location, you may have rights to:</p>
          <ul class="list-disc ms-5 text-gray-700 space-y-2 mt-2">
            <li>Access a copy of your personal data</li>
            <li>Correct or update inaccurate data</li>
            <li>Delete data or restrict processing (subject to legal exceptions)</li>
            <li>Object to processing based on legitimate interests</li>
            <li>Port data in a structured, machine‑readable format</li>
            <li>Withdraw consent where processing relies on consent</li>
          </ul>
          <p class="text-gray-700 mt-2">To exercise these rights, contact us at <NuxtLink to="#contact" class="text-primary-700 underline">privacy@leasetrack.app</NuxtLink>. We will verify your request and respond within applicable timeframes.</p>
        </PolicySection>

        <PolicySection id="children" title="10. Children">
          <p class="text-gray-700">LeaseTrack is not intended for individuals under 16. We do not knowingly collect personal data from children. If you believe a child has provided us data, contact us and we will take appropriate action.</p>
        </PolicySection>

        <PolicySection id="changes" title="11. Changes to this policy">
          <p class="text-gray-700">We may update this Privacy Policy from time to time. We will post the updated version here and indicate the new effective date. For significant changes, we may provide additional notice (e.g., email or in‑app message).</p>
        </PolicySection>

        <PolicySection id="contact" title="12. Contact us">
          <div class="text-gray-700 space-y-1">
            <p><strong>Email:</strong> privacy@leasetrack.app</p>
            <p><strong>Support:</strong> <NuxtLink to="/contact" class="text-primary-700 underline">Contact form</NuxtLink></p>
            <p><strong>Legal & Terms:</strong> <NuxtLink to="/terms" class="text-primary-700 underline">Terms of Service</NuxtLink></p>
            <p><strong>Status:</strong> <NuxtLink to="/status" class="text-primary-700 underline">Status page</NuxtLink></p>
          </div>
        </PolicySection>

        <!-- Final note -->
        <div class="mt-10 p-5 rounded-2xl bg-primary-50 border border-primary-200 text-primary-900">
          <p class="text-sm">If anything here is unclear, please reach out. We’re happy to explain how we handle data in your specific use case.</p>
        </div>

        <div class="h-10"/>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { useHead } from '#imports'

definePageMeta({ layout: 'public' })

useHead({
  title: 'LeaseTrack — Privacy Policy',
  meta: [
    { name: 'description', content: 'How LeaseTrack collects, uses, and protects your information. Learn about data, security, cookies, retention, rights, and contact details.' }
  ]
})

const effectiveDate = 'August 30, 2025'

const PolicySection = defineComponent({
  name: 'PolicySection',
  props: { id: String, title: String },
  template: `
    <section :id="id" class='mt-10'>
      <div class='p-6 md:p-7 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm'>
        <h2 class='text-xl md:text-2xl font-bold'>{{ title }}</h2>
        <div class='mt-3'><slot /></div>
      </div>
    </section>
  `
})
</script>

<style scoped>
/* keep policy page calm and readable */
</style>
