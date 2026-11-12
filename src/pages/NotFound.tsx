import { Link } from 'react-router-dom';
import { ArrowLeft, Home, MessageSquare } from 'lucide-react';
import { siteConfig, getWhatsAppLink, WHATSAPP_PRESETS } from '../config/site';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory items-center justify-center px-6 py-32 text-center">
      <div className="max-w-md mx-auto">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-warm-bronze block mb-3">
          Error 404 &middot; Page Not Found
        </span>
        <h1 className="text-5xl md:text-6xl font-serif text-espresso-brown mb-6 font-light">
          The requested page could not be located.
        </h1>
        <p className="text-base text-charcoal/70 mb-10 leading-relaxed font-light">
          The page you are looking for may have been moved, renamed, or is currently unavailable. Please return to our main site or reach out to our team directly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-charcoal text-white px-8 py-3.5 rounded-full font-semibold hover:bg-espresso-brown transition-all shadow-sm text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <a
            href={getWhatsAppLink(WHATSAPP_PRESETS.default)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-charcoal/30 text-charcoal px-8 py-3.5 rounded-full font-semibold hover:bg-charcoal hover:text-white transition-all text-sm"
          >
            <MessageSquare className="w-4 h-4 text-eco-green" />
            <span>Contact on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
