import propertiesData from '@/data/properties.json';
import PropertyCard from '@/components/PropertyCard';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Home"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 to-gray-900/80"></div>
        </div>

        <div className="container relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight leading-tight">
            Encuentra tu refugio <br />en el <span className="text-accent italic">Mediterráneo</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 font-light">
            Selección exclusiva de propiedades de lujo en las ubicaciones más deseadas de España.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#catalog" className="btn px-10 py-4 text-lg">Explorar Catálogo</a>
            <a href="#" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-md font-medium hover:bg-white/20 transition-all">Contáctanos</a>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Nuestro Catálogo</h2>
              <p className="text-text-muted max-w-md">
                Mostrando {propertiesData.length} propiedades disponibles. Filtrado por exclusividad y diseño.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="text-gray-400 font-normal italic lowercase">{propertiesData.length} resultados encontrados</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {propertiesData.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white py-24 border-t border-b border-gray-100">
        <div className="container text-center">
          <h2 className="text-3xl font-serif font-bold mb-16">¿Por qué elegir SunTzu Real Estate?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold mb-3">Exclusividad Garantizada</h4>
              <p className="text-sm text-text-muted">Solo trabajamos con las mejores propiedades del mercado, asegurando calidad y distinción.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h4 className="font-bold mb-3">Ubicaciones Prime</h4>
              <p className="text-sm text-text-muted">Menorca, Ibiza, Costa Cantábrica y las zonas más premium de Madrid.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold mb-3">Asesoramiento Integral</h4>
              <p className="text-sm text-text-muted">Te acompañamos en todo el proceso de compra con transparencia y profesionalidad.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
