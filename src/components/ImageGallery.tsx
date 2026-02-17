"use client";

import { useState } from 'react';

interface ImageGalleryProps {
    images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);

    if (!images || images.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="aspect-[16/10] relative rounded-[2.5rem] overflow-hidden bg-gray-50 shadow-2xl shadow-gray-200/50">
                <img
                    key={activeImage}
                    src={images[activeImage]}
                    alt={`Imagen ${activeImage + 1}`}
                    className="w-full h-full object-cover animate-fade-in"
                />

                <div className="absolute bottom-8 right-8 bg-black/40 backdrop-blur-md px-5 py-2 rounded-full text-white text-[10px] font-bold tracking-[0.2em]">
                    {activeImage + 1} / {images.length}
                </div>
            </div>

            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`flex-shrink-0 w-32 aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all duration-500 ${activeImage === index
                                ? 'border-accent scale-105 shadow-xl shadow-accent/20'
                                : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'
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
