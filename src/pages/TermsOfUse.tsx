import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';

export default function TermsOfUse() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory">
      <section className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-warm-bronze block mb-2">
            Governance &amp; Commercial Terms
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal">Terms of Use</h1>
          <p className="text-xs text-charcoal/60 mt-2">
            Effective Draft &middot; <em>Subject to formal legal counsel review</em>
          </p>
        </div>

        <div className="bg-champagne/15 border-l-4 border-warm-bronze p-4 mb-10 text-xs sm:text-sm text-charcoal/85 leading-relaxed rounded-r-sm">
          <strong>Notice:</strong> These Terms of Use govern access to the {siteConfig.name} website and the submission of business inquiries or Demo Kit evaluation requests to {siteConfig.legalName}.
        </div>

        <div className="space-y-9 text-charcoal/85 leading-relaxed text-sm md:text-base">
          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using this website, you agree to be bound by these Terms of Use. If you do not agree with these terms, please discontinue use of the website and do not submit inquiry forms.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">2. Intended B2B Hospitality Use</h2>
            <p>
              This website provides informational materials regarding JYANTY guest-room amenity systems for commercial hospitality properties. Demo Kit requests and pilot discussions are intended for verified hotel operators, general managers, procurement teams, and hospitality management groups. {siteConfig.legalName} reserves the right to review, verify, or decline any Demo Kit request at its sole discretion.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">3. Prohibited Conduct &amp; Submission Integrity</h2>
            <p>
              You agree not to submit false, misleading, or unauthorized third-party information, nor attempt to bypass rate limits, automated spam protections, or administrative access controls. Unauthorized scraping, automated bulk submissions, or attempts to access non-public administrative routes are strictly prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">4. Product Information &amp; Commercial Agreements</h2>
            <p>
              Content on this site does not constitute a binding commercial offer, price quote, or supply contract. Pricing, minimum quantities, shipping arrangements, pilot parameters, and recycling or closed-loop programs are governed solely by separate written agreements executed between {siteConfig.legalName} and the participating property.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">5. Intellectual Property</h2>
            <p>
              All brand names, product marks (including GiantGreen EcoTech and JYANTY), website copy, layout design, and visual assets displayed on this website remain the property of {siteConfig.legalName} or its respective licensors and may not be reproduced or redistributed commercially without prior written permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">6. Disclaimer &amp; Limitation of Liability</h2>
            <p>
              This website and its informational content are provided &ldquo;as is&rdquo; without express or implied warranties of any kind. To the extent permitted by applicable law, {siteConfig.legalName} shall not be liable for any indirect, incidental, or consequential damages arising from the use of or inability to access this website.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">7. Updates &amp; Contact</h2>
            <p className="mb-3">
              We may update these Terms of Use from time to time. Applicable governing law and formal dispute resolution clauses are subject to final company legal review. Questions regarding these terms may be sent to:
            </p>
            <div className="p-5 bg-white border border-soft-sand/40 rounded-sm text-sm space-y-1.5 shadow-sm">
              <p className="font-semibold text-charcoal">{siteConfig.legalName}</p>
              <p>
                Email:{' '}
                <a href={siteConfig.contact.emailMailto} className="underline text-warm-bronze hover:text-espresso-brown font-medium break-all">
                  {siteConfig.contact.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-soft-sand/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-charcoal/65">
          <Link to="/" className="hover:text-charcoal underline">
            &larr; Back to Home
          </Link>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="hover:text-charcoal underline">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="hover:text-charcoal underline">
              Cookie Notice
            </Link>
            <Link to="/contact" className="hover:text-charcoal underline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
