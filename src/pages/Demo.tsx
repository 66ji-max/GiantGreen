import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Calendar, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  jobTitle: z.string().min(2, 'Job title is required'),
  hotelProperty: z.string().min(2, 'Hotel/Property is required'),
  hotelGroup: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  workEmail: z.string().email('Invalid email address'),
  phoneWhatsApp: z.string().min(5, 'Phone number is required'),
  roomCount: z.string().optional(),
  preferredMeetingMethod: z.string().min(1, 'Please select a meeting method'),
  message: z.string().optional(),
  privacyConsent: z.boolean().refine(val => val === true, {
    message: 'You must agree to the privacy policy',
  }),
  honeypot: z.string().max(0, 'Invalid submission').optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function Demo() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferredMeetingMethod: '',
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Form submitted:', data);
    setReferenceId(`GG-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
    setIsSuccess(true);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-4">Request a Demo Kit</h1>
          <p className="text-lg text-charcoal/70">
            Evaluate JYANTY in the context of your property. Requests are reviewed before delivery arrangements and commercial terms are discussed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Quick Actions / Alt Paths */}
          <div className="md:col-span-1 space-y-6 order-2 md:order-1">
            <div className="bg-white p-6 shadow-sm border border-soft-sand/30 rounded-sm">
              <h3 className="font-serif text-xl mb-4 text-charcoal">Prefer to speak first?</h3>
              <p className="text-sm text-charcoal/70 mb-6">Schedule a brief introduction call before requesting a physical kit.</p>
              <a 
                href={import.meta.env.VITE_GOOGLE_BOOKING_URL || '#'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors rounded-full font-medium text-sm"
              >
                <Calendar className="w-4 h-4" />
                Schedule 15 Minutes
              </a>
            </div>

            <div className="bg-white p-6 shadow-sm border border-soft-sand/30 rounded-sm">
               <h3 className="font-serif text-xl mb-4 text-charcoal">Quick question?</h3>
               <a 
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '601124028365'}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-eco-green text-white hover:bg-opacity-90 transition-colors rounded-full font-medium text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Speak on WhatsApp
              </a>
            </div>
          </div>

          {/* Form Area */}
          <div className="md:col-span-2 order-1 md:order-2 bg-white p-8 md:p-10 shadow-sm border border-soft-sand/30 rounded-sm">
            {isSuccess ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-eco-green mx-auto mb-6" />
                <h3 className="text-3xl font-serif mb-4">Request Received</h3>
                <p className="text-charcoal/70 mb-2">Thank you for your interest in JYANTY.</p>
                <p className="text-charcoal/70 mb-8">Your reference ID is: <strong className="text-charcoal">{referenceId}</strong></p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a 
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '601124028365'}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 bg-eco-green text-white rounded-full font-medium text-sm hover:bg-opacity-90 transition-all"
                  >
                    Follow up on WhatsApp
                  </a>
                  <a 
                    href={import.meta.env.VITE_GOOGLE_BOOKING_URL || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 border border-charcoal text-charcoal rounded-full font-medium text-sm hover:bg-charcoal hover:text-white transition-all"
                  >
                    Book a Calendar Slot
                  </a>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Honeypot */}
                <div className="hidden">
                  <input type="text" {...register('honeypot')} tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input {...register('fullName')} className="w-full p-3 border border-soft-sand/60 bg-warm-ivory/30 focus:outline-none focus:border-charcoal rounded-sm" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Job Title *</label>
                    <input {...register('jobTitle')} className="w-full p-3 border border-soft-sand/60 bg-warm-ivory/30 focus:outline-none focus:border-charcoal rounded-sm" />
                    {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hotel/Property *</label>
                    <input {...register('hotelProperty')} className="w-full p-3 border border-soft-sand/60 bg-warm-ivory/30 focus:outline-none focus:border-charcoal rounded-sm" />
                    {errors.hotelProperty && <p className="text-red-500 text-xs mt-1">{errors.hotelProperty.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hotel Group (Optional)</label>
                    <input {...register('hotelGroup')} className="w-full p-3 border border-soft-sand/60 bg-warm-ivory/30 focus:outline-none focus:border-charcoal rounded-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Country *</label>
                    <input {...register('country')} className="w-full p-3 border border-soft-sand/60 bg-warm-ivory/30 focus:outline-none focus:border-charcoal rounded-sm" />
                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Number of Rooms (Optional)</label>
                    <input {...register('roomCount')} className="w-full p-3 border border-soft-sand/60 bg-warm-ivory/30 focus:outline-none focus:border-charcoal rounded-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Work Email *</label>
                    <input type="email" {...register('workEmail')} className="w-full p-3 border border-soft-sand/60 bg-warm-ivory/30 focus:outline-none focus:border-charcoal rounded-sm" />
                    {errors.workEmail && <p className="text-red-500 text-xs mt-1">{errors.workEmail.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone / WhatsApp *</label>
                    <input {...register('phoneWhatsApp')} className="w-full p-3 border border-soft-sand/60 bg-warm-ivory/30 focus:outline-none focus:border-charcoal rounded-sm" />
                    {errors.phoneWhatsApp && <p className="text-red-500 text-xs mt-1">{errors.phoneWhatsApp.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Meeting Method *</label>
                  <select {...register('preferredMeetingMethod')} className="w-full p-3 border border-soft-sand/60 bg-warm-ivory/30 focus:outline-none focus:border-charcoal rounded-sm">
                    <option value="">Select a method...</option>
                    <option value="Google Meet">Google Meet</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="WhatsApp call">WhatsApp call</option>
                    <option value="Telephone">Telephone</option>
                    <option value="In-person discussion">In-person discussion</option>
                    <option value="Email first">Email first</option>
                  </select>
                  {errors.preferredMeetingMethod && <p className="text-red-500 text-xs mt-1">{errors.preferredMeetingMethod.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Message (Optional)</label>
                  <textarea {...register('message')} rows={4} className="w-full p-3 border border-soft-sand/60 bg-warm-ivory/30 focus:outline-none focus:border-charcoal rounded-sm"></textarea>
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="privacy" {...register('privacyConsent')} className="mt-1" />
                  <label htmlFor="privacy" className="text-sm text-charcoal/70">
                    I agree to the <a href="/privacy" className="underline">Privacy Policy</a> and consent to GiantGreen EcoTech processing my data to handle this request.
                  </label>
                </div>
                {errors.privacyConsent && <p className="text-red-500 text-xs">{errors.privacyConsent.message}</p>}

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-charcoal text-white py-4 rounded-full font-semibold hover:bg-espresso-brown transition-all disabled:opacity-70 flex justify-center items-center"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
