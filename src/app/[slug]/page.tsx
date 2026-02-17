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

    const groupedSpecs: { value: string; label: string }[] = [];
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
        <div className="bg-[var(--bg)] min-h-screen">

            {/* ── Title Section ── */}
            <div className="pt-[4.5rem] pb-0">
                <div className="container pt-16 pb-12">
                    <div className="max-w-3xl">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-3 mb-8">
                            <a href="/" className="text-[0.6rem] font-semibold tracking-[0.25em] uppercase text-[var(--text-subtle)] hover:text-[var(--accent)] transition-colors">
                                Catálogo
                            </a>
                            <span className="text-[var(--border)] text-xs">/</span>
                            <span className="text-[0.6rem] font-semibold tracking-[0.25em] uppercase text-[var(--text-muted)]">
                                {property.title}
                            </span>
                        </div>

                        {/* Ref badge */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-6 h-px bg-[var(--accent)]"></div>
                            <span className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-[var(--accent)]">
                                Ref #{property.id}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-serif font-semibold text-[var(--primary)] mb-6 tracking-tight leading-[0.92]">
                            {property.title}
                        </h1>

                        <div className="flex items-baseline gap-2 mt-6">
                            <span className="price-display text-4xl md:text-5xl font-light text-[var(--primary)] tracking-tight">
                                {price}
                            </span>
                            <span className="text-xl text-[var(--text-subtle)] font-light">€</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Gallery ── */}
            <div className="mb-20">
                <div className="container">
                    <ImageGallery images={property.images} />
                </div>
            </div>

            {/* ── Main content ── */}
            <div className="container">
                <div className="max-w-3xl mx-auto">

                    {/* Specs grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 mb-20 border-t border-b border-[var(--border-light)]">
                        {groupedSpecs.map((spec, i) => (
                            <div key={i} className="text-center px-4">
                                <span className="block text-[0.58rem] text-[var(--text-subtle)] uppercase tracking-[0.25em] font-semibold mb-2.5">
                                    {spec.label}
                                </span>
                                <span className="price-display text-3xl font-light text-[var(--primary)]">
                                    {spec.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-8 h-px bg-[var(--accent)]"></div>
                            <h2 className="text-[0.65rem] font-semibold tracking-[0.35em] uppercase text-[var(--accent)]">
                                Descripción
                            </h2>
                        </div>
                        <div className="text-lg text-[var(--text-muted)] leading-relaxed font-light">
                            {description}
                        </div>
                    </div>

                    {/* Unique features */}
                    {unique && (
                        <div className="mb-20">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-8 h-px bg-[var(--accent)]"></div>
                                <h2 className="text-[0.65rem] font-semibold tracking-[0.35em] uppercase text-[var(--accent)]">
                                    ¿Por qué es única?
                                </h2>
                            </div>
                            <div className="relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)] opacity-40"></div>
                                <div className="pl-8">
                                    <p className="text-2xl md:text-3xl font-serif italic font-light text-[var(--primary)] leading-snug">
                                        "{unique}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Location */}
                    {location && (
                        <div className="mb-24">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-8 h-px bg-[var(--accent)]"></div>
                                <h2 className="text-[0.65rem] font-semibold tracking-[0.35em] uppercase text-[var(--accent)]">
                                    Localización
                                </h2>
                            </div>
                            <div className="text-lg text-[var(--text-muted)] leading-relaxed font-light">
                                {location}
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="pb-32 pt-16 border-t border-[var(--border-light)]">
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="w-8 h-px bg-[var(--accent)]"></div>
                                <span className="text-[0.65rem] font-semibold tracking-[0.35em] uppercase text-[var(--accent)]">Interesado</span>
                                <div className="w-8 h-px bg-[var(--accent)]"></div>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-serif font-semibold text-[var(--primary)] mb-4 tracking-tight">
                                ¿Te interesa esta propiedad?
                            </h3>
                            <p className="text-[var(--text-muted)] text-sm font-light max-w-sm mx-auto">
                                Contacta con nosotros para recibir información detallada o concertar una visita.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button className="btn btn-accent px-12 py-4">
                                Solicitar Dossier
                            </button>
                            <a href="tel:+34912345678" className="btn btn-outline px-12 py-4">
                                +34 912 345 678
                            </a>
                        </div>

                        <p className="mt-10 text-[var(--text-subtle)] text-xs text-center font-light">
                            Ficha original en{' '}
                            <a href={property.originalUrl} target="_blank" rel="noopener noreferrer"
                               className="underline underline-offset-4 hover:text-[var(--accent)] transition-colors">
                                vivla.com
                            </a>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
