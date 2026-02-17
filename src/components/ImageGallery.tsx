"use client";

import { useState } from 'react';

interface ImageGalleryProps {
    images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [active, setActive] = useState(0);

    if (!images || images.length === 0) return null;

    const prev = () => setActive(i => (i > 0 ? i - 1 : images.length - 1));
    const next = () => setActive(i => (i < images.length - 1 ? i + 1 : 0));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

            {/* ── Imagen principal ── */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#f0ede8' }}>
                <img
                    src={images[active]}
                    alt={`Imagen ${active + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />

                {/* Flechas */}
                {images.length > 1 && (
                    <>
                        <button onClick={prev} aria-label="Anterior" style={{
                            position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                            width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                            background: 'rgba(0,0,0,0.45)', border: 'none', cursor: 'pointer',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(4px)',
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                        <button onClick={next} aria-label="Siguiente" style={{
                            position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                            width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                            background: 'rgba(0,0,0,0.45)', border: 'none', cursor: 'pointer',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(4px)',
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Contador */}
                <div style={{
                    position: 'absolute', bottom: '1rem', right: '1rem',
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
                    color: 'white', fontSize: '0.65rem', fontWeight: '600',
                    letterSpacing: '0.15em', padding: '0.35rem 0.75rem',
                    borderRadius: '2rem',
                }}>
                    {active + 1} / {images.length}
                </div>
            </div>

            {/* ── Miniaturas ── */}
            {images.length > 1 && (
                <div style={{
                    display: 'flex', flexDirection: 'row', gap: '0.5rem',
                    overflowX: 'auto', paddingBottom: '0.25rem',
                    scrollbarWidth: 'none',
                }}>
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            style={{
                                flexShrink: 0,
                                width: '5.5rem',
                                aspectRatio: '3/2',
                                overflow: 'hidden',
                                border: i === active ? '2px solid #b8965a' : '2px solid transparent',
                                opacity: i === active ? 1 : 0.5,
                                cursor: 'pointer',
                                padding: 0,
                                background: 'none',
                                transition: 'opacity 0.2s, border-color 0.2s',
                            }}
                        >
                            <img
                                src={img}
                                alt={`Vista ${i + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
