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

    // Improved spec detection
    const m2 = property.specs.find(s => s.includes('m2'))?.replace(' m2', '') ||
        property.specs.find((s, i) => property.specs[i + 1]?.includes('m2')) || '';

    const dorms = property.specs.find((s, i) => property.specs[i + 1] === 'Dormitorios') ||
        property.specs.find(s => s.includes('Dormitorios'))?.split(' ')[0] || '';

    return (
        <Link href={`/${property.slug}`} className="group block bg-white rounded-[2rem] overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2">
            <div className="aspect-[4/3] relative overflow-hidden">
                {property.images[0] ? (
                    <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">No Image</div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {property.specs.includes('VENDIDO') && (
                        <span className="bg-red-500/90 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                            Vendido
                        </span>
                    )}
                    {property.specs.includes('En construcción') && (
                        <span className="bg-blue-500/90 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                            En construcción
                        </span>
                    )}
                    {property.specs.includes('REVENTA') && (
                        <span className="bg-accent/90 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                            Reventa
                        </span>
                    )}
                </div>
            </div>

            <div className="p-8">
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3 truncate group-hover:text-accent transition-colors duration-300">
                    {property.title}
                </h3>

                <div className="flex items-center text-xs text-gray-400 font-bold tracking-widest uppercase gap-6 mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-900 text-sm">{dorms}</span> DORM
                    </div>
                    <div className="w-px h-3 bg-gray-200"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-900 text-sm">{m2}</span> M²
                    </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-serif font-bold text-primary tracking-tighter">
                            {price}
                        </span>
                        <span className="text-sm font-medium text-gray-400">€</span>
                    </div>
                    <span className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}
