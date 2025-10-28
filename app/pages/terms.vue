<!-- File: pages/terms.vue -->
<template>
  <div class="min-h-screen bg-white text-gray-900 relative overflow-hidden">
    <!-- Decorative background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary-300/30 blur-3xl rounded-full"></div>
      <div class="absolute top-40 -right-24 w-[28rem] h-[28rem] bg-teal-200/30 blur-3xl rounded-full"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-white to-white"></div>
    </div>

    <section class="container mx-auto px-4 pt-2 md:pt-20">
      <div class="max-w-4xl mx-auto">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-extrabold">Terms & Conditions</h1>
          <p class="mt-3 text-gray-600">Effective date: {{ effectiveDate }}</p>
          <p class="mt-2 text-gray-700 max-w-2xl mx-auto">These Terms & Conditions ("Terms") govern your use of the LeaseDirector service. By using our platform, you agree to these Terms.</p>
        </div>

        <!-- TOC -->
        <nav class="mt-10 p-5 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
          <h3 class="font-semibold">Contents</h3>
          <ul class="mt-2 text-sm text-primary-700 grid sm:grid-cols-2 gap-y-1">
            <li><a href="#acceptance" class="hover:underline">1. Acceptance of Terms</a></li>
            <li><a href="#eligibility" class="hover:underline">2. Eligibility</a></li>
            <li><a href="#accounts" class="hover:underline">3. Accounts & Security</a></li>
            <li><a href="#subscriptions" class="hover:underline">4. Subscriptions & Billing</a></li>
            <li><a href="#use" class="hover:underline">5. Acceptable Use</a></li>
            <li><a href="#leases" class="hover:underline">6. Leases, Invoices, Payments</a></li>
            <li><a href="#intellectual" class="hover:underline">7. Intellectual Property</a></li>
            <li><a href="#termination" class="hover:underline">8. Termination</a></li>
            <li><a href="#disclaimers" class="hover:underline">9. Disclaimers</a></li>
            <li><a href="#liability" class="hover:underline">10. Limitation of Liability</a></li>
            <li><a href="#indemnity" class="hover:underline">11. Indemnification</a></li>
            <li><a href="#governing" class="hover:underline">12. Governing Law</a></li>
            <li><a href="#changes" class="hover:underline">13. Changes to Terms</a></li>
            <li><a href="#contact" class="hover:underline">14. Contact</a></li>
          </ul>
        </nav>

        <!-- Sections -->
        <TermsSection id="acceptance" title="1. Acceptance of Terms">
          <p class="text-gray-700">By creating an account or using LeaseDirector, you confirm that you accept and will comply with these Terms, our <NuxtLink to="/privacy" class="text-primary-700 underline">Privacy Policy</NuxtLink>, and any additional policies we provide.</p>
        </TermsSection>

        <TermsSection id="eligibility" title="2. Eligibility">
          <p class="text-gray-700">You must be at least 18 years old or the age of majority in your jurisdiction to use LeaseDirector. By registering, you represent that you meet these requirements.</p>
        </TermsSection>

        <TermsSection id="accounts" title="3. Accounts & Security">
          <ul class="list-disc ms-5 text-gray-700 space-y-2">
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You are responsible for all activities under your account.</li>
            <li>You must notify us immediately if you suspect unauthorized use.</li>
            <li>We may suspend or terminate accounts that violate these Terms.</li>
          </ul>
        </TermsSection>

        <TermsSection id="subscriptions" title="4. Subscriptions & Billing">
          <ul class="list-disc ms-5 text-gray-700 space-y-2">
            <li>Some features require a paid subscription.</li>
            <li>Billing cycles are monthly unless otherwise stated.</li>
            <li>All fees are non‑refundable except where required by law.</li>
            <li>You authorize us or our payment processor to charge your payment method.</li>
          </ul>
        </TermsSection>

        <TermsSection id="use" title="5. Acceptable Use">
          <p class="text-gray-700">You agree not to misuse LeaseDirector, including but not limited to:</p>
          <ul class="list-disc ms-5 text-gray-700 space-y-2 mt-2">
            <li>Attempting unauthorized access or security breaches.</li>
            <li>Using the service for unlawful, abusive, or fraudulent purposes.</li>
            <li>Uploading harmful or infringing content.</li>
            <li>Disrupting service integrity or performance.</li>
          </ul>
        </TermsSection>

        <TermsSection id="leases" title="6. Leases, Invoices, Payments">
          <p class="text-gray-700">LeaseDirector provides tools for landlords to manage leases, invoices, and payments. We are not a party to rental agreements. You are solely responsible for ensuring your use complies with applicable laws (e.g., rental regulations, tax obligations, deposit limits).</p>
        </TermsSection>

        <TermsSection id="intellectual" title="7. Intellectual Property">
          <p class="text-gray-700">All rights, title, and interest in LeaseDirector, including software, design, and branding, remain with us and our licensors. You receive a limited, non‑exclusive, non‑transferable license to use the service during your subscription.</p>
        </TermsSection>

        <TermsSection id="termination" title="8. Termination">
          <p class="text-gray-700">We may suspend or terminate your account if you breach these Terms, cause harm, or if required by law. You may terminate anytime by closing your account; prepaid fees are non‑refundable unless required by law.</p>
        </TermsSection>

        <TermsSection id="disclaimers" title="9. Disclaimers">
          <p class="text-gray-700">LeaseDirector is provided “as is” without warranties of any kind. We do not guarantee uninterrupted, error‑free service, or that defects will be corrected immediately.</p>
        </TermsSection>

        <TermsSection id="liability" title="10. Limitation of Liability">
          <p class="text-gray-700">To the maximum extent permitted by law, LeaseDirector and its affiliates are not liable for indirect, incidental, or consequential damages. Our total liability is limited to the fees paid by you in the 12 months before the claim.</p>
        </TermsSection>

        <TermsSection id="indemnity" title="11. Indemnification">
          <p class="text-gray-700">You agree to indemnify and hold harmless LeaseDirector, its officers, employees, and affiliates from any claims, damages, or expenses arising from your use of the service or violation of these Terms.</p>
        </TermsSection>

        <TermsSection id="governing" title="12. Governing Law">
          <p class="text-gray-700">These Terms are governed by and construed in accordance with the laws of your country of residence unless superseded by mandatory local law. Any disputes will be subject to the exclusive jurisdiction of the competent courts.</p>
        </TermsSection>

        <TermsSection id="changes" title="13. Changes to Terms">
          <p class="text-gray-700">We may update these Terms from time to time. We will post updates here and indicate the effective date. Significant changes may also be communicated by email or in‑app notices.</p>
        </TermsSection>

        <TermsSection id="contact" title="14. Contact">
          <div class="text-gray-700 space-y-1">
            <p><strong>Email:</strong> legal@leasedirector.app</p>
            <p><strong>Support:</strong> <NuxtLink to="/contact" class="text-primary-700 underline">Contact form</NuxtLink></p>
            <p><strong>Privacy:</strong> <NuxtLink to="/privacy" class="text-primary-700 underline">Privacy Policy</NuxtLink></p>
          </div>
        </TermsSection>

        <div class="mt-10 p-5 rounded-2xl bg-primary-50 border border-primary-200 text-primary-900">
          <p class="text-sm">If you have any questions about these Terms, please contact us before using the service.</p>
        </div>

        <div class="h-10"/>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports'
import TermsSection from '~/components/terms/TermsSection.vue'

const effectiveDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

useHead({
  title: 'Terms & Conditions | LeaseDirector: Property Management Software',
  meta: [
    { name: 'description', content: 'Terms & Conditions governing the use of LeaseDirector. Learn about accounts, subscriptions, acceptable use, liability, and legal details.' }
  ]
})
</script>

<style scoped>
</style>
