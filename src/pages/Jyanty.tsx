import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Image from '../components/Image';

export default function Jyanty() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory">
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-6">
              A more considered approach to in-room brushing.
            </h1>
            <p className="text-xl text-charcoal/70 font-light mb-8 max-w-lg">
              A refined reusable handle, paired with a fresh sealed brush head for every new stay.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full h-[500px]"
          >
            <Image 
              src="/visual-assets/product/jyanty-lifestyle-portrait-02.jpg" 
              alt="JYANTY Handle"
              className="w-full h-full object-cover rounded-sm"
              fallbackColor="bg-soft-sand"
            />
          </motion.div>
        </div>
      </section>

      {/* Details */}
      <section className="py-24 bg-white text-charcoal px-6 md:px-12 border-y border-soft-sand/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-serif mb-4">Premium Reusable Handle</h3>
              <p className="text-charcoal/70 leading-relaxed text-lg">
                Crafted for durability and aesthetic appeal. The handle remains in the room, reducing the volume of plastic discarded daily while providing a superior brushing experience.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-serif mb-4">Fresh Sealed Brush Heads</h3>
              <p className="text-charcoal/70 leading-relaxed text-lg">
                Housekeeping provides a new, hygienically sealed brush head for every new stay.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-serif mb-4">Long-Stay Efficiency</h3>
              <p className="text-charcoal/70 leading-relaxed text-lg">
                Unnecessary full-toothbrush disposal is significantly reduced during longer stays, addressing a major pain point in hotel waste management.
              </p>
            </div>
          </div>
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-serif mb-4">Compatible Supply Chain</h3>
              <p className="text-charcoal/70 leading-relaxed text-lg">
                Toothpaste remains independently packaged, ensuring compatibility with your current hotel supply processes and preferred brands.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-serif mb-4">Controlled Pilots</h3>
              <p className="text-charcoal/70 leading-relaxed text-lg">
                We support small and controlled pilots. Start with a single executive floor to measure guest satisfaction before property-wide deployment.
              </p>
            </div>
             <div>
              <h3 className="text-2xl font-serif mb-4">Future Revenue Potential</h3>
              <p className="text-charcoal/70 leading-relaxed text-lg">
                Future front-desk purchase or guest repurchase options may be supported, turning an expense into a potential revenue stream.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 md:px-12 bg-charcoal text-warm-ivory text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-serif leading-tight mb-8">
            Experience the difference firsthand.
          </h2>
          <Link 
            to="/demo"
            className="inline-block bg-accent-orange text-white px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all"
          >
            Request a Demo Kit
          </Link>
        </div>
      </section>
    </div>
  );
}
