import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

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

  const isHome = location.pathname === '/';

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

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-12 h-20 flex items-center justify-between',
          isScrolled || !isHome
            ? 'bg-warm-ivory/95 backdrop-blur-md shadow-sm text-charcoal'
            : 'bg-transparent text-warm-ivory'
        )}
      >
        <Link to="/" className="text-xl font-serif font-semibold tracking-wide">
          GiantGreen
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'transition-colors hover:text-accent-orange',
                location.pathname === link.path && 'text-accent-orange'
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4">
            <Link
              to="/demo"
              className={cn(
                'px-5 py-2.5 rounded-full transition-all duration-300 font-semibold',
                isScrolled || !isHome
                  ? 'bg-charcoal text-warm-ivory hover:bg-espresso-brown'
                  : 'bg-warm-ivory text-charcoal hover:bg-white'
              )}
            >
              Request a Demo Kit
            </Link>
            <a
              href={import.meta.env.VITE_GOOGLE_BOOKING_URL || '#'}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:block text-sm hover:underline underline-offset-4"
            >
              Book 15 Minutes
            </a>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-warm-ivory flex flex-col p-6 text-charcoal"
          >
            <div className="flex justify-between items-center h-14">
              <Link to="/" className="text-xl font-serif font-semibold tracking-wide">
                GiantGreen
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-6 mt-12 text-2xl font-serif">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'hover:text-accent-orange transition-colors',
                    location.pathname === link.path && 'text-accent-orange'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            <div className="mt-auto flex flex-col gap-4 pb-8">
              <Link
                to="/demo"
                className="w-full py-4 bg-charcoal text-warm-ivory rounded-full text-center font-semibold"
              >
                Request a Demo Kit
              </Link>
              <a
                href={import.meta.env.VITE_GOOGLE_BOOKING_URL || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 border border-charcoal text-charcoal rounded-full text-center font-semibold"
              >
                Book 15 Minutes
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-warm-ivory border-t border-soft-sand flex justify-between p-3 gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <Link
          to="/demo"
          className="flex-1 bg-charcoal text-warm-ivory py-3 rounded-xl text-center text-sm font-semibold"
        >
          Request Demo
        </Link>
        <a
          href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '601124028365'}?text=Hello%20GiantGreen%20EcoTech,%20I%20would%20like%20to%20learn%20more%20about%20a%20JYANTY%20pilot%20for%20our%20hotel.`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-eco-green text-warm-ivory py-3 rounded-xl text-center text-sm font-semibold"
        >
          WhatsApp
        </a>
      </div>
    </>
  );
}
