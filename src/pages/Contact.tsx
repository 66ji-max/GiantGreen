import { useState, type FormEvent, useEffect } from 'react';
import { Mail, MessageSquare, Calendar, Phone, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { siteConfig, getWhatsAppLink, WHATSAPP_PRESETS } from '../config/site';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const isScheduleIntent = searchParams.get('intent') === 'schedule';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const bookingUrl = siteConfig.booking.getUrl();

  useEffect(() => {
    if (isScheduleIntent && !message) {
      setMessage('Hello, I would like to schedule a 15-minute introductory presentation regarding JYANTY amenities for our hotel.');
    }
  }, [isScheduleIntent, message]);

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!name.trim() || name.trim().length < 2) {
      errors.name = 'Please enter your full name (at least 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid work or corporate email address.';
    }
    if (!message.trim() || message.trim().length < 5) {
      errors.message = 'Please provide a message or inquiry details (at least 5 characters).';
    }
    if (!privacyConsent) {
      errors.privacyConsent = 'You must agree to the Privacy Policy before submitting.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          privacyConsent,
          honeypot: honeypot.trim(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success || !result?.referenceId) {
        throw new Error(
          result?.error ||
            'We were unable to save your inquiry at this moment. Please use our direct WhatsApp or Email channels below.'
        );
      }

      setReferenceId(result.referenceId);
      setIsSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      setPrivacyConsent(false);
    } catch (err: any) {
      setSubmitError(
        err.message ||
          'Failed to connect to the inquiry submission service. Please contact us directly via WhatsApp or email.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fallback mailto link prefilled with user input
  const fallbackMailto = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
    `[Inquiry] From ${name || 'Prospective Client'}`
  )}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  )}`;

  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory">
      <section className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
          {/* Left Column: Direct Contact Info */}
          <div className="flex-1">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-warm-bronze mb-2 block">
              Inquiries &amp; Hospitality Partnerships
            </span>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-6">Contact Us</h1>
            <p className="text-lg md:text-xl text-charcoal/70 font-light mb-10 leading-relaxed">
              We look forward to discussing how JYANTY can elevate your property's guest experience and support your hotel's sustainability initiatives.
            </p>

            {isScheduleIntent && (
              <div className="mb-8 p-4 bg-champagne/15 border border-champagne/40 rounded-sm">
                <p className="text-sm font-medium text-espresso-brown flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-warm-bronze shrink-0" />
                  <span>
                    <strong>Schedule a 15-Minute Introduction:</strong> Complete the form or reach out directly on WhatsApp to coordinate an optimal meeting time.
                  </span>
                </p>
              </div>
            )}

            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 border border-soft-sand/30 shadow-sm">
                  <Phone className="w-5 h-5 text-warm-bronze" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal text-sm uppercase tracking-wider mb-0.5">Telephone</h3>
                  <a
                    href={siteConfig.contact.phoneTel}
                    className="text-base text-charcoal/80 hover:text-accent-orange transition-colors font-medium"
                  >
                    {siteConfig.contact.phoneDisplay}
                  </a>
                  <p className="text-xs text-charcoal/50 mt-0.5">Direct phone inquiries</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 border border-soft-sand/30 shadow-sm">
                  <MessageSquare className="w-5 h-5 text-eco-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal text-sm uppercase tracking-wider mb-0.5">
                    WhatsApp (Malaysia Operations)
                  </h3>
                  <a
                    href={getWhatsAppLink(WHATSAPP_PRESETS.contact)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-charcoal/80 hover:text-eco-green transition-colors font-medium"
                  >
                    {siteConfig.contact.phoneDisplay}
                  </a>
                  <p className="text-xs text-charcoal/50 mt-0.5">Timezone: UTC+8 (Fast response during business hours)</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 border border-soft-sand/30 shadow-sm">
                  <Mail className="w-5 h-5 text-warm-bronze" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal text-sm uppercase tracking-wider mb-0.5">Email</h3>
                  <a
                    href={siteConfig.contact.emailMailto}
                    className="text-base text-charcoal/80 hover:text-accent-orange transition-colors font-medium break-all"
                  >
                    {siteConfig.contact.email}
                  </a>
                  <p className="text-xs text-charcoal/50 mt-0.5">Official hospitality inquiries</p>
                </div>
              </div>

              {/* Booking */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 border border-soft-sand/30 shadow-sm">
                  <Calendar className="w-5 h-5 text-charcoal" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal text-sm uppercase tracking-wider mb-0.5">15-Minute Presentation</h3>
                  {bookingUrl ? (
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-charcoal/80 hover:text-charcoal transition-colors underline font-medium"
                    >
                      Book on Online Calendar &rarr;
                    </a>
                  ) : (
                    <p className="text-sm text-charcoal/70">
                      Submit an inquiry on the right or message on WhatsApp to request an executive briefing slot.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-soft-sand/40 flex flex-col sm:flex-row gap-4">
              <Link
                to="/demo"
                className="inline-flex items-center justify-center gap-2 bg-charcoal text-white px-8 py-4 rounded-full font-semibold hover:bg-espresso-brown transition-all shadow-sm"
              >
                <span>Request a Demo Kit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="flex-1 bg-white p-8 md:p-12 border border-soft-sand/30 rounded-sm shadow-sm">
            <h2 className="text-2xl font-serif mb-2 text-charcoal">Send a Direct Message</h2>
            <p className="text-sm text-charcoal/60 mb-8">
              Fill in your details below and our hospitality team will respond promptly.
            </p>

            {isSuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-eco-green/10 text-eco-green rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif text-charcoal">Message Successfully Recorded</h3>
                <p className="text-charcoal/70 text-sm max-w-md mx-auto">
                  Thank you for reaching out to GiantGreen EcoTech. Your inquiry has been saved with reference ID:
                </p>
                <div className="inline-block px-4 py-2 bg-warm-ivory border border-soft-sand rounded font-mono text-sm font-semibold text-charcoal">
                  {referenceId}
                </div>
                <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-3 border border-charcoal text-charcoal rounded-full text-sm font-semibold hover:bg-charcoal hover:text-white transition-colors"
                  >
                    Send Another Message
                  </button>
                  <a
                    href={getWhatsAppLink(WHATSAPP_PRESETS.contact)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-eco-green text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Follow up on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Honeypot field for bot detection */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website-hp">Website</label>
                  <input
                    id="website-hp"
                    type="text"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-red-800 text-sm space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <p className="font-medium">{submitError}</p>
                    </div>
                    <div className="pt-2 border-t border-red-200/60 flex flex-wrap gap-3">
                      <a
                        href={getWhatsAppLink(WHATSAPP_PRESETS.contact)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-eco-green text-white px-3 py-1.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
                      >
                        Send via WhatsApp ({siteConfig.contact.phoneDisplay})
                      </a>
                      <a
                        href={fallbackMailto}
                        className="text-xs bg-white text-charcoal border border-charcoal/30 px-3 py-1.5 rounded-full font-semibold hover:bg-charcoal hover:text-white transition-colors"
                      >
                        Open in Email Client
                      </a>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium mb-1.5 text-charcoal">
                    Full Name <span className="text-accent-orange">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full p-3 border border-soft-sand/70 bg-warm-ivory/20 focus:outline-none focus:border-charcoal focus:bg-white rounded-sm text-charcoal transition-colors"
                  />
                  {fieldErrors.name && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium mb-1.5 text-charcoal">
                    Work Email <span className="text-accent-orange">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    placeholder="e.g. name@luxuryhotel.com"
                    className="w-full p-3 border border-soft-sand/70 bg-warm-ivory/20 focus:outline-none focus:border-charcoal focus:bg-white rounded-sm text-charcoal transition-colors"
                  />
                  {fieldErrors.email && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium mb-1.5 text-charcoal">
                    Message / Inquiry Details <span className="text-accent-orange">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: '' }));
                    }}
                    placeholder="Tell us about your property, room count, or specific questions about the JYANTY pilot..."
                    className="w-full p-3 border border-soft-sand/70 bg-warm-ivory/20 focus:outline-none focus:border-charcoal focus:bg-white rounded-sm text-charcoal transition-colors"
                  ></textarea>
                  {fieldErrors.message && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="contact-privacy"
                      checked={privacyConsent}
                      onChange={(e) => {
                        setPrivacyConsent(e.target.checked);
                        if (fieldErrors.privacyConsent) {
                          setFieldErrors((prev) => ({ ...prev, privacyConsent: '' }));
                        }
                      }}
                      className="mt-1 h-4 w-4 rounded border-soft-sand text-charcoal focus:ring-accent-orange cursor-pointer"
                    />
                    <label htmlFor="contact-privacy" className="text-xs text-charcoal/70 leading-relaxed cursor-pointer">
                      I agree to the{' '}
                      <Link to="/privacy" target="_blank" className="underline text-charcoal hover:text-accent-orange">
                        Privacy Policy
                      </Link>{' '}
                      and consent to GiantGreen EcoTech storing and processing this inquiry to respond to my request.
                    </label>
                  </div>
                  {fieldErrors.privacyConsent && (
                    <p className="text-red-600 text-xs mt-1.5 font-medium">{fieldErrors.privacyConsent}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-charcoal text-white py-4 rounded-full font-semibold hover:bg-espresso-brown transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <span>Submit Message</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
