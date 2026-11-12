import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Image from '../components/Image';
import { siteConfig, getWhatsAppLink, WHATSAPP_PRESETS } from '../config/site';
import { MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForHotels() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 md:px-12 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-warm-bronze mb-3 block">
            Hospitality Operations & ESG
          </span>
          <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-6 text-espresso-brown">
            Value that scales with your property.
          </h1>
          <p className="text-lg md:text-xl text-charcoal/70 font-light max-w-2xl mx-auto leading-relaxed">
            Designed to elevate guest perception while harmonizing with housekeeping realities and corporate sustainability commitments.
          </p>
        </motion.div>
      </section>

      {/* Pillar A: Guest Experience */}
      <section className="py-20 px-6 md:px-12 border-t border-soft-sand/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 w-full h-[400px] rounded-sm overflow-hidden shadow-lg border border-soft-sand/30">
            <Image
              src="/visual-assets/product/jyanty-hero-landscape-02.jpg"
              alt="Elevated Guest Experience with JYANTY"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-warm-bronze mb-3 block">
              Pillar A &middot; Guest Perception
            </span>
            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-charcoal">
              A more memorable, tactile room experience.
            </h2>
            <p className="text-charcoal/70 mb-6 leading-relaxed">
              When guests pay for five-star hospitality, disposable plastic amenities send an inadvertent signal of cost-cutting. JYANTY replaces this with a bespoke, satisfying instrument that guests appreciate every morning and evening.
            </p>
            <ul className="space-y-3.5 text-base text-charcoal/85">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent-orange shrink-0 mt-0.5" />
                <span>Significant improvement in tactile weight, balance, and aesthetic appeal.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent-orange shrink-0 mt-0.5" />
                <span>Eliminates the disposable perception of cheap throwaway plastic toothbrushes.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent-orange shrink-0 mt-0.5" />
                <span>Reinforces your hotel’s meticulous attention to high-end bathroom amenities.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pillar B: Sustainability */}
      <section className="py-20 px-6 md:px-12 bg-white border-t border-soft-sand/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="flex-1 w-full h-[400px] rounded-sm overflow-hidden shadow-lg border border-soft-sand/30">
            <Image
              src="/visual-assets/backgrounds/warm-botanical-shadow-background.jpg"
              alt="Sustainability and plastic waste reduction"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-eco-green mb-3 block">
              Pillar B &middot; Sustainability & ESG
            </span>
            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-charcoal">
              Practical plastic reduction without guest sacrifice.
            </h2>
            <p className="text-charcoal/70 mb-6 leading-relaxed">
              Achieving sustainability goals often requires balancing eco-conscious decisions with luxury expectations. JYANTY delivers dramatic plastic weight reduction while enhancing, rather than compromising, guest comfort.
            </p>
            <ul className="space-y-3.5 text-base text-charcoal/85 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-eco-green shrink-0 mt-0.5" />
                <span>Massive reduction in solid plastic waste discarded per occupied room night.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-eco-green shrink-0 mt-0.5" />
                <span>Tangible proof point for corporate ESG metrics and sustainability audits.</span>
              </li>
            </ul>
            <div className="bg-warm-ivory p-5 border-l-4 border-eco-green rounded-r text-xs text-charcoal/80 leading-relaxed italic">
              "Future recycling partnerships are being actively explored as part of our longer-term closed-loop hospitality roadmap."
            </div>
          </div>
        </div>
      </section>

      {/* Pillar C: Operational Value */}
      <section className="py-20 px-6 md:px-12 border-t border-soft-sand/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 w-full h-[400px] rounded-sm overflow-hidden shadow-lg border border-soft-sand/30">
            <Image
              src="/visual-assets/backgrounds/warm-wood-stone-background.jpg"
              alt="Housekeeping and operational adaptability"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-warm-bronze mb-3 block">
              Pillar C &middot; Operational Feasibility
            </span>
            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-charcoal">
              Engineered for seamless housekeeping operations.
            </h2>
            <p className="text-charcoal/70 mb-6 leading-relaxed">
              We design specifically for real-world hotel operations. Housekeeping turnover times remain swift and standardized, with minimal cart footprint.
            </p>
            <ul className="space-y-3.5 text-base text-charcoal/85">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-warm-bronze shrink-0 mt-0.5" />
                <span>Less unnecessary full-replacement during multi-night extended guest stays.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-warm-bronze shrink-0 mt-0.5" />
                <span>Start with a controlled pilot on a single floor without requiring immediate property-wide capital expenditure.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-warm-bronze shrink-0 mt-0.5" />
                <span>Optional front-desk boutique purchase options generate high-margin retail revenue.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pilot CTA */}
      <section className="py-24 px-6 md:px-12 bg-charcoal text-center text-warm-ivory border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-6 text-white">
            Discuss a controlled pilot for your property.
          </h2>
          <p className="text-soft-sand text-base mb-8 max-w-lg mx-auto">
            Review the operational workflow, evaluate the physical sample, and structure a custom pilot for your executive suites.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/demo"
              className="inline-flex items-center justify-center gap-2 bg-accent-orange text-white px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-md"
            >
              <span>Request a Demo Kit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={getWhatsAppLink(WHATSAPP_PRESETS.homePilot)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-eco-green" />
              <span>Discuss on WhatsApp ({siteConfig.contact.phoneDisplay})</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
