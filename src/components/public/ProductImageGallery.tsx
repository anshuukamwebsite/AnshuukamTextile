"use client";

import { useState, useRef } from "react";
import { Package, ZoomIn } from "lucide-react";

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [activeImage, setActiveImage] = useState<string | null>(images[0] || null);
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

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div
                ref={imageRef}
                className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden cursor-zoom-in group border border-border"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
            >
                {activeImage ? (
                    <>
                        <img
                            src={activeImage}
                            alt={productName}
                            className={`object-cover transition-transform duration-200 w-full h-full absolute inset-0 ${isZoomed ? "scale-150" : "scale-100"}`}
                            style={isZoomed ? {
                                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                            } : {}}
                        />
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <ZoomIn className="h-4 w-4" />
                            Hover to zoom
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-24 w-24 text-muted-foreground/30" />
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-6 gap-2">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImage(img)}
                            className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${activeImage === img
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-transparent hover:border-muted-foreground/50"
                                }`}
                        >
                            <img
                                src={img}
                                alt={`${productName} view ${index + 1}`}
                                className="object-cover w-full h-full"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
