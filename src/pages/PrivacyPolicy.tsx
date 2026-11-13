import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory">
      <section className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-warm-bronze block mb-2">
            Governance &amp; Data Protection
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal">Privacy Policy</h1>
          <p className="text-xs text-charcoal/60 mt-2">
            Effective Draft &middot; <em>Subject to formal legal counsel review and company policy finalization</em>
          </p>
        </div>

        <div className="bg-champagne/15 border-l-4 border-warm-bronze p-4 mb-10 text-xs sm:text-sm text-charcoal/85 leading-relaxed rounded-r-sm">
          <strong>Overview:</strong> This Privacy Policy explains how {siteConfig.legalName} (&ldquo;GiantGreen EcoTech&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) collects, stores, uses, and protects personal and corporate information submitted through our website, Contact form, and Demo Kit evaluation request form.
        </div>

        <div className="space-y-9 text-charcoal/85 leading-relaxed text-sm md:text-base">
          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
              1. Scope &amp; Business-to-Business Context
            </h2>
            <p>
              This website is operated by {siteConfig.legalName} (U.S.-headquartered, with market operations in Malaysia) to present JYANTY guest-room amenity solutions to luxury hotels, resorts, serviced residences, and hospitality professionals. Our forms are intended for commercial and professional inquiries rather than consumer retail transactions.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-3">
              We collect only the information you voluntarily provide when submitting an inquiry or requesting a Demo Kit, plus minimal technical metadata required for security:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-charcoal/80">
              <li>
                <strong>Contact Inquiry Form:</strong> Full name, work email address, message/inquiry details, and confirmation of your privacy consent (along with the timestamp of consent).
              </li>
              <li>
                <strong>Demo Kit Request Form:</strong> Full name, job title, hotel or property name, hotel group (optional), country or territory, corporate work email, phone or WhatsApp number, room/suite count (optional), preferred meeting method, additional pilot notes (optional), and privacy consent confirmation with timestamp.
              </li>
              <li>
                <strong>Direct Communications:</strong> If you contact us directly via email ({siteConfig.contact.email}) or WhatsApp ({siteConfig.contact.phoneDisplay}), we receive the contact details and correspondence you choose to share.
              </li>
              <li>
                <strong>Security &amp; Anti-Spam Metadata:</strong> Basic request metadata (such as submission timestamp and temporary server-side request rate-limiting checks) used solely to prevent automated spam and abuse.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
              3. Purpose of Collecting and Processing Data
            </h2>
            <p className="mb-3">We process your submitted information strictly for the following business purposes:</p>
            <ul className="list-disc pl-5 space-y-2 text-charcoal/80">
              <li>To review, verify, and coordinate the preparation and delivery of JYANTY Demo Kits to hospitality properties.</li>
              <li>To respond to your questions, schedule introductory calls or presentations, and discuss potential pilot scopes.</li>
              <li>To assign a unique reference ID to your inquiry so our team and your property can accurately track communications.</li>
              <li>To protect our forms and backend APIs against spam, automated bot submissions, and abusive traffic.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
              4. Where Your Data Is Stored
            </h2>
            <p>
              Inquiry and Demo Kit submissions are transmitted to our backend API and stored in a structured PostgreSQL database hosted on <strong>Supabase</strong> (managed cloud database infrastructure). Only authorized GiantGreen EcoTech administrators can view or manage stored inquiry records through authenticated administrative controls.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
              5. Third-Party Services Used
            </h2>
            <p className="mb-3">
              We do not sell, rent, or trade your personal or property data. We rely on a limited set of infrastructure providers solely to operate this website and process your requests:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-charcoal/80">
              <li>
                <strong>Supabase:</strong> Used as our database provider for storing inquiry records and managing authenticated administrator access.
              </li>
              <li>
                <strong>Resend (Transactional Email Service):</strong> Used solely to dispatch internal notification emails to our company mailbox ({siteConfig.contact.email}) when a new inquiry or Demo Kit request is submitted.
              </li>
              <li>
                <strong>External Communication Links:</strong> If you choose to click a WhatsApp link, phone link, or an external calendar scheduling link, your interaction is governed by the respective privacy terms of WhatsApp or the scheduling platform you open.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
              6. How We Protect Your Data
            </h2>
            <p className="mb-3">
              We apply technical and organizational safeguards aligned with least-privilege principles to keep inquiry data non-public:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-charcoal/80">
              <li>All public form submissions are validated and processed through our server-side API rather than exposing database administration credentials in browser code.</li>
              <li>Database access is restricted using Row Level Security (RLS) policies so ordinary website visitors cannot read, alter, or delete any submitted inquiries.</li>
              <li>Administrative access to view or update inquiries requires authenticated administrator credentials; public administrator registration is disabled.</li>
              <li>Data in transit between your browser, our server, and our infrastructure providers is protected using standard HTTPS/TLS encryption.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
              7. Data Retention &amp; Deletion Rules
            </h2>
            <p>
              Inquiry records and associated follow-up notes are retained only for as long as needed to evaluate your request, conduct requested pilot or commercial discussions, or fulfill legitimate business record-keeping needs, unless you request earlier deletion. Specific fixed retention durations and jurisdiction-specific archival schedules are subject to final company policy confirmation and legal review.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
              8. Your Rights to Access, Correct, or Delete Data
            </h2>
            <p>
              You may contact us at any time to request: (a) confirmation of whether we hold your personal or inquiry data and a copy of that record; (b) correction of inaccurate or outdated contact or property details; or (c) deletion of your inquiry record from our database. To protect your privacy, we may ask you to verify your email address or inquiry reference ID before fulfilling a request.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
              9. Privacy Contact Information
            </h2>
            <p className="mb-3">
              For any privacy questions, data access requests, corrections, or deletion requests, please email us directly:
            </p>
            <div className="p-5 bg-white border border-soft-sand/40 rounded-sm text-sm space-y-1.5 shadow-sm">
              <p className="font-semibold text-charcoal">{siteConfig.legalName}</p>
              <p>
                Privacy &amp; Inquiries Email:{' '}
                <a
                  href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent('Privacy / Data Request')}`}
                  className="underline text-warm-bronze hover:text-espresso-brown font-medium break-all"
                >
                  {siteConfig.contact.email}
                </a>
              </p>
              <p>
                Telephone / WhatsApp:{' '}
                <a href={siteConfig.contact.phoneTel} className="underline text-charcoal hover:text-accent-orange">
                  {siteConfig.contact.phoneDisplay}
                </a>{' '}
                (Malaysia Operations)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-soft-sand/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-charcoal/65">
          <Link to="/" className="hover:text-charcoal underline">
            &larr; Back to Home
          </Link>
          <div className="flex flex-wrap gap-4">
            <Link to="/terms" className="hover:text-charcoal underline">
              Terms of Use
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
