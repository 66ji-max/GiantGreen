import { useState, useEffect, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { siteConfig, getWhatsAppLink, WHATSAPP_PRESETS } from '../config/site';

const NAV_LINKS = [
  { name: 'JYANTY', path: '/jyanty' },
  { name: 'For Hotels', path: '/for-hotels' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const bookingUrl = siteConfig.booking.getUrl();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleBookingClick = (e: MouseEvent) => {
    if (!bookingUrl) {
      e.preventDefault();
      navigate('/contact?intent=schedule');
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-12 h-20 flex items-center justify-between',
          isScrolled || !isHome
            ? 'bg-warm-ivory/95 backdrop-blur-md shadow-sm text-charcoal border-b border-soft-sand/20'
            : 'bg-transparent text-warm-ivory'
        )}
      >
        <Link
          to="/"
          className="text-xl md:text-2xl font-serif font-semibold tracking-wide hover:opacity-90 transition-opacity"
          aria-label="GiantGreen EcoTech Home"
        >
          GiantGreen
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'transition-colors hover:text-accent-orange font-sans tracking-wide',
                location.pathname === link.path
                  ? 'text-accent-orange font-semibold'
                  : isScrolled || !isHome
                  ? 'text-charcoal'
                  : 'text-warm-ivory'
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4">
            <Link
              to="/demo"
              className={cn(
                'px-5 py-2.5 rounded-full transition-all duration-300 font-semibold text-sm shadow-sm hover:scale-[1.02] active:scale-[0.98]',
                isScrolled || !isHome
                  ? 'bg-charcoal text-warm-ivory hover:bg-espresso-brown'
                  : 'bg-warm-ivory text-charcoal hover:bg-white'
              )}
            >
              Request a Demo Kit
            </Link>

            {bookingUrl ? (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:block text-sm hover:underline underline-offset-4 cursor-pointer transition-colors"
              >
                Book 15 Minutes
              </a>
            ) : (
              <button
                onClick={handleBookingClick}
                className="hidden lg:block text-sm hover:underline underline-offset-4 cursor-pointer transition-colors text-left"
              >
                Book 15 Minutes
              </button>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          className={cn(
            'md:hidden p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-orange',
            isScrolled || !isHome ? 'text-charcoal' : 'text-warm-ivory'
          )}
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[60] bg-warm-ivory flex flex-col p-6 text-charcoal overflow-y-auto"
          >
            <div className="flex justify-between items-center h-14 border-b border-soft-sand/30">
              <Link
                to="/"
                className="text-xl font-serif font-semibold tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                GiantGreen
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 text-charcoal hover:text-accent-orange transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 mt-10 text-2xl font-serif">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'transition-colors py-1',
                    location.pathname === link.path
                      ? 'text-accent-orange font-semibold'
                      : 'hover:text-accent-orange'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 pt-8 pb-4">
              <Link
                to="/demo"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 bg-charcoal text-warm-ivory rounded-full text-center font-semibold text-base shadow-sm hover:bg-espresso-brown transition-colors"
              >
                Request a Demo Kit
              </Link>

              {bookingUrl ? (
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 border border-charcoal text-charcoal rounded-full text-center font-semibold text-base hover:bg-charcoal hover:text-warm-ivory transition-colors"
                >
                  Book 15 Minutes
                </a>
              ) : (
                <button
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleBookingClick(e);
                  }}
                  className="w-full py-3.5 border border-charcoal text-charcoal rounded-full text-center font-semibold text-base hover:bg-charcoal hover:text-warm-ivory transition-colors"
                >
                  Book 15 Minutes
                </button>
              )}

              <a
                href={getWhatsAppLink(WHATSAPP_PRESETS.default)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-eco-green text-warm-ivory rounded-full text-center font-semibold text-base flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
              >
                <MessageSquare className="w-5 h-5" />
                Chat on WhatsApp (+60 123629153)
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Bottom Bar (Fixed, with safe z-index and clear contrast) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-warm-ivory/95 backdrop-blur-md border-t border-soft-sand flex justify-between p-3 gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <Link
          to="/demo"
          className="flex-1 bg-charcoal text-warm-ivory py-3 rounded-xl text-center text-sm font-semibold hover:bg-espresso-brown transition-colors shadow-sm"
        >
          Request Demo
        </Link>
        <a
          href={getWhatsAppLink(WHATSAPP_PRESETS.homeHero)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-eco-green text-warm-ivory py-3 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-1.5 hover:opacity-95 transition-opacity shadow-sm"
        >
          <MessageSquare className="w-4 h-4" />
          WhatsApp
        </a>
      </div>
    </>
  );
}
