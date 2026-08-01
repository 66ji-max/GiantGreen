import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Image from '../components/Image';

export default function ForHotels() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 md:px-12 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-6">Value that scales with your property.</h1>
          <p className="text-xl text-charcoal/70 font-light">
            Designed to elevate the guest experience while aligning with operational realities and sustainability goals.
          </p>
        </motion.div>
      </section>

      {/* Guest Experience */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 w-full h-[400px]">
            <Image src="/visual-assets/product/jyanty-hero-landscape-02.jpg" alt="Guest Experience" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-warm-bronze mb-4">A. Guest Experience</h2>
            <h3 className="text-3xl font-serif mb-6">A more memorable room experience.</h3>
            <ul className="space-y-4 text-lg text-charcoal/80">
              <li className="flex gap-3"><span className="text-accent-orange">&bull;</span> Improved tactile and visual quality</li>
              <li className="flex gap-3"><span className="text-accent-orange">&bull;</span> Reduced perception of a generic disposable amenity</li>
              <li className="flex gap-3"><span className="text-accent-orange">&bull;</span> Reinforcement of the hotel's attention to detail</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="flex-1 w-full h-[400px]">
             <Image src="/visual-assets/backgrounds/warm-botanical-shadow-background.jpg" alt="Sustainability" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-eco-green mb-4">B. Sustainability</h2>
            <h3 className="text-3xl font-serif mb-6">Practical plastic reduction.</h3>
            <ul className="space-y-4 text-lg text-charcoal/80 mb-6">
              <li className="flex gap-3"><span className="text-eco-green">&bull;</span> Reduced disposal of full plastic toothbrushes</li>
              <li className="flex gap-3"><span className="text-eco-green">&bull;</span> Support for plastic-reduction and ESG goals</li>
            </ul>
            <div className="bg-soft-sand/20 p-6 border-l-4 border-eco-green">
              <p className="italic text-charcoal/80">
                "Future recycling partnerships are being explored as part of our longer-term closed-loop roadmap."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Value */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 w-full h-[400px]">
            <Image src="/visual-assets/backgrounds/warm-wood-stone-background.jpg" alt="Operational Value" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-warm-bronze mb-4">C. Operational Value</h2>
            <h3 className="text-3xl font-serif mb-6">Adaptable implementation.</h3>
             <ul className="space-y-4 text-lg text-charcoal/80">
              <li className="flex gap-3"><span className="text-accent-orange">&bull;</span> Less unnecessary replacement during longer stays</li>
              <li className="flex gap-3"><span className="text-accent-orange">&bull;</span> Small-scale and controlled pilots</li>
              <li className="flex gap-3"><span className="text-accent-orange">&bull;</span> No requirement for immediate property-wide rollout</li>
              <li className="flex gap-3"><span className="text-accent-orange">&bull;</span> Future guest purchase opportunities may create incremental hotel revenue</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-24 px-6 md:px-12 bg-charcoal text-center text-warm-ivory border-t border-white/10">
        <h2 className="text-3xl font-serif mb-8">Discuss a pilot for your property.</h2>
         <Link 
            to="/demo"
            className="inline-block bg-white text-charcoal px-8 py-4 rounded-full font-semibold hover:bg-soft-sand transition-all"
          >
            Request a Demo Kit
          </Link>
      </section>
    </div>
  );
}
