import { useState, type MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Calendar, MessageSquare, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { siteConfig, getWhatsAppLink, WHATSAPP_PRESETS } from '../config/site';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required (at least 2 characters)'),
  jobTitle: z.string().min(2, 'Job title is required'),
  hotelProperty: z.string().min(2, 'Hotel/Property name is required'),
  hotelGroup: z.string().optional(),
  country: z.string().min(2, 'Country or jurisdiction is required'),
  workEmail: z.string().email('Please enter a valid work email address'),
  phoneWhatsApp: z.string().min(5, 'Contact phone/WhatsApp number is required'),
  roomCount: z.string().optional(),
  preferredMeetingMethod: z.string().min(1, 'Please select a preferred meeting method'),
  message: z.string().optional(),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Privacy Policy to submit an evaluation request.',
  }),
  honeypot: z.string().max(0, 'Spam detected').optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function Demo() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [lastSubmittedData, setLastSubmittedData] = useState<FormData | null>(null);

  const navigate = useNavigate();
  const bookingUrl = siteConfig.booking.getUrl();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferredMeetingMethod: '',
      privacyConsent: false,
      honeypot: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setLastSubmittedData(data);

    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: data.fullName,
          jobTitle: data.jobTitle,
          hotelProperty: data.hotelProperty,
          hotelGroup: data.hotelGroup || undefined,
          country: data.country,
          workEmail: data.workEmail,
          phoneWhatsApp: data.phoneWhatsApp,
          roomCount: data.roomCount || undefined,
          preferredMeetingMethod: data.preferredMeetingMethod,
          message: data.message || undefined,
          privacyConsent: data.privacyConsent,
          honeypot: data.honeypot || '',
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error ||
            'We were unable to record your demo request in our database. Please reach out to us directly via WhatsApp or email.'
        );
      }

      setReferenceId(result.referenceId || `GG-DEMO-${Date.now()}`);
      setIsSuccess(true);
      reset();
    } catch (err: any) {
      console.error('Demo request submission failed:', err);
      setSubmissionError(
        err.message ||
          'Failed to record your Demo Kit request. Please use our direct WhatsApp or Email channels.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookingClick = (e: MouseEvent) => {
    if (!bookingUrl) {
      e.preventDefault();
      navigate('/contact?intent=schedule');
    }
  };

  // Pre-formatted mailto fallback in case of network issues
  const fallbackMailto = lastSubmittedData
    ? `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
        `[Demo Kit Request] ${lastSubmittedData.hotelProperty} - ${lastSubmittedData.fullName}`
      )}&body=${encodeURIComponent(
        `Property: ${lastSubmittedData.hotelProperty}\nName: ${lastSubmittedData.fullName} (${lastSubmittedData.jobTitle})\nCountry: ${lastSubmittedData.country}\nEmail: ${lastSubmittedData.workEmail}\nPhone: ${lastSubmittedData.phoneWhatsApp}\nRooms: ${lastSubmittedData.roomCount || 'N/A'}\nPreferred Meeting: ${lastSubmittedData.preferredMeetingMethod}\n\nNotes:\n${lastSubmittedData.message || 'None'}`
      )}`
    : siteConfig.contact.emailMailto;

  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-warm-bronze mb-2 block">
            Controlled Property Evaluation
          </span>
          <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-4 text-charcoal">
            Request a Demo Kit
          </h1>
          <p className="text-base md:text-lg text-charcoal/70 leading-relaxed font-light">
            Evaluate JYANTY in the context of your luxury suites or executive floor. All requests are logged and reviewed by our hospitality team prior to sample kit dispatch and commercial pilot alignment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Quick Actions / Alternative Consultation */}
          <div className="md:col-span-1 space-y-6 order-2 md:order-1">
            <div className="bg-white p-6 shadow-sm border border-soft-sand/30 rounded-sm">
              <h3 className="font-serif text-xl mb-2 text-charcoal">Prefer to speak first?</h3>
              <p className="text-xs md:text-sm text-charcoal/70 mb-5 leading-relaxed">
                Schedule a concise 15-minute introductory presentation with our hotel solutions team.
              </p>
              {bookingUrl ? (
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors rounded-full font-medium text-xs md:text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Calendar Slot</span>
                </a>
              ) : (
                <button
                  onClick={handleBookingClick}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors rounded-full font-medium text-xs md:text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule 15 Minutes</span>
                </button>
              )}
            </div>

            <div className="bg-white p-6 shadow-sm border border-soft-sand/30 rounded-sm">
              <h3 className="font-serif text-xl mb-2 text-charcoal">Direct Consultation</h3>
              <p className="text-xs md:text-sm text-charcoal/70 mb-5 leading-relaxed">
                Have specific technical or operational questions about pilot room readiness?
              </p>
              <a
                href={getWhatsAppLink(WHATSAPP_PRESETS.demoRequest)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-eco-green text-white hover:opacity-90 transition-opacity rounded-full font-medium text-xs md:text-sm shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <p className="text-[11px] text-charcoal/50 text-center mt-2.5">
                {siteConfig.contact.phoneDisplay} (Malaysia / UTC+8)
              </p>
            </div>

            <div className="p-5 bg-champagne/10 border border-champagne/30 rounded-sm text-xs text-charcoal/80 space-y-2">
              <p className="font-semibold text-espresso-brown">What's in the Demo Kit?</p>
              <p className="leading-relaxed">
                Includes sample JYANTY reusable handle, hygienically sealed replacement brush heads, presentation collateral, and housekeeping operational guide.
              </p>
            </div>
          </div>

          {/* Form Area */}
          <div className="md:col-span-2 order-1 md:order-2 bg-white p-8 md:p-10 shadow-sm border border-soft-sand/30 rounded-sm">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <CheckCircle2 className="w-16 h-16 text-eco-green mx-auto mb-5" />
                <h3 className="text-3xl font-serif mb-3 text-charcoal">Request Received & Logged</h3>
                <p className="text-charcoal/70 text-sm max-w-md mx-auto mb-3">
                  Thank you for your interest in JYANTY. Your request has been recorded into our enterprise database.
                </p>
                <div className="my-6 p-4 bg-warm-ivory border border-soft-sand/60 rounded max-w-sm mx-auto">
                  <span className="text-xs text-charcoal/60 uppercase tracking-wider block mb-1">
                    Verified Reference ID
                  </span>
                  <span className="font-mono text-base font-bold text-espresso-brown">
                    {referenceId}
                  </span>
                </div>
                <p className="text-xs text-charcoal/60 max-w-md mx-auto mb-8">
                  A representative will review your property details and contact you via your provided email or WhatsApp to confirm shipping details and pilot specifications.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href={getWhatsAppLink(WHATSAPP_PRESETS.demoFollowUp(referenceId))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 bg-eco-green text-white rounded-full font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Follow up on WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-3.5 border border-charcoal text-charcoal rounded-full font-medium text-sm hover:bg-charcoal hover:text-white transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                {/* Honeypot field for spam prevention */}
                <div className="hidden" aria-hidden="true">
                  <input type="text" {...register('honeypot')} tabIndex={-1} autoComplete="off" />
                </div>

                {submissionError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-red-800 text-sm space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <p className="font-medium">{submissionError}</p>
                    </div>
                    <div className="pt-2 border-t border-red-200/60 flex flex-wrap gap-3">
                      <a
                        href={getWhatsAppLink(WHATSAPP_PRESETS.demoRequest)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-eco-green text-white px-3 py-1.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
                      >
                        Submit via WhatsApp ({siteConfig.contact.phoneDisplay})
                      </a>
                      <a
                        href={fallbackMailto}
                        className="text-xs bg-white text-charcoal border border-charcoal/30 px-3 py-1.5 rounded-full font-semibold hover:bg-charcoal hover:text-white transition-colors"
                      >
                        Submit via Email
                      </a>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-charcoal">
                      Full Name <span className="text-accent-orange">*</span>
                    </label>
                    <input
                      {...register('fullName')}
                      placeholder="e.g. Johnathan Smith"
                      className="w-full p-3 border border-soft-sand/70 bg-warm-ivory/20 focus:outline-none focus:border-charcoal focus:bg-white rounded-sm text-sm transition-colors"
                    />
                    {errors.fullName && (
                      <p className="text-red-600 text-xs mt-1 font-medium">{errors.fullName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-charcoal">
                      Job Title <span className="text-accent-orange">*</span>
                    </label>
                    <input
                      {...register('jobTitle')}
                      placeholder="e.g. General Manager / Director of Rooms"
                      className="w-full p-3 border border-soft-sand/70 bg-warm-ivory/20 focus:outline-none focus:border-charcoal focus:bg-white rounded-sm text-sm transition-colors"
                    />
                    {errors.jobTitle && (
                      <p className="text-red-600 text-xs mt-1 font-medium">{errors.jobTitle.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-charcoal">
                      Hotel / Property Name <span className="text-accent-orange">*</span>
                    </label>
                    <input
                      {...register('hotelProperty')}
                      placeholder="e.g. The Grand Heritage Hotel"
                      className="w-full p-3 border border-soft-sand/70 bg-warm-ivory/20 focus:outline-none focus:border-charcoal focus:bg-white rounded-sm text-sm transition-colors"
                    />
                    {errors.hotelProperty && (
                      <p className="text-red-600 text-xs mt-1 font-medium">{errors.hotelProperty.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-charcoal">
                      Hotel Group / Brand (Optional)
                    </label>
                    <input
                      {...register('hotelGroup')}
                      placeholder="e.g. Independent / Luxury Collection"
                      className="w-full p-3 border border-soft-sand/70 bg-warm-ivory/20 focus:outline-none focus:border-charcoal focus:bg-white rounded-sm text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-charcoal">
                      Country / Territory <span className="text-accent-orange">*</span>
                    </label>
                    <input
                      {...register('country')}
                      placeholder="e.g. Malaysia, Singapore, United States"
                      className="w-full p-3 border border-soft-sand/70 bg-warm-ivory/20 focus:outline-none focus:border-charcoal focus:bg-white rounded-sm text-sm transition-colors"
                    />
                    {errors.country && (
                      <p className="text-red-600 text-xs mt-1 font-medium">{errors.country.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-charcoal">
                      Number of Rooms / Suites (Optional)
                    </label>
                    <input
                      {...register('roomCount')}
                      placeholder="e.g. 180 rooms, 24 suites"
                      className="w-full p-3 border border-soft-sand/70 bg-warm-ivory/20 focus:outline-none focus:border-charcoal focus:bg-white rounded-sm text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-charcoal">
                      Corporate Work Email <span className="text-accent-orange">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('workEmail')}
                      placeholder="e.g. gm@heritagehotel.com"
                      className="w-full p-3 border border-soft-sand/70 bg-warm-ivory/20 focus:outline-none focus:border-charcoal focus:bg-white rounded-sm text-sm transition-colors"
                    />
                    {errors.workEmail && (
                      <p className="text-red-600 text-xs mt-1 font-medium">{errors.workEmail.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-charcoal">
                      Phone / WhatsApp Number <span className="text-accent-orange">*</span>
                    </label>
                    <input
                      {...register('phoneWhatsApp')}
                      placeholder="e.g. +60 12-345 6789"
                      className="w-full p-3 border border-soft-sand/70 bg-warm-ivory/20 focus:outline-none focus:border-charcoal focus:bg-white rounded-sm text-sm transition-colors"
                    />
                    {errors.phoneWhatsApp && (
                      <p className="text-red-600 text-xs mt-1 font-medium">{errors.phoneWhatsApp.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-charcoal">
                    Preferred Briefing / Meeting Method <span className="text-accent-orange">*</span>
                  </label>
                  <select
                    {...register('preferredMeetingMethod')}
                    className="w-full p-3 border border-soft-sand/70 bg-warm-ivory/20 focus:outline-none focus:border-charcoal focus:bg-white rounded-sm text-sm transition-colors"
                  >
                    <option value="">Select a preferred method...</option>
                    <option value="Google Meet">Google Meet</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="WhatsApp Business Video/Call">WhatsApp Business Video/Call</option>
                    <option value="Telephone Call">Telephone Call</option>
                    <option value="In-person property meeting (Malaysia/Kuala Lumpur)">
                      In-person property meeting (Malaysia / Kuala Lumpur)
                    </option>
                    <option value="Email review first">Email review first</option>
                  </select>
                  {errors.preferredMeetingMethod && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{errors.preferredMeetingMethod.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-charcoal">
                    Additional Notes / Target Deployment Timeline (Optional)
                  </label>
                  <textarea
                    {...register('message')}
                    rows={3}
                    placeholder="e.g. We are currently evaluating amenities for our executive club floor reopening in Q3..."
                    className="w-full p-3 border border-soft-sand/70 bg-warm-ivory/20 focus:outline-none focus:border-charcoal focus:bg-white rounded-sm text-sm transition-colors"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="privacy"
                      {...register('privacyConsent')}
                      className="mt-1 h-4 w-4 rounded border-soft-sand text-charcoal focus:ring-accent-orange cursor-pointer"
                    />
                    <label htmlFor="privacy" className="text-xs text-charcoal/70 leading-relaxed cursor-pointer">
                      I agree to the{' '}
                      <Link to="/privacy" target="_blank" className="underline text-charcoal hover:text-accent-orange">
                        Privacy Policy
                      </Link>{' '}
                      and consent to GiantGreen EcoTech processing this property information solely to evaluate our Demo Kit request and coordinate commercial discussion.
                    </label>
                  </div>
                  {errors.privacyConsent && (
                    <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.privacyConsent.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-charcoal text-white py-4 rounded-full font-semibold hover:bg-espresso-brown transition-all disabled:opacity-60 flex justify-center items-center gap-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Logging Request...</span>
                    </>
                  ) : (
                    <span>Submit Demo Kit Request</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
