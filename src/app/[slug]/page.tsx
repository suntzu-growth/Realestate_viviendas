import { notFound } from 'next/navigation';
import propertiesData from '@/data/properties.json';
import ImageGallery from '@/components/ImageGallery';

interface PropertyPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return propertiesData.map((p) => ({ slug: p.slug }));
}

export default async function PropertyPage({ params }: PropertyPageProps) {
    const { slug } = await params;
    const property = propertiesData.find((p) => p.slug === slug);
    if (!property) notFound();

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
        <div className="brochure-page">

            {/* ── 1. TÍTULO ── */}
            <div className="brochure-header">
                <a href="/" className="brochure-back">← Catálogo</a>
                <div className="brochure-ref">Ref #{property.id}</div>
                <h1 className="brochure-title">{property.title}</h1>
                <div className="brochure-price">{price} <span>€</span></div>
            </div>

            {/* ── 2. CARRUSEL ── */}
            <div className="brochure-gallery">
                <ImageGallery images={property.images} />
            </div>

            {/* ── 3. CARACTERÍSTICAS ── */}
            <div className="brochure-specs-wrap">
                <div className="brochure-specs">
                    {groupedSpecs.map((spec, i) => (
                        <div key={i} className="brochure-spec-item">
                            <span className="brochure-spec-label">{spec.label}</span>
                            <span className="brochure-spec-value">{spec.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── 4. DESCRIPCIÓN ── */}
            <div className="brochure-section">
                <div className="brochure-section-label">
                    <span className="brochure-line"></span>
                    Descripción
                </div>
                <p className="brochure-body">{description}</p>
            </div>

            {/* ── 5. POR QUÉ ES ÚNICA ── */}
            {unique && (
                <div className="brochure-unique">
                    <div className="brochure-section-label">
                        <span className="brochure-line"></span>
                        ¿Por qué es única?
                    </div>
                    <blockquote className="brochure-quote">"{unique}"</blockquote>
                </div>
            )}

            {/* ── 6. LOCALIZACIÓN ── */}
            {location && (
                <div className="brochure-section">
                    <div className="brochure-section-label">
                        <span className="brochure-line"></span>
                        Localización
                    </div>
                    <p className="brochure-body">{location}</p>
                </div>
            )}

            {/* ── CTA ── */}
            <div className="brochure-cta">
                <h3 className="brochure-cta-title">¿Te interesa esta propiedad?</h3>
                <div className="brochure-cta-btns">
                    <button className="btn btn-accent">Solicitar Dossier</button>
                    <a href="tel:+34912345678" className="btn btn-outline">+34 912 345 678</a>
                </div>
                <p className="brochure-cta-link">
                    Ficha original en{' '}
                    <a href={property.originalUrl} target="_blank" rel="noopener noreferrer">vivla.com</a>
                </p>
            </div>

        </div>
    );
}
