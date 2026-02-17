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

    // Group specs into pairs
    const groupedSpecs = [];
    const rawSpecs = property.specs.filter(s => !s.includes('Precio'));
    for (let i = 0; i < rawSpecs.length; i += 2) {
        if (rawSpecs[i + 1]) {
            groupedSpecs.push({ label: rawSpecs[i + 1], value: rawSpecs[i] });
        }
    }

    return (
        <Link href={`/${property.slug}`} className="group block">
            <div className="aspect-[4/5] relative overflow-hidden bg-gray-50 mb-8 rounded-[2rem] transition-all duration-700 hover:rounded-none">
                {property.images[0] ? (
                    <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">No Image</div>
                )}

                <div className="absolute top-8 left-8">
                    {property.specs.includes('VENDIDO') && (
                        <span className="bg-black text-[9px] text-white font-bold px-3 py-1.5 uppercase tracking-widest backdrop-blur-md">
                            Vendido
                        </span>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2 tracking-tight group-hover:text-accent transition-colors duration-500">
                    {property.title}
                </h3>

                <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-6">
                    {groupedSpecs.slice(0, 2).map((spec, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span>{spec.value}</span>
                            <span className="text-gray-200">/</span>
                            <span className="opacity-60">{spec.label}</span>
                        </div>
                    ))}
                </div>

                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-primary tracking-tighter">
                        {price}
                    </span>
                    <span className="text-base font-normal text-gray-400">€</span>
                </div>
            </div>
        </Link>
    );
}
