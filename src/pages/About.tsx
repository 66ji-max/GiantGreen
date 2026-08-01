import Image from '../components/Image';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory">
      <section className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-8">About GiantGreen EcoTech</h1>
          <p className="text-xl text-charcoal/70 font-light mb-12">
            A focused company developing guest-experience and sustainable amenity solutions for luxury hotels.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="w-full h-[400px] mb-20">
             <Image src="/visual-assets/product/jyanty-hero-landscape-01.jpg" alt="About GiantGreen" className="w-full h-full object-cover" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-serif mb-6">Our Philosophy</h2>
              <p className="text-lg leading-relaxed text-charcoal/80 mb-6">
                We believe that the true essence of a luxury hotel stay lies in the meticulous attention to overlooked details. By replacing generic, disposable amenities with refined, purpose-built systems, we elevate the guest experience without adding unnecessary complexity.
              </p>
              <p className="text-lg leading-relaxed text-charcoal/80">
                Our approach to sustainability is practical and controlled. We collaborate closely with hotel operators to implement solutions that fit their unique operational flows, ensuring that ecological improvements also deliver tangible guest satisfaction and operational value.
              </p>
            </div>
            
            <div className="bg-white p-10 border border-soft-sand/30 flex flex-col justify-center">
               <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-warm-bronze mb-8">Company Details</h3>
               <ul className="space-y-6">
                 <li>
                   <strong className="block text-charcoal font-medium">Legal Entity</strong>
                   <span className="text-charcoal/70 text-lg">GiantGreen EcoTech L.L.C.</span>
                 </li>
                 <li>
                   <strong className="block text-charcoal font-medium">Headquarters</strong>
                   <span className="text-charcoal/70 text-lg">United States</span>
                 </li>
                 <li>
                   <strong className="block text-charcoal font-medium">Market Operations</strong>
                   <span className="text-charcoal/70 text-lg">Malaysia</span>
                 </li>
                 <li>
                   <strong className="block text-charcoal font-medium">Founder</strong>
                   <span className="text-charcoal/70 text-lg">Joseph Lee</span>
                 </li>
               </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
