"use client";

import { useState } from 'react';

interface ImageGalleryProps {
    images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);

    if (!images || images.length === 0) return null;

    return (
        <div className="space-y-8">
            <div className="aspect-[16/9] relative overflow-hidden bg-gray-50 group">
                <img
                    key={activeImage}
                    src={images[activeImage]}
                    alt={`Imagen ${activeImage + 1}`}
                    className="w-full h-full object-cover animate-fade-in"
                />

                <div className="absolute inset-x-0 bottom-10 flex justify-center">
                    <div className="bg-black/20 backdrop-blur-xl px-6 py-3 rounded-full text-white text-[11px] font-bold tracking-[0.3em] flex gap-4 border border-white/20">
                        <span className="opacity-60">{activeImage + 1}</span>
                        <span className="w-px h-3 bg-white/20"></span>
                        <span>{images.length}</span>
                    </div>
                </div>

                {/* Navigation arrows */}
                <button
                    onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <button
                    onClick={() => setActiveImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>

            {images.length > 1 && (
                <div className="flex justify-center gap-4 overflow-x-auto pb-6 no-scrollbar">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`flex-shrink-0 w-20 md:w-28 aspect-[3/2] overflow-hidden border-2 transition-all duration-300 ${activeImage === index
                                ? 'border-[var(--accent)] opacity-100'
                                : 'border-transparent opacity-40 hover:opacity-80'
                                }`}
                        >
                            <img src={img} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
