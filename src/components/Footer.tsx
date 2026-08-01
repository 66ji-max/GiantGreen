import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-charcoal text-warm-ivory py-16 px-6 md:px-12 pb-24 md:pb-16 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1 flex flex-col gap-4">
          <Link to="/" className="text-2xl font-serif font-semibold tracking-wide">
            GiantGreen
          </Link>
          <p className="text-sm text-soft-sand max-w-xs">
            A provider of guest-experience and sustainable amenity solutions for luxury hotels.
          </p>
          <div className="text-sm text-soft-sand mt-4">
            <p>U.S.-headquartered</p>
            <p>Malaysia market operations</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-lg mb-4 text-champagne">Solutions</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/jyanty" className="hover:text-white transition-colors">JYANTY System</Link></li>
            <li><Link to="/for-hotels" className="hover:text-white transition-colors">For Hotels</Link></li>
            <li><Link to="/demo" className="hover:text-white transition-colors">Request Demo Kit</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-lg mb-4 text-champagne">Company</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-lg mb-4 text-champagne">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
            <li><Link to="/cookies" className="hover:text-white transition-colors">Cookie Notice</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-soft-sand">
        <p>&copy; {currentYear} GiantGreen EcoTech L.L.C. All rights reserved.</p>
        <p className="mt-2 md:mt-0">A better guest experience. One stay at a time.</p>
      </div>
    </footer>
  );
}
