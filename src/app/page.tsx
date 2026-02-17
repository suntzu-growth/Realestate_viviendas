import propertiesData from '@/data/properties.json';
import PropertyCard from '@/components/PropertyCard';

export default function Home() {
  return (
    <div className="pt-20">
      {/* Cinematic Hero Section */}
      <section className="relative h-[90vh] flex items-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95"
            alt="Luxury Asset"
            className="w-full h-full object-cover opacity-50 transition-transform duration-[10000ms] ease-out scale-110 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl animate-fade-in">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent mb-8 block">
              Exclusive Real Estate
            </span>
            <h1 className="text-6xl md:text-[7rem] font-serif font-bold mb-10 leading-[0.9] tracking-tighter">
              El arte de vivir<br />en el <span className="italic">Mediterráneo</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-12 font-light leading-relaxed">
              Curamos las propiedades más excepcionales en las ubicaciones más prestigiosas de España para aquellos que buscan algo extraordinario.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <a href="#catalog" className="btn btn-accent px-12">Ver Colección</a>
              <a href="#" className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase hover:text-accent transition-colors group">
                Contactar ahora <span className="w-8 h-px bg-gray-500 group-hover:bg-accent transition-colors"></span>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-4 opacity-40">
          <span className="text-[9px] font-bold tracking-[0.3em] uppercase [writing-mode:vertical-lr]">Explore</span>
          <div className="w-px h-16 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="section-padding bg-white">
        <div className="container">
          <div className="flex flex-col items-center text-center mb-32">
            <span className="text-accent text-[10px] font-bold tracking-[0.5em] uppercase mb-6">The Portfolio</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 tracking-tight">Propiedades Curadas</h2>
            <div className="w-20 h-px bg-accent mt-12 mb-6"></div>
            <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">
              {propertiesData.length} joyas arquitectónicas disponibles
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-32 gap-x-16">
            {propertiesData.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding bg-accent-light/30 border-t border-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-24 items-center">
            <div className="md:col-span-5">
              <h3 className="text-4xl md:text-5xl font-serif font-bold mb-10 leading-tight">Privacidad, Exclusividad y Diseño</h3>
              <p className="text-gray-500 leading-relaxed mb-12 font-light text-lg">
                Entendemos que una casa no es solo un lugar, es un destino. Por eso, cada propiedad en nuestra cartera ha sido seleccionada personalmente por su valor arquitectónico y su ubicación inigualable.
              </p>
              <div className="space-y-12">
                <div className="flex gap-8 items-start">
                  <span className="text-accent font-serif text-3xl italic">01.</span>
                  <div>
                    <h4 className="font-bold text-[10px] tracking-[0.3em] uppercase mb-3 text-primary">Prime Locations</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">Menorca, Ibiza, Madrid y Cantabria.</p>
                  </div>
                </div>
                <div className="flex gap-8 items-start">
                  <span className="text-accent font-serif text-3xl italic">02.</span>
                  <div>
                    <h4 className="font-bold text-[10px] tracking-[0.3em] uppercase mb-3 text-primary">Architectural Asset</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">Diseño contemporáneo y materiales nobles sustentables.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-6 md:col-start-7 aspect-[4/5] bg-gray-100 rounded-[3rem] overflow-hidden shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=95"
                alt="Architecture"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-primary text-white text-center">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-[5rem] font-serif font-bold mb-16 leading-tight tracking-tighter">Hablemos de su próximo refugio</h2>
            <a href="#" className="btn btn-accent px-16 py-8 text-sm">Agendar una visita personalizada</a>
          </div>
        </div>
      </section>
    </div>
  );
}
