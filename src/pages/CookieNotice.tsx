import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';

export default function CookieNotice() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory">
      <section className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-warm-bronze block mb-2">
            Governance & Transparency
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal">Cookie Notice</h1>
          <p className="text-xs text-charcoal/50 mt-2">
            Last Updated: November 2026 &middot; <em>Draft for commercial presentation</em>
          </p>
        </div>

        <div className="bg-champagne/10 border-l-4 border-warm-bronze p-4 mb-8 text-xs text-charcoal/80 leading-relaxed">
          <strong>Summary:</strong> We prioritize digital minimalism and user privacy. This website does not use invasive advertising trackers, third-party remarketing pixels, or cross-site tracking cookies.
        </div>

        <div className="space-y-8 text-charcoal/80 leading-relaxed text-sm md:text-base">
          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work properly, provide a secure environment, and remember basic preferences.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">2. How We Use Cookies & Local Technologies</h2>
            <p className="mb-2">Our website uses only essential and functional mechanisms:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-charcoal/70">
              <li>
                <strong>Strictly Necessary Technical Elements:</strong> Transient session states and security tokens that enable page navigation, form validation, and protection against automated bot submissions.
              </li>
              <li>
                <strong>User Preference Storage:</strong> Basic local memory (such as acknowledging notices or preserving form state during active navigation).
              </li>
              <li>
                <strong>Zero Third-Party Advertising Trackers:</strong> We do NOT employ third-party behavioral targeting cookies, marketing data brokers, or profiling networks on this website.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">3. Managing Cookies in Your Browser</h2>
            <p>
              Most web browsers automatically accept cookies by default, but you can configure your browser settings to block or delete cookies if you prefer. Please note that disabling essential technical cookies may affect certain interactive form features.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">4. Inquiries</h2>
            <p>
              If you have any questions regarding our website's technical privacy practices, please contact our team at:
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
            <Link to="/terms" className="hover:text-charcoal underline">Terms of Use</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
