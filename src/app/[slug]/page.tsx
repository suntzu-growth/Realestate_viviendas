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

    const sections = property.description.split(/(¿Qué lo hace único\?:|Ubicación:)/);
    const description = sections[0].trim();
    const unique = sections.find((_, i) => sections[i - 1] === '¿Qué lo hace único?:')?.trim();
    const location = sections.find((_, i) => sections[i - 1] === 'Ubicación:')?.trim();

    return (
        <div className="bg-white min-h-screen">
            {/* 1. Title Section */}
            <div className="pt-16 pb-12">
                <div className="container max-w-4xl text-center">
                    <span className="bg-accent/10 text-accent text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6 inline-block">
                        REF: #{property.id}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                        {property.title}
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-4xl font-serif font-bold text-primary">{price}</span>
                        <span className="text-xl text-gray-400">€</span>
                    </div>
                </div>
            </div>

            {/* 2. Carousel Section */}
            <div className="mb-20">
                <div className="container">
                    <ImageGallery images={property.images} />
                </div>
            </div>

            <div className="container max-w-4xl">
                {/* 3. Main Characteristics Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-b border-gray-100 mb-20 bg-gray-50/50 rounded-[2.5rem] px-8 md:px-12">
                    {groupedSpecs.map((spec, i) => (
                        <div key={i} className="text-center">
                            <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                                {spec.label}
                            </span>
                            <span className="text-2xl md:text-3xl font-serif font-bold text-gray-800">
                                {spec.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* 4. Description Section */}
                <div className="mb-20">
                    <h2 className="text-sm uppercase tracking-[0.3em] text-accent font-bold mb-8 flex items-center gap-4">
                        <span className="w-12 h-px bg-accent"></span>
                        Descripción
                    </h2>
                    <div className="prose prose-xl max-w-none text-gray-600 leading-relaxed font-light">
                        {description}
                    </div>
                </div>

                {/* 5. Unique Features Section */}
                {unique && (
                    <div className="mb-20">
                        <h2 className="text-sm uppercase tracking-[0.3em] text-accent font-bold mb-10 flex items-center gap-4">
                            <span className="w-12 h-px bg-accent"></span>
                            ¿Por qué es única?
                        </h2>
                        <div className="bg-accent-light/30 rounded-[2.5rem] p-10 md:p-16 border border-accent/10">
                            <p className="text-2xl md:text-3xl font-serif italic text-gray-800 leading-snug">
                                "{unique}"
                            </p>
                        </div>
                    </div>
                )}

                {/* 6. Location Section */}
                {location && (
                    <div className="mb-24">
                        <h2 className="text-sm uppercase tracking-[0.3em] text-accent font-bold mb-8 flex items-center gap-4">
                            <span className="w-12 h-px bg-accent"></span>
                            Localización
                        </h2>
                        <div className="text-xl text-gray-600 leading-relaxed font-light">
                            {location}
                        </div>
                    </div>
                )}

                {/* Footer CTA */}
                <div className="pb-32 text-center border-t border-gray-100 pt-20">
                    <h3 className="text-3xl font-serif font-bold mb-10">¿Te interesa esta propiedad?</h3>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button className="btn px-12 py-6 text-xl rounded-2xl shadow-2xl shadow-primary/20">
                            Solicitar Dossier Completo
                        </button>
                        <a href="tel:+34912345678" className="flex items-center justify-center gap-4 px-12 py-6 border-2 border-gray-100 rounded-2xl font-bold text-xl hover:border-accent transition-colors">
                            <span className="text-accent">Llámanos:</span> +34 912 345 678
                        </a>
                    </div>
                    <p className="mt-10 text-gray-400 text-sm">
                        O visítanos en <a href={property.originalUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">vivla.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
