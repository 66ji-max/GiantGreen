export default function LegalPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory">
      <section className="pt-32 pb-24 px-6 md:px-12 max-w-3xl mx-auto w-full">
        <h1 className="text-4xl font-serif mb-8">{title}</h1>
        <div className="prose prose-charcoal max-w-none space-y-6 text-charcoal/80">
          <p>
            <em>Note: This is a professional initial draft and requires legal review before final production use.</em>
          </p>
          <p>
            Welcome to GiantGreen EcoTech L.L.C. We respect your privacy and are committed to protecting your personal data.
          </p>
          <h2 className="text-2xl font-serif text-charcoal mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you request a Demo Kit, schedule a meeting, or contact us. This may include your name, email address, phone number, hotel property, and job title.
          </p>
          <h2 className="text-2xl font-serif text-charcoal mt-8 mb-4">2. How We Use Information</h2>
          <p>
            We use the information to fulfill your requests, communicate with you about our products, and improve our services. We apply data minimization principles and do not sell your personal data.
          </p>
          <h2 className="text-2xl font-serif text-charcoal mt-8 mb-4">3. Contact Us</h2>
          <p>
            If you have any questions, please contact us at giantgreenecotech@ggetapp.com.
          </p>
        </div>
      </section>
    </div>
  );
}
