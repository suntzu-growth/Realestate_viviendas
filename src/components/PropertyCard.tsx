import Link from 'next/link';

interface PropertyCardProps {
    property: {
        id: string;
        slug: string;
        title: string;
        specs: string[];
        images: string[];
    };
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const price = property.specs.find(s => s.includes('Precio'))?.replace('Precio: ', '') || 'Consultar';
    const isSold = property.specs.includes('VENDIDO');

    const rawSpecs = property.specs.filter(s => !s.includes('Precio') && s !== 'VENDIDO');
    const keySpecs: { value: string; label: string }[] = [];
    for (let i = 0; i < rawSpecs.length; i += 2) {
        if (rawSpecs[i + 1]) {
            keySpecs.push({ value: rawSpecs[i], label: rawSpecs[i + 1] });
        }
    }

    return (
        <Link href={`/${property.slug}`} className="group block">
            {/* Image container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--border-light)] mb-6">
                {property.images[0] ? (
                    <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-108"
                        style={{ transformOrigin: 'center center' }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--text-subtle)]">
                        Sin imagen
                    </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-700"></div>

                {/* Sold badge */}
                {isSold && (
                    <div className="absolute top-5 left-5">
                        <span className="bg-[var(--primary)] text-white text-[0.58rem] font-bold px-3 py-1.5 uppercase tracking-[0.2em]">
                            Vendido
                        </span>
                    </div>
                )}

                {/* Hover: view cta */}
                <div className="absolute bottom-0 inset-x-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div className="bg-white/95 backdrop-blur-sm text-[var(--primary)] text-[0.65rem] font-bold tracking-[0.2em] uppercase py-3 text-center">
                        Ver Propiedad →
                    </div>
                </div>
            </div>

            {/* Info */}
            <div>
                {/* Specs row */}
                <div className="flex items-center gap-3 mb-3">
                    {keySpecs.slice(0, 3).map((spec, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                            {i > 0 && <span className="w-px h-3 bg-[var(--border)] inline-block"></span>}
                            <span className="text-[0.65rem] font-semibold text-[var(--text-muted)] tracking-wide">
                                {spec.value}
                            </span>
                            <span className="text-[0.6rem] text-[var(--text-subtle)] font-light">
                                {spec.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-serif font-semibold text-[var(--primary)] mb-3 tracking-tight leading-tight group-hover:text-[var(--accent)] transition-colors duration-500">
                    {property.title}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-1.5">
                    <span className="price-display text-2xl font-light text-[var(--primary)] tracking-tight">
                        {price}
                    </span>
                    <span className="text-sm font-light text-[var(--text-subtle)]">€</span>
                </div>
            </div>
        </Link>
    );
}
