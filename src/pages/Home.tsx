import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from '../components/Image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/visual-assets/product/jyanty-hero-landscape-01.jpg" 
            alt="JYANTY Premium Guest-room Amenity"
            className="w-full h-full object-cover"
            fallbackColor="bg-espresso-brown"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso-brown/90 via-espresso-brown/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 text-warm-ivory">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase mb-4 text-champagne">
              GiantGreen EcoTech<br/>
              <span className="opacity-80">U.S.-headquartered &middot; Malaysia market operations</span>
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-light leading-tight mb-6 text-white">
              Elevating the smallest details of the luxury hotel stay.
            </h1>
            <p className="text-lg md:text-xl text-soft-sand font-light leading-relaxed mb-10 max-w-xl">
              GiantGreen EcoTech develops focused guest-room amenity solutions that improve perceived quality, reduce single-use plastic and support more efficient hotel operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Link 
                to="/demo"
                className="bg-accent-orange text-white px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all text-center w-full sm:w-auto"
              >
                Request a Demo Kit
              </Link>
              <a 
                href={import.meta.env.VITE_GOOGLE_BOOKING_URL || '#'}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 rounded-full font-semibold text-white border border-white/30 hover:bg-white/10 transition-all text-center w-full sm:w-auto"
              >
                Book 15 Minutes
              </a>
            </div>
            
            <a 
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '601124028365'}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-8 text-sm font-medium text-champagne hover:text-white underline underline-offset-4 transition-colors"
            >
              Speak on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* Section 1: The overlooked detail */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-warm-ivory text-charcoal">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 md:pr-12">
            <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6">
              The amenity guests touch twice a day should not feel disposable.
            </h2>
            <div className="w-12 h-px bg-warm-bronze mb-8"></div>
            <p className="text-lg leading-relaxed text-charcoal/80 mb-6">
              Traditional plastic toothbrushes often feel inconsistent with an otherwise carefully designed luxury-room experience. They are inherently disposable, generic, and contribute significantly to plastic waste.
            </p>
            <p className="text-lg leading-relaxed text-charcoal/80">
              We believe the smallest touchpoints hold the greatest opportunity to reinforce your property's commitment to quality and sustainability.
            </p>
          </div>
          <div className="flex-1 w-full h-[500px]">
             <Image 
              src="/visual-assets/product/jyanty-lifestyle-portrait-01.jpg" 
              alt="JYANTY detail"
              className="w-full h-full object-cover rounded-sm shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Section 2: How the JYANTY system works */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-charcoal text-warm-ivory relative">
         <div className="absolute inset-0 opacity-10">
          <Image 
            src="/visual-assets/backgrounds/jyanty-minimal-detail-background.jpg" 
            alt="Minimal background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6 text-white">
              A more considered approach.
            </h2>
            <p className="text-lg text-soft-sand font-light">
              How the JYANTY system integrates seamlessly into your housekeeping operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: 'Reusable Handle', desc: 'A high-quality reusable electric handle remains in the room.' },
              { title: 'Fresh Brush Head', desc: 'A fresh, sealed brush head is provided for each new stay.' },
              { title: 'Packaged Toothpaste', desc: 'Independently packaged toothpaste remains compatible with your existing supply.' },
              { title: 'Controlled Pilot', desc: 'Begin with selected rooms, suites, or an executive floor.' }
            ].map((step, index) => (
              <div key={index} className="flex flex-col">
                <div className="text-4xl font-serif text-champagne opacity-50 mb-4">0{index + 1}</div>
                <div className="h-px w-full bg-white/10 mb-6"></div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-soft-sand leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Three forms of value */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-warm-ivory text-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6">
              Three forms of value.
            </h2>
          </div>

          <div className="flex flex-col gap-24">
            {/* Value 1 */}
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-warm-bronze mb-4">01 &middot; Guest Experience</h3>
                <h4 className="text-3xl font-serif mb-6">A more memorable room experience.</h4>
                <p className="text-lg leading-relaxed text-charcoal/80">
                  Improve tactile and visual quality, reducing the perception of a generic disposable amenity. JYANTY reinforces your hotel's attention to detail with every use.
                </p>
              </div>
              <div className="flex-1 w-full h-[300px]">
                <Image src="/visual-assets/product/jyanty-hero-landscape-02.jpg" alt="Guest Experience" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Value 2 */}
            <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
              <div className="flex-1">
                <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-eco-green mb-4">02 &middot; Sustainability</h3>
                <h4 className="text-3xl font-serif mb-6">Support for your ESG goals.</h4>
                <p className="text-lg leading-relaxed text-charcoal/80">
                  Significantly reduce the disposal of full plastic toothbrushes. Future recycling partnerships are being explored as part of our longer-term closed-loop roadmap.
                </p>
              </div>
              <div className="flex-1 w-full h-[300px]">
                <Image src="/visual-assets/backgrounds/warm-botanical-shadow-background.jpg" alt="Sustainability" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Value 3 */}
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-warm-bronze mb-4">03 &middot; Operational Value</h3>
                <h4 className="text-3xl font-serif mb-6">Efficient and adaptable.</h4>
                <p className="text-lg leading-relaxed text-charcoal/80">
                  Experience less unnecessary replacement during longer stays. You can start with small-scale, controlled pilots without the requirement for immediate property-wide rollout.
                </p>
              </div>
              <div className="flex-1 w-full h-[300px]">
                <Image src="/visual-assets/backgrounds/warm-wood-stone-background.jpg" alt="Operational Value" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 & 5: Designed for a controlled pilot & Suitable properties */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-soft-sand/20 text-charcoal border-t border-soft-sand/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
          <div className="flex-1">
            <h2 className="text-3xl font-serif mb-6">Designed for a controlled pilot.</h2>
            <p className="text-lg leading-relaxed text-charcoal/80 mb-6">
              We understand that implementing a new amenity requires careful evaluation. Hotels can begin JYANTY deployment in selected suites, an executive floor, long-stay rooms, or a small group of pilot rooms to assess guest feedback and operational flow.
            </p>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-serif mb-6">Suitable properties.</h2>
            <ul className="space-y-4">
              {['Luxury city hotels', 'Resorts', 'Boutique hotels', 'Serviced residences', 'Executive and club floors', 'Properties with sustainability targets'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-lg text-charcoal/80">
                  <CheckCircle2 className="w-5 h-5 text-warm-bronze" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 6: Demo Kit CTA */}
      <section className="py-32 px-6 md:px-12 bg-charcoal text-warm-ivory text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8 text-white">
            Evaluate JYANTY in the context of your property.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/demo"
              className="bg-accent-orange text-white px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all text-center"
            >
              Request a Compact Demo Kit
            </Link>
            <a 
              href={import.meta.env.VITE_GOOGLE_BOOKING_URL || '#'}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-full font-semibold text-white border border-white/30 hover:bg-white/10 transition-all text-center"
            >
              Schedule a 15-Minute Presentation
            </a>
          </div>
          <div className="mt-8">
            <a 
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '601124028365'}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-champagne hover:text-white underline underline-offset-4 transition-colors"
            >
              Speak on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Section 7: FAQ */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-warm-ivory text-charcoal">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif mb-16 text-center">Frequently Asked Questions</h2>
          <div className="space-y-12">
            {[
              {
                q: 'Does a hotel need to deploy JYANTY across the entire property?',
                a: 'No. You can start with a limited pilot on an executive floor, in select suites, or long-stay rooms to evaluate the workflow and guest reception.'
              },
              {
                q: 'How is a fresh brush head provided for each stay?',
                a: 'Housekeeping replaces the sealed brush head during the room turnover process, leaving the sanitized, reusable handle in place.'
              },
              {
                q: 'Can JYANTY work with our existing toothpaste supplier?',
                a: 'Yes. JYANTY focuses on the brushing instrument. You may continue to use your preferred independently packaged toothpaste.'
              },
              {
                q: 'Is recycling already available?',
                a: 'Future recycling partnerships are being explored as part of our longer-term closed-loop roadmap.'
              },
              {
                q: 'Is pricing published online?',
                a: 'No. Pricing and commercial terms are discussed directly after reviewing your property\'s specific needs and pilot scope. Request a Demo Kit to begin the conversation.'
              }
            ].map((faq, i) => (
              <div key={i} className="border-b border-soft-sand pb-8">
                <h4 className="text-xl font-semibold mb-3 font-serif">{faq.q}</h4>
                <p className="text-charcoal/70 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
