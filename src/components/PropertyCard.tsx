'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

interface PropertyCardProps {
    property: {
        id: string;
        slug: string;
        title: string;
        specs: string[];
        images: string[];
    };
}

// ── Modal carrusel ──────────────────────────────────────────────────────────
function ImageModal({ images, title, initialIndex, onClose }: {
    images: string[];
    title: string;
    initialIndex: number;
    onClose: () => void;
}) {
    const [active, setActive] = useState(initialIndex);

    const prev = useCallback(() => setActive(i => (i - 1 + images.length) % images.length), [images.length]);
    const next = useCallback(() => setActive(i => (i + 1) % images.length), [images.length]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [onClose, prev, next]);

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(0,0,0,0.92)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
            }}
            onClick={onClose}
        >
            {/* Close */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute', top: '1.25rem', right: '1.25rem',
                    color: '#fff', background: 'rgba(255,255,255,0.12)',
                    border: 'none', borderRadius: '50%',
                    width: '2.5rem', height: '2.5rem',
                    fontSize: '1.2rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                aria-label="Cerrar"
            >✕</button>

            {/* Main image */}
            <div
                style={{ position: 'relative', width: '90vw', maxWidth: '1100px', maxHeight: '75vh' }}
                onClick={e => e.stopPropagation()}
            >
                <img
                    src={images[active]}
                    alt={`${title} - ${active + 1}`}
                    style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', display: 'block' }}
                />

                {/* Prev */}
                {images.length > 1 && (
                    <button
                        onClick={prev}
                        style={{
                            position: 'absolute', left: '-3rem', top: '50%', transform: 'translateY(-50%)',
                            background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
                            width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                            fontSize: '1.1rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >‹</button>
                )}
                {/* Next */}
                {images.length > 1 && (
                    <button
                        onClick={next}
                        style={{
                            position: 'absolute', right: '-3rem', top: '50%', transform: 'translateY(-50%)',
                            background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
                            width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                            fontSize: '1.1rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >›</button>
                )}

                {/* Counter */}
                <div style={{
                    position: 'absolute', bottom: '-2rem', right: 0,
                    color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem',
                    letterSpacing: '0.15em',
                }}>{active + 1} / {images.length}</div>
            </div>

            {/* Thumbnails strip */}
            {images.length > 1 && (
                <div
                    style={{ display: 'flex', gap: '0.5rem', marginTop: '2.5rem', maxWidth: '90vw', overflowX: 'auto' }}
                    onClick={e => e.stopPropagation()}
                >
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            style={{
                                flexShrink: 0, width: '5rem', aspectRatio: '3/2',
                                border: i === active ? '2px solid #b8965a' : '2px solid transparent',
                                opacity: i === active ? 1 : 0.45,
                                padding: 0, cursor: 'pointer', background: 'none',
                                transition: 'opacity 0.2s, border-color 0.2s',
                            }}
                        >
                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── PropertyCard ────────────────────────────────────────────────────────────
export default function PropertyCard({ property }: PropertyCardProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    const price = property.specs.find(s => s.includes('Precio'))?.replace('Precio: ', '') || 'Consultar';
    const isSold = property.specs.includes('VENDIDO');

    const rawSpecs = property.specs.filter(s => !s.includes('Precio') && s !== 'VENDIDO');
    const keySpecs: { value: string; label: string }[] = [];
    for (let i = 0; i < rawSpecs.length; i += 2) {
        if (rawSpecs[i + 1]) {
            keySpecs.push({ value: rawSpecs[i], label: rawSpecs[i + 1] });
        }
    }

    const images = property.images || [];
    // Show up to 3 thumbnails in the card
    const thumb1 = images[0];
    const thumb2 = images[1];
    const thumb3 = images[2];
    const remaining = images.length - 3;

    function openModal(e: React.MouseEvent, idx: number) {
        e.preventDefault();
        e.stopPropagation();
        setModalIndex(idx);
        setModalOpen(true);
    }

    return (
        <>
            {modalOpen && (
                <ImageModal
                    images={images}
                    title={property.title}
                    initialIndex={modalIndex}
                    onClose={() => setModalOpen(false)}
                />
            )}

            <Link href={`/${property.slug}`} className="group block">
                {/* ── Image area ── */}
                <div className="mb-6">
                    {/* Main image (tall) */}
                    <div
                        className="relative overflow-hidden bg-[var(--border-light)]"
                        style={{ aspectRatio: '4/3', marginBottom: '0.25rem', cursor: 'pointer' }}
                        onClick={(e) => thumb1 ? openModal(e, 0) : undefined}
                    >
                        {thumb1 ? (
                            <img
                                src={thumb1}
                                alt={property.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 1.8s ease-out' }}
                                className="group-hover:scale-105"
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)' }}>
                                Sin imagen
                            </div>
                        )}

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-700" />

                        {/* Sold badge */}
                        {isSold && (
                            <div className="absolute top-5 left-5">
                                <span className="bg-[var(--primary)] text-white text-[0.58rem] font-bold px-3 py-1.5 uppercase tracking-[0.2em]">
                                    Vendido
                                </span>
                            </div>
                        )}

                        {/* Hover CTA */}
                        <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <div className="bg-white/95 backdrop-blur-sm text-[var(--primary)] text-[0.65rem] font-bold tracking-[0.2em] uppercase py-2.5 text-center">
                                Ver Propiedad →
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail strip: 2 side-by-side below */}
                    {(thumb2 || thumb3) && (
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                            {/* Thumb 2 */}
                            {thumb2 && (
                                <div
                                    onClick={(e) => openModal(e, 1)}
                                    style={{
                                        flex: 1, aspectRatio: '3/2', overflow: 'hidden',
                                        cursor: 'pointer', position: 'relative',
                                        background: 'var(--border-light)',
                                    }}
                                >
                                    <img
                                        src={thumb2}
                                        alt={`${property.title} 2`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                    />
                                </div>
                            )}
                            {/* Thumb 3 (with +N overlay if more) */}
                            {thumb3 && (
                                <div
                                    onClick={(e) => openModal(e, 2)}
                                    style={{
                                        flex: 1, aspectRatio: '3/2', overflow: 'hidden',
                                        cursor: 'pointer', position: 'relative',
                                        background: 'var(--border-light)',
                                    }}
                                >
                                    <img
                                        src={thumb3}
                                        alt={`${property.title} 3`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                    />
                                    {/* "+N more" overlay */}
                                    {remaining > 0 && (
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: 'rgba(13,13,13,0.55)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#fff', fontSize: '1rem', fontWeight: 600,
                                            letterSpacing: '0.05em',
                                        }}>
                                            +{remaining}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Info ── */}
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
        </>
    );
}
