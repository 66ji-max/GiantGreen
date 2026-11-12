import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';

export default function TermsOfUse() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory">
      <section className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-warm-bronze block mb-2">
            Governance & Compliance
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal">Terms of Use</h1>
          <p className="text-xs text-charcoal/50 mt-2">
            Last Updated: November 2026 &middot; <em>Draft for commercial presentation (subject to formal legal counsel review)</em>
          </p>
        </div>

        <div className="bg-champagne/10 border-l-4 border-warm-bronze p-4 mb-8 text-xs text-charcoal/80 leading-relaxed">
          <strong>Notice:</strong> These terms govern the browsing of this website and the submission of B2B Demo Kit evaluation requests for {siteConfig.legalName}.
        </div>

        <div className="space-y-8 text-charcoal/80 leading-relaxed text-sm md:text-base">
          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you agree to comply with and be bound by these Terms of Use. If you do not agree with these terms, please do not use this site or submit inquiry requests.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">2. B2B Commercial Purpose</h2>
            <p>
              This website provides commercial product information regarding JYANTY amenity systems and hospitality solutions. The request mechanisms (such as Demo Kit requests) are intended exclusively for verified hospitality professionals, hotel general managers, procurement executives, and property owners. GiantGreen EcoTech reserves the right to verify credentials prior to sending physical demonstration materials.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">3. Intellectual Property Rights</h2>
            <p>
              All trademarks, product names, logos, editorial texts, design elements, graphics, and visual materials related to GiantGreen EcoTech and JYANTY are the intellectual property of {siteConfig.legalName} or its licensors. Unauthorized copying, modification, or commercial re-distribution without express written consent is prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">4. Product Specifications & Pilot Scope</h2>
            <p>
              Product descriptions, dimensions, and operational characteristics presented on this site are for informational purposes. Commercial pilot deployments, pricing schedules, replacement head distribution cycles, and specific custom branding options are governed by distinct bilateral commercial contracts between GiantGreen EcoTech and each participating hotel property.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">5. Disclaimer of Warranties</h2>
            <p>
              This website and its content are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, {siteConfig.legalName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or inability to use this website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">7. Modifications to Terms</h2>
            <p>
              We reserve the right to revise these Terms of Use at any time. Continued use of the website following any changes constitutes acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">8. Contact Us</h2>
            <p>
              For legal and commercial inquiries regarding these Terms, please contact:
            </p>
            <div className="mt-3 p-4 bg-white border border-soft-sand/40 rounded text-sm space-y-1">
              <p><strong>{siteConfig.legalName}</strong></p>
              <p>Email: <a href={siteConfig.contact.emailMailto} className="underline text-charcoal">{siteConfig.contact.email}</a></p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-soft-sand/40 flex justify-between items-center text-xs text-charcoal/60">
          <Link to="/" className="hover:text-charcoal underline">
            &larr; Back to Home
          </Link>
          <div className="space-x-4">
            <Link to="/privacy" className="hover:text-charcoal underline">Privacy Policy</Link>
            <Link to="/cookies" className="hover:text-charcoal underline">Cookie Notice</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
