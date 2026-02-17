import propertiesData from '@/data/properties.json';
import PropertyCard from '@/components/PropertyCard';

export default function Home() {
  return (
    <div className="pt-[4.5rem]">

      {/* ── Hero ── */}
      <section className="relative h-screen flex items-end bg-[var(--primary)] text-white overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95"
            alt="Luxury Property"
            className="w-full h-full object-cover opacity-45 scale-105"
            style={{ transition: 'transform 12s ease-out', transform: 'scale(1)' }}
          />
          {/* Gradient: stronger at bottom for text legibility, subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div>
        </div>

        {/* Decorative top label */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Content */}
        <div className="container relative z-10 pb-20 md:pb-28">
          <div className="max-w-5xl">
            {/* Eyebrow */}
            <div className="animate-fade-in flex items-center gap-4 mb-8">
              <div className="w-8 h-px bg-[var(--accent)]"></div>
              <span className="text-[0.65rem] font-semibold tracking-[0.45em] uppercase text-[var(--accent)]">
                Exclusive Real Estate · España
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-delay text-[3.5rem] sm:text-[5rem] md:text-[7.5rem] font-serif font-semibold leading-[0.88] tracking-[-0.02em] mb-10">
              El arte de vivir<br />
              en el{' '}
              <em className="italic font-light" style={{ color: 'var(--accent)' }}>
                Mediterráneo
              </em>
            </h1>

            {/* Subhead + CTA row */}
            <div className="animate-fade-in-delay-2 flex flex-col md:flex-row md:items-end gap-10 md:gap-20">
              <p className="text-base text-white/55 max-w-md font-light leading-relaxed">
                Curamos las propiedades más excepcionales en las ubicaciones más prestigiosas de España para quienes buscan algo verdaderamente extraordinario.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 shrink-0">
                <a href="#catalog" className="btn btn-accent px-10 py-4">
                  Ver Colección
                </a>
                <a href="#" className="btn btn-outline-white px-10 py-4">
                  Contactar
                </a>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="animate-fade-in-delay-2 mt-16 pt-10 border-t border-white/10 grid grid-cols-3 gap-8 max-w-lg">
            {[
              { value: `${propertiesData.length}`, label: 'Propiedades' },
              { value: '4', label: 'Destinos' },
              { value: '€1M+', label: 'Precio desde' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-serif font-light text-white/90 tracking-tight">{value}</div>
                <div className="text-[0.6rem] font-bold tracking-[0.25em] uppercase text-white/30 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 right-10 hidden md:flex flex-col items-center gap-3 opacity-30">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-white"></div>
          <span className="text-[0.55rem] font-bold tracking-[0.35em] uppercase [writing-mode:vertical-lr] rotate-180">
            Scroll
          </span>
        </div>
      </section>


      {/* ── Catalog ── */}
      <section id="catalog" className="section-padding bg-[var(--bg)]">
        <div className="container">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-24 gap-6">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-[var(--accent)]"></div>
                <span className="text-[0.65rem] font-semibold tracking-[0.4em] uppercase text-[var(--accent)]">The Portfolio</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-semibold text-[var(--primary)] tracking-tight leading-none">
                Propiedades<br /><em className="font-light italic">Curadas</em>
              </h2>
            </div>
            <p className="text-[var(--text-muted)] text-sm font-light max-w-xs leading-relaxed md:text-right">
              {propertiesData.length} joyas arquitectónicas seleccionadas por su valor excepcional y ubicación inigualable.
            </p>
          </div>

          {/* Property grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
            {propertiesData.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>


      {/* ── Philosophy ── */}
      <section className="section-padding bg-white border-t border-[var(--border-light)]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            {/* Image */}
            <div className="relative order-2 md:order-1">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl shadow-black/10">
                <img
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=95"
                  alt="Architecture of Luxury"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1400ms] ease-out"
                />
              </div>
              {/* Floating accent box */}
              <div className="absolute -bottom-8 -right-8 hidden md:block bg-[var(--accent)] text-white p-8 max-w-[200px]">
                <div className="text-3xl font-serif font-light leading-none mb-2">15+</div>
                <div className="text-[0.6rem] font-bold tracking-[0.25em] uppercase opacity-80">Años de experiencia</div>
              </div>
            </div>

            {/* Text */}
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-px bg-[var(--accent)]"></div>
                <span className="text-[0.65rem] font-semibold tracking-[0.4em] uppercase text-[var(--accent)]">Nuestra Filosofía</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-serif font-semibold mb-8 leading-tight tracking-tight">
                Privacidad,<br />Exclusividad<br />y <em className="italic font-light">Diseño</em>
              </h3>
              <p className="text-[var(--text-muted)] leading-relaxed mb-12 font-light text-base">
                Entendemos que una casa no es solo un lugar, es un destino. Cada propiedad en nuestra cartera ha sido seleccionada personalmente por su valor arquitectónico y su ubicación inigualable.
              </p>
              <div className="space-y-8">
                {[
                  {
                    num: '01',
                    title: 'Prime Locations',
                    body: 'Menorca, Ibiza, Madrid y Cantabria.',
                  },
                  {
                    num: '02',
                    title: 'Architectural Asset',
                    body: 'Diseño contemporáneo y materiales nobles sustentables.',
                  },
                  {
                    num: '03',
                    title: 'Servicio Personalizado',
                    body: 'Acompañamiento exclusivo de principio a fin.',
                  },
                ].map(({ num, title, body }) => (
                  <div key={num} className="flex gap-6 items-start group">
                    <span className="font-serif text-2xl italic text-[var(--accent)] opacity-70 shrink-0 pt-0.5 group-hover:opacity-100 transition-opacity">
                      {num}.
                    </span>
                    <div>
                      <h4 className="font-semibold text-[0.65rem] tracking-[0.25em] uppercase mb-2 text-[var(--primary)]">{title}</h4>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden bg-[var(--primary)] text-white">
        {/* Decorative background texture */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}>
        </div>
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[var(--accent)]/5 to-transparent"></div>

        <div className="container relative z-10 py-32 md:py-40">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="w-12 h-px bg-[var(--accent)]"></div>
              <span className="text-[0.65rem] font-semibold tracking-[0.4em] uppercase text-[var(--accent)]">Su próximo paso</span>
              <div className="w-12 h-px bg-[var(--accent)]"></div>
            </div>
            <h2 className="text-5xl md:text-[5.5rem] font-serif font-semibold mb-8 leading-[0.92] tracking-tight">
              Hablemos de su<br /><em className="italic font-light">próximo refugio</em>
            </h2>
            <p className="text-white/40 text-base font-light max-w-md mx-auto mb-14 leading-relaxed">
              Nuestro equipo está disponible para acompañarle en cada paso de la búsqueda de su propiedad ideal.
            </p>
            <a href="#" className="btn btn-accent px-16 py-5 text-sm">
              Agendar una visita personalizada
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
