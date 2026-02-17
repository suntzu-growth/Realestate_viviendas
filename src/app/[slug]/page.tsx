import { notFound } from 'next/navigation';
import propertiesData from '@/data/properties.json';
import ImageGallery from '@/components/ImageGallery';

interface PropertyPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return propertiesData.map((property) => ({
        slug: property.slug,
    }));
}

export default async function PropertyPage({ params }: PropertyPageProps) {
    const { slug } = await params;
    const property = propertiesData.find((p) => p.slug === slug);

    if (!property) {
        notFound();
    }

    const price = property.specs.find(s => s.includes('Precio'))?.replace('Precio: ', '') || 'Consultar';

    // Group specs into pairs
    const groupedSpecs = [];
    const rawSpecs = property.specs.filter(s => !s.includes('Precio'));
    for (let i = 0; i < rawSpecs.length; i += 2) {
        if (isNaN(Number(rawSpecs[i]))) {
            groupedSpecs.push({ label: 'Estado', value: rawSpecs[i] });
            i--;
        } else {
            groupedSpecs.push({ label: rawSpecs[i + 1] || 'Info', value: rawSpecs[i] });
        }
    }

    const formatDescription = (text: string) => {
        const parts = text.split(/(¿Qué lo hace único\?:|Ubicación:)/);
        return parts.map((part, i) => {
            if (part === '¿Qué lo hace único?:' || part === 'Ubicación:') {
                return <h3 key={i} className="text-xl font-serif font-bold text-gray-900 mt-10 mb-4">{part}</h3>;
            }
            return <p key={i} className="text-gray-600 leading-relaxed text-lg mb-4">{part.trim()}</p>;
        });
    };

    return (
        <div className="pt-12 pb-24 bg-white">
            <div className="container">
                {/* Navigation Breadcrumb */}
                <nav className="flex mb-12 text-sm text-gray-400 gap-2 items-center">
                    <a href="/" className="hover:text-accent transition-colors">Catálogo</a>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <span className="text-gray-900 font-medium">{property.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Column: Images and Details */}
                    <div className="lg:col-span-7">
                        <ImageGallery images={property.images} />

                        <div className="mt-20">
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <span className="w-8 h-px bg-accent"></span>
                                Descripción
                            </h2>
                            <div className="prose prose-lg max-w-none">
                                {formatDescription(property.description)}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Sidebar with Specs and Action */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 bg-[#fafafa] rounded-[2.5rem] p-12 border border-gray-100 shadow-sm">
                            <div className="mb-10">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="bg-accent/10 text-accent text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                        REF: #{property.id}
                                    </span>
                                </div>
                                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight tracking-tight">{property.title}</h1>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-serif font-bold text-primary tracking-tighter">
                                        {price}
                                    </span>
                                    <span className="text-2xl font-sans font-medium text-gray-400">€</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-10 gap-x-4 mb-12 py-12 border-t border-b border-gray-200/60">
                                {groupedSpecs.map((spec, i) => (
                                    <div key={i} className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 uppercase tracking-[0.25em] font-bold mb-3">
                                            {spec.label}
                                        </span>
                                        <span className="text-3xl font-serif font-semibold text-gray-800 tracking-tight">
                                            {spec.value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <button className="w-full text-center py-6 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-accent transition-all duration-500 shadow-xl shadow-primary/10 hover:shadow-accent/30 active:scale-[0.98]">
                                    SOLICITAR INFORMACIÓN
                                </button>
                                <a
                                    href={property.originalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full text-center py-4 border-2 border-gray-200 text-gray-500 rounded-2xl font-bold text-xs tracking-widest hover:bg-white hover:border-accent hover:text-accent transition-all duration-500 block"
                                >
                                    VER EN VIVLA.COM
                                </a>
                            </div>

                            <div className="mt-12 pt-10 border-t border-gray-200/60 text-center">
                                <p className="text-[10px] text-gray-400 mb-3 font-bold tracking-[0.2em]">
                                    CONTACTO DIRECTO
                                </p>
                                <a href="tel:+34912345678" className="text-2xl font-serif font-bold text-primary hover:text-accent transition-colors tracking-tight">
                                    +34 912 345 678
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
