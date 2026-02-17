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
    const m2 = property.specs.find(s => s.includes('m2'))?.replace(' m2', '') || '';
    const dorms = property.specs[0] === 'En construcción' || property.specs[0] === 'VENDIDO' || property.specs[0] === 'En Renovación' || property.specs[0] === 'REVENTA'
        ? property.specs[1]
        : property.specs[0];

    return (
        <Link href={`/${property.slug}`} className="card block group">
            <div className="aspect-[4/3] relative overflow-hidden bg-gray-200">
                {property.images[0] ? (
                    <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                    {property.specs.includes('VENDIDO') && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                            Vendido
                        </span>
                    )}
                    {property.specs.includes('En construcción') && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                            En construcción
                        </span>
                    )}
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-accent transition-colors">
                    {property.title}
                </h3>

                <div className="flex items-center text-sm text-gray-500 gap-4 mb-4">
                    <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900">{dorms}</span> Hab
                    </div>
                    <div className="w-px h-3 bg-gray-300"></div>
                    <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900">{m2}</span> m²
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-lg font-serif font-bold text-primary">
                        {price} <span className="text-xs font-sans font-normal text-gray-500">€</span>
                    </div>
                    <span className="text-sm font-medium text-accent hover:translate-x-1 transition-transform inline-flex items-center">
                        Ver más →
                    </span>
                </div>
            </div>
        </Link>
    );
}
