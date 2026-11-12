import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Image from '../components/Image';
import { siteConfig, getWhatsAppLink, WHATSAPP_PRESETS } from '../config/site';
import { MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Jyanty() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-warm-bronze mb-3 block">
              The JYANTY In-Room Amenity
            </span>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-6 text-espresso-brown">
              A more considered approach to in-room brushing.
            </h1>
            <p className="text-lg md:text-xl text-charcoal/70 font-light mb-8 max-w-lg leading-relaxed">
              A refined reusable electric handle, paired with a fresh, hygienically sealed replacement brush head provided for every new stay.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link 
                to="/demo"
                className="bg-accent-orange text-white px-8 py-3.5 rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                Request a Demo Kit
              </Link>
              <a
                href={getWhatsAppLink(WHATSAPP_PRESETS.demoRequest)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-charcoal/30 rounded-full text-charcoal hover:bg-charcoal hover:text-white transition-all text-sm font-semibold"
              >
                <MessageSquare className="w-4 h-4 text-eco-green" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full h-[480px]"
          >
            <Image 
              src="/visual-assets/product/jyanty-lifestyle-portrait-02.jpg" 
              alt="JYANTY Handle and sealed brush head system"
              className="w-full h-full object-cover rounded-sm shadow-xl"
              fallbackColor="bg-soft-sand"
            />
          </motion.div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="py-24 bg-white text-charcoal px-6 md:px-12 border-y border-soft-sand/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-espresso-brown">
              Engineering the Bathroom Touchpoint
            </h2>
            <p className="text-charcoal/70 text-base leading-relaxed">
              Every element of JYANTY is developed specifically for luxury hotel housekeeping standards and environmental criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div className="space-y-10">
              <div className="p-6 bg-warm-ivory/30 border border-soft-sand/30 rounded-sm">
                <div className="flex items-center gap-2 mb-2 text-warm-bronze">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <h3 className="text-xl font-serif font-semibold text-charcoal">Premium Reusable Handle</h3>
                </div>
                <p className="text-charcoal/70 leading-relaxed text-sm md:text-base pl-7">
                  Crafted for tactile heft, durability, and aesthetic harmony. The handle remains in the room, eliminating the volume of heavy plastic discarded daily while providing a superior brushing experience.
                </p>
              </div>

              <div className="p-6 bg-warm-ivory/30 border border-soft-sand/30 rounded-sm">
                <div className="flex items-center gap-2 mb-2 text-warm-bronze">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <h3 className="text-xl font-serif font-semibold text-charcoal">Fresh Sealed Brush Heads</h3>
                </div>
                <p className="text-charcoal/70 leading-relaxed text-sm md:text-base pl-7">
                  Housekeeping replaces the sealed brush head during each room turnover. Guests receive a pristine, individually sterilized head in clean protective packaging.
                </p>
              </div>

              <div className="p-6 bg-warm-ivory/30 border border-soft-sand/30 rounded-sm">
                <div className="flex items-center gap-2 mb-2 text-warm-bronze">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <h3 className="text-xl font-serif font-semibold text-charcoal">Long-Stay Operational Efficiency</h3>
                </div>
                <p className="text-charcoal/70 leading-relaxed text-sm md:text-base pl-7">
                  Unnecessary full-toothbrush disposal is prevented during multi-night stays, addressing a major source of waste in luxury hotels and serviced residences.
                </p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="p-6 bg-warm-ivory/30 border border-soft-sand/30 rounded-sm">
                <div className="flex items-center gap-2 mb-2 text-warm-bronze">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <h3 className="text-xl font-serif font-semibold text-charcoal">Compatible Supply Chain</h3>
                </div>
                <p className="text-charcoal/70 leading-relaxed text-sm md:text-base pl-7">
                  Toothpaste remains independently packaged, allowing seamless compatibility with your existing bathroom amenity supplier contracts and preferred luxury brands.
                </p>
              </div>

              <div className="p-6 bg-warm-ivory/30 border border-soft-sand/30 rounded-sm">
                <div className="flex items-center gap-2 mb-2 text-warm-bronze">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <h3 className="text-xl font-serif font-semibold text-charcoal">Controlled Pilot Flexibility</h3>
                </div>
                <p className="text-charcoal/70 leading-relaxed text-sm md:text-base pl-7">
                  Deploy at your own pace. Start with selected presidential suites, an executive club floor, or VIP long-stay rooms to measure guest satisfaction before broad rollout.
                </p>
              </div>

              <div className="p-6 bg-warm-ivory/30 border border-soft-sand/30 rounded-sm">
                <div className="flex items-center gap-2 mb-2 text-warm-bronze">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <h3 className="text-xl font-serif font-semibold text-charcoal">Ancillary Revenue Opportunity</h3>
                </div>
                <p className="text-charcoal/70 leading-relaxed text-sm md:text-base pl-7">
                  Guests frequently ask to purchase their room handle upon check-out. Optional front-desk boutique packaging converts an amenity cost center into a premium hotel retail opportunity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 md:px-12 bg-charcoal text-warm-ivory text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif leading-tight mb-6 text-white">
            Experience the difference firsthand.
          </h2>
          <p className="text-soft-sand text-base md:text-lg mb-8 max-w-xl mx-auto">
            Request an evaluation kit for your property's rooms division and executive committee.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/demo"
              className="inline-flex items-center justify-center gap-2 bg-accent-orange text-white px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-md"
            >
              <span>Request a Demo Kit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/for-hotels"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all"
            >
              <span>View Commercial Benefits</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
