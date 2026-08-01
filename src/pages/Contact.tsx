import { useState, type FormEvent } from 'react';
import { Mail, MessageCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSuccess(true);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory">
      <section className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
          
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-6">Contact Us</h1>
            <p className="text-xl text-charcoal/70 font-light mb-12">
              We look forward to discussing how JYANTY can elevate your property's guest experience.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 border border-soft-sand/30">
                  <Mail className="w-5 h-5 text-warm-bronze" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:giantgreenecotech@ggetapp.com" className="text-charcoal/70 hover:text-charcoal transition-colors">
                    giantgreenecotech@ggetapp.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 border border-soft-sand/30">
                  <MessageCircle className="w-5 h-5 text-eco-green" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">WhatsApp (Malaysia Operations)</h3>
                  <a 
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '601124028365'}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-charcoal/70 hover:text-charcoal transition-colors"
                  >
                    +60 11-2402 8365
                  </a>
                  <p className="text-sm text-charcoal/50 mt-1">Timezone: UTC+8</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 border border-soft-sand/30">
                  <Calendar className="w-5 h-5 text-charcoal" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Schedule a Call</h3>
                  <a 
                    href={import.meta.env.VITE_GOOGLE_BOOKING_URL || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-charcoal/70 hover:text-charcoal transition-colors underline"
                  >
                    Book a 15-Minute Introduction
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-16">
              <Link to="/demo" className="inline-block bg-charcoal text-white px-8 py-4 rounded-full font-semibold hover:bg-espresso-brown transition-all">
                Request a Demo Kit
              </Link>
            </div>
          </div>

          <div className="flex-1 bg-white p-8 md:p-12 border border-soft-sand/30 rounded-sm">
            <h2 className="text-2xl font-serif mb-6">Send a Message</h2>
            {isSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-eco-green/10 text-eco-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-medium mb-2">Message Sent</h3>
                <p className="text-charcoal/70">Thank you for reaching out. We will respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input required className="w-full p-3 border border-soft-sand/60 bg-warm-ivory/30 focus:outline-none focus:border-charcoal rounded-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input required type="email" className="w-full p-3 border border-soft-sand/60 bg-warm-ivory/30 focus:outline-none focus:border-charcoal rounded-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea required rows={5} className="w-full p-3 border border-soft-sand/60 bg-warm-ivory/30 focus:outline-none focus:border-charcoal rounded-sm"></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-charcoal text-white py-4 rounded-sm font-semibold hover:bg-espresso-brown transition-all disabled:opacity-70"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
          
        </div>
      </section>
    </div>
  );
}
