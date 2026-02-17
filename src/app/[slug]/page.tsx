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

    return (
        <div className="pt-12 pb-24">
            <div className="container">
                {/* Navigation Breadcrumb */}
                <nav className="flex mb-12 text-sm text-gray-500 gap-2">
                    <a href="/" className="hover:text-accent underline underline-offset-4">Catálogo</a>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{property.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Column: Images and Details */}
                    <div className="lg:col-span-7">
                        <ImageGallery images={property.images} />

                        <div className="mt-16 prose prose-lg max-w-none">
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 border-b pb-4">
                                Descripción de la Propiedad
                            </h2>
                            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                                {property.description.split('\b').map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Sidebar with Specs and Action */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 bg-white rounded-3xl p-10 shadow-2xl shadow-gray-200 border border-gray-100">
                            <div className="mb-8">
                                <span className="badge mb-4">Referencia: #{property.id}</span>
                                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">{property.title}</h1>
                                <div className="text-5xl font-serif font-bold text-accent">
                                    {price} <span className="text-2xl font-sans font-normal text-gray-400">€</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-10 py-8 border-t border-b border-gray-100">
                                {property.specs.filter(s => !s.includes('Precio')).map((spec, i) => {
                                    // Logic to show icon-like feel for common specs
                                    const isNumber = !isNaN(Number(spec));
                                    return (
                                        <div key={i} className="flex flex-col">
                                            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                                                {property.specs[i + 1] || 'Info'}
                                            </span>
                                            <span className="text-xl font-medium text-gray-900">
                                                {spec}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="space-y-4">
                                <a href="#" className="w-full text-center py-5 bg-primary text-white rounded-xl font-bold text-lg hover:bg-accent transition-all block">
                                    Solicitar Información
                                </a>
                                <a
                                    href={property.originalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full text-center py-4 border-2 border-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all block"
                                >
                                    Ver en Vivla.com
                                </a>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                                <p className="text-sm text-gray-400">
                                    ¿Prefieres hablar con un asesor? <br />
                                    <a href="tel:+34912345678" className="text-primary font-bold hover:text-accent transition-colors">+34 912 345 678</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
