import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';

export default function CookieNotice() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory">
      <section className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-warm-bronze block mb-2">
            Governance &amp; Transparency
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal">Cookie Notice</h1>
          <p className="text-xs text-charcoal/60 mt-2">
            Effective Draft &middot; <em>Subject to formal legal counsel review</em>
          </p>
        </div>

        <div className="bg-champagne/15 border-l-4 border-warm-bronze p-4 mb-10 text-xs sm:text-sm text-charcoal/85 leading-relaxed rounded-r-sm">
          <strong>Plain-Language Summary:</strong> This website does <strong>not</strong> use advertising pixels, behavioral profiling cookies, or third-party marketing analytics trackers. We use only strictly necessary browser storage needed for security and authorized administrator sessions.
        </div>

        <div className="space-y-9 text-charcoal/85 leading-relaxed text-sm md:text-base">
          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">1. What Cookies &amp; Browser Storage Are</h2>
            <p>
              Cookies and browser local storage are small data entries stored by your web browser to help websites function reliably, maintain session security, and remember technical state while you browse.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">2. What This Website Actually Uses</h2>
            <p className="mb-3">For ordinary public visitors browsing our informational pages and submitting Contact or Demo Kit forms:</p>
            <ul className="list-disc pl-5 space-y-2 text-charcoal/80">
              <li>
                <strong>No Marketing or Tracking Cookies:</strong> We do not load Google Analytics, Meta/Facebook pixels, LinkedIn Insight tags, or third-party advertising cookies.
              </li>
              <li>
                <strong>Strictly Necessary Functional State:</strong> Your browser temporarily holds standard React application state in memory during form submission (for example, preventing duplicate button clicks while a request is in progress).
              </li>
              <li>
                <strong>Administrator Authentication Storage (Admin Portal Only):</strong> If an authorized GiantGreen EcoTech administrator signs in at the restricted <code>/admin/login</code> portal, Supabase Auth stores an encrypted authentication session token in browser storage solely to verify administrator identity. Public visitors never receive authentication tokens.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">3. External Links</h2>
            <p>
              Our website provides links to external communication services (such as WhatsApp) or optional scheduling links. Once you navigate away from this site to a third-party service, that service&rsquo;s own cookie and privacy policies apply.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">4. Managing Browser Storage &amp; Contact</h2>
            <p className="mb-3">
              You can clear or block cookies and local site storage at any time through your browser settings. If we introduce optional analytics in the future, this notice will be updated accordingly. For questions, please contact:
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
            <Link to="/terms" className="hover:text-charcoal underline">
              Terms of Use
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
