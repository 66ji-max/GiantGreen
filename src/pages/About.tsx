import { Link } from 'react-router-dom';
import Image from '../components/Image';
import { siteConfig, getWhatsAppLink, WHATSAPP_PRESETS } from '../config/site';
import { Phone, Mail, MessageSquare, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory">
      <section className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-warm-bronze mb-3 block">
            Our Mission & Architecture
          </span>
          <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-8 text-espresso-brown">
            About GiantGreen EcoTech
          </h1>
          <p className="text-xl text-charcoal/70 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            A specialized company developing guest-experience and sustainable amenity solutions for luxury hotels.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="w-full h-[400px] mb-20 rounded-sm overflow-hidden shadow-lg border border-soft-sand/30">
            <Image
              src="/visual-assets/product/jyanty-hero-landscape-01.jpg"
              alt="GiantGreen EcoTech Luxury Hospitality Standard"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl font-serif mb-6 text-espresso-brown">Our Philosophy</h2>
              <p className="text-lg leading-relaxed text-charcoal/80 mb-6">
                We believe that the true essence of a luxury hotel stay lies in meticulous attention to overlooked details. By replacing generic, disposable plastic items with refined, purpose-built systems, we elevate the guest experience without imposing operational friction on housekeeping teams.
              </p>
              <p className="text-lg leading-relaxed text-charcoal/80 mb-8">
                Our approach to sustainability is grounded and controlled. We collaborate closely with hotel operators to implement solutions that fit their unique room turnover workflows, ensuring that ecological stewardship delivers tangible guest appreciation and verifiable ESG progress.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/demo"
                  className="inline-flex items-center justify-center gap-2 bg-charcoal text-white px-8 py-4 rounded-full font-semibold hover:bg-espresso-brown transition-all shadow-sm"
                >
                  <span>Request a Demo Kit</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/for-hotels"
                  className="inline-flex items-center justify-center gap-2 border border-charcoal/30 text-charcoal px-8 py-4 rounded-full font-semibold hover:bg-charcoal hover:text-white transition-all"
                >
                  <span>Explore Hotel Value</span>
                </Link>
              </div>
            </div>

            <div className="bg-white p-10 border border-soft-sand/30 rounded-sm shadow-sm flex flex-col justify-center">
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-warm-bronze mb-8">
                Corporate Credentials
              </h3>
              <ul className="space-y-6 text-sm md:text-base">
                <li className="border-b border-soft-sand/20 pb-4">
                  <strong className="block text-charcoal font-semibold text-xs uppercase tracking-wider mb-1">
                    Legal Entity
                  </strong>
                  <span className="text-charcoal/80 text-lg font-serif">{siteConfig.legalName}</span>
                </li>
                <li className="border-b border-soft-sand/20 pb-4">
                  <strong className="block text-charcoal font-semibold text-xs uppercase tracking-wider mb-1">
                    Headquarters
                  </strong>
                  <span className="text-charcoal/80 text-base">{siteConfig.headquarters}</span>
                </li>
                <li className="border-b border-soft-sand/20 pb-4">
                  <strong className="block text-charcoal font-semibold text-xs uppercase tracking-wider mb-1">
                    Market Operations
                  </strong>
                  <span className="text-charcoal/80 text-base">{siteConfig.marketOperations}</span>
                </li>
                <li className="border-b border-soft-sand/20 pb-4">
                  <strong className="block text-charcoal font-semibold text-xs uppercase tracking-wider mb-1">
                    Founder
                  </strong>
                  <span className="text-charcoal/80 text-base">{siteConfig.founder}</span>
                </li>
                <li>
                  <strong className="block text-charcoal font-semibold text-xs uppercase tracking-wider mb-2">
                    Direct Contact
                  </strong>
                  <div className="space-y-2 text-sm text-charcoal/80">
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-warm-bronze" />
                      <a href={siteConfig.contact.phoneTel} className="hover:text-accent-orange font-medium">
                        {siteConfig.contact.phoneDisplay}
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-warm-bronze" />
                      <a href={siteConfig.contact.emailMailto} className="hover:text-accent-orange">
                        {siteConfig.contact.email}
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-eco-green" />
                      <a
                        href={getWhatsAppLink(WHATSAPP_PRESETS.default)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-eco-green"
                      >
                        WhatsApp Business
                      </a>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
