import { Link } from 'react-router-dom';
import { siteConfig, getWhatsAppLink, WHATSAPP_PRESETS } from '../config/site';
import { Phone, Mail, MessageSquare } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-warm-ivory py-16 px-6 md:px-12 pb-28 md:pb-16 mt-auto border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand column */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <Link to="/" className="text-2xl font-serif font-semibold tracking-wide hover:opacity-90 transition-opacity">
            GiantGreen
          </Link>
          <p className="text-sm text-soft-sand max-w-xs leading-relaxed">
            A provider of guest-experience and sustainable amenity solutions for luxury hotels.
          </p>
          <div className="text-xs text-soft-sand/80 space-y-1 mt-2">
            <p>U.S.-headquartered</p>
            <p>Malaysia market operations (UTC+8)</p>
          </div>
        </div>

        {/* Solutions column */}
        <div>
          <h4 className="font-semibold text-sm tracking-wider uppercase mb-4 text-champagne">Solutions</h4>
          <ul className="space-y-3 text-sm text-soft-sand">
            <li>
              <Link to="/jyanty" className="hover:text-warm-ivory transition-colors">
                JYANTY System
              </Link>
            </li>
            <li>
              <Link to="/for-hotels" className="hover:text-warm-ivory transition-colors">
                For Hotels
              </Link>
            </li>
            <li>
              <Link to="/demo" className="hover:text-warm-ivory transition-colors">
                Request Demo Kit
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact info column */}
        <div>
          <h4 className="font-semibold text-sm tracking-wider uppercase mb-4 text-champagne">Get In Touch</h4>
          <ul className="space-y-3 text-sm text-soft-sand">
            <li>
              <a
                href={siteConfig.contact.phoneTel}
                className="hover:text-warm-ivory transition-colors flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-champagne shrink-0" />
                <span>{siteConfig.contact.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a
                href={siteConfig.contact.emailMailto}
                className="hover:text-warm-ivory transition-colors flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5 text-champagne shrink-0" />
                <span className="truncate">{siteConfig.contact.email}</span>
              </a>
            </li>
            <li>
              <a
                href={getWhatsAppLink(WHATSAPP_PRESETS.default)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-warm-ivory transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-eco-green shrink-0" />
                <span>WhatsApp Business</span>
              </a>
            </li>
            <li className="pt-1">
              <Link to="/contact" className="hover:text-warm-ivory transition-colors">
                Contact & Scheduling &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Governance */}
        <div>
          <h4 className="font-semibold text-sm tracking-wider uppercase mb-4 text-champagne">Governance</h4>
          <ul className="space-y-3 text-sm text-soft-sand">
            <li>
              <Link to="/about" className="hover:text-warm-ivory transition-colors">
                About GiantGreen
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-warm-ivory transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-warm-ivory transition-colors">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="hover:text-warm-ivory transition-colors">
                Cookie Notice
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-soft-sand gap-4">
        <p>&copy; {currentYear} GiantGreen EcoTech L.L.C. All rights reserved.</p>
        <p className="text-soft-sand/70">A better guest experience. One stay at a time.</p>
      </div>
    </footer>
  );
}
