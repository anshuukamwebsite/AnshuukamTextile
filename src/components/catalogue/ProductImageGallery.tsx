"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Scissors, ZoomIn } from "lucide-react";

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const imageRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[3/4] bg-muted relative overflow-hidden border border-border flex items-center justify-center text-muted-foreground rounded-lg">
                No image available
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image with Hover Zoom */}
            <div className="relative group">
                {/* Industrial corner brackets */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent z-10 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent z-10 pointer-events-none" />

                <div
                    ref={imageRef}
                    className="aspect-[3/4] bg-muted relative overflow-hidden border border-white/10 rounded-lg cursor-zoom-in"
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                >
                    <img
                        src={selectedImage}
                        alt={productName}
                        className="object-cover transition-transform duration-300 w-full h-full absolute inset-0"
                        style={isZoomed ? {
                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                            transform: "scale(2.5)"
                        } : {}}
                    />

                    {/* Zoom hint */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <ZoomIn className="h-4 w-4" />
                        Hover to zoom
                    </div>
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(img)}
                            className={cn(
                                "aspect-square bg-muted relative overflow-hidden border cursor-pointer transition-all hover:scale-105 rounded-md",
                                selectedImage === img
                                    ? "border-accent ring-2 ring-accent/30"
                                    : "border-white/10 hover:border-accent/50"
                            )}
                        >
                            <img
                                src={img}
                                alt={`${productName} view ${idx + 1}`}
                                className="object-cover w-full h-full"
                            />
                            {selectedImage === img && (
                                <div className="absolute inset-0 bg-accent/10" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
