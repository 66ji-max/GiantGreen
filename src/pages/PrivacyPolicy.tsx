import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory">
      <section className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-warm-bronze block mb-2">
            Governance & Compliance
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal">Privacy Policy</h1>
          <p className="text-xs text-charcoal/50 mt-2">
            Last Updated: November 2026 &middot; <em>Draft for commercial presentation (subject to formal legal counsel review)</em>
          </p>
        </div>

        <div className="bg-champagne/10 border-l-4 border-warm-bronze p-4 mb-8 text-xs text-charcoal/80 leading-relaxed">
          <strong>Notice:</strong> This privacy statement is provided by {siteConfig.legalName} to outline our data practices regarding our B2B website, product inquiries, and Demo Kit evaluation requests.
        </div>

        <div className="space-y-8 text-charcoal/80 leading-relaxed text-sm md:text-base">
          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">1. Overview & Scope</h2>
            <p>
              This Privacy Policy applies to personal and corporate information collected through this website ({siteConfig.name}), specifically via our contact forms, Demo Kit evaluation requests, and direct communication channels (email and WhatsApp). Our services and products are designed primarily for commercial hospitality operators, hoteliers, procurement directors, and management companies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">2. Information We Collect</h2>
            <p className="mb-2">We collect information that you voluntarily provide to us when submitting an inquiry or requesting an evaluation kit:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-charcoal/70">
              <li><strong>Contact Information:</strong> Full name, corporate email address, and telephone or WhatsApp contact number.</li>
              <li><strong>Property & Business Details:</strong> Hotel or property name, corporate hotel group/chain affiliation, country/territory, and estimated room/suite counts.</li>
              <li><strong>Meeting & Evaluation Preferences:</strong> Preferred meeting format (e.g., Google Meet, Teams, WhatsApp, phone, or in-person) and specific operational inquiries or pilot timeline notes.</li>
              <li><strong>Technical Metadata:</strong> Standard web server logs (including timestamp and truncated IP address for anti-abuse and rate-limiting purposes).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">3. How We Use Your Information</h2>
            <p className="mb-2">We use collected corporate and contact details strictly for legitimate business purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-charcoal/70">
              <li>To evaluate, process, and coordinate the dispatch of JYANTY Demo Kits to verified hotel properties.</li>
              <li>To respond to your inquiries and arrange executive introductory calls or product presentations.</li>
              <li>To communicate terms, pilot agreements, or operational updates regarding our amenity systems.</li>
              <li>To prevent fraudulent submissions, spam, and unauthorized use of our request system.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">4. Information Sharing & Third Parties</h2>
            <p>
              We do not sell, rent, or trade your personal or business information to third-party advertisers or data brokers. Information is shared only with trusted operational providers strictly necessary to fulfill our services (for example, courier services for physical sample delivery or communication infrastructure providers).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">5. Data Retention & Security</h2>
            <p>
              We implement reasonable administrative and technical safeguards to protect your submitted information from unauthorized access, alteration, or loss. Request records are retained only for as long as necessary to facilitate ongoing business dialogue and pilot arrangements.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">6. Your Rights</h2>
            <p>
              You have the right to request access to the information we hold about you, request corrections, or ask us to delete your contact details from our inquiry records at any time.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif text-charcoal mb-3">7. Contact Information</h2>
            <p>
              If you have any questions or requests regarding this Privacy Policy or your data, please contact our team at:
            </p>
            <div className="mt-3 p-4 bg-white border border-soft-sand/40 rounded text-sm space-y-1">
              <p><strong>{siteConfig.legalName}</strong></p>
              <p>Email: <a href={siteConfig.contact.emailMailto} className="underline text-charcoal">{siteConfig.contact.email}</a></p>
              <p>Operations: Malaysia ({siteConfig.contact.phoneDisplay})</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-soft-sand/40 flex justify-between items-center text-xs text-charcoal/60">
          <Link to="/" className="hover:text-charcoal underline">
            &larr; Back to Home
          </Link>
          <div className="space-x-4">
            <Link to="/terms" className="hover:text-charcoal underline">Terms of Use</Link>
            <Link to="/cookies" className="hover:text-charcoal underline">Cookie Notice</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
