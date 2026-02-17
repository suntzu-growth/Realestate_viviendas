"use client";

import { useState } from 'react';

interface ImageGalleryProps {
    images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);

    if (!images || images.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="aspect-video relative rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
                <img
                    src={images[activeImage]}
                    alt={`Imagen ${activeImage + 1}`}
                    className="w-full h-full object-cover animate-fade-in"
                />
            </div>

            {images.length > 1 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${activeImage === index ? 'border-accent scale-95' : 'border-transparent opacity-70 hover:opacity-100'
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
