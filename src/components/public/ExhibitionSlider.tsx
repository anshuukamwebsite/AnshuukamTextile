"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { useState, useEffect } from "react";

interface Photo {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
}

interface ExhibitionSliderProps {
    photos: Photo[];
}

export function ExhibitionSlider({ photos }: ExhibitionSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (photos.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % photos.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [photos.length]);

    if (!photos || photos.length === 0) return null;

    const next = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

    return (
        <section className="py-12 bg-primary relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-steel-plate opacity-5 pointer-events-none" />
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="container-industrial relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-accent">
                            <Globe className="h-4 w-4 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Industry Presence</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif-display font-bold text-white tracking-tight">
                            Showcasing Our <br />
                            <span className="text-accent italic font-serif leading-tight">Global Participation</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={prev}
                            className="p-3 border border-white/10 hover:border-accent hover:bg-accent/10 transition-all rounded-full text-white group"
                        >
                            <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={next}
                            className="p-3 border border-white/10 hover:border-accent hover:bg-accent/10 transition-all rounded-full text-white group"
                        >
                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-black/20">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        {/* Blurred background to fill space */}
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={photos[currentIndex].imageUrl}
                                alt=""
                                className="w-full h-full object-cover blur-3xl opacity-30 scale-110"
                            />
                        </div>

                        {/* Main Image */}
                        <img
                            src={photos[currentIndex].imageUrl}
                            alt={photos[currentIndex].title}
                            className="w-full h-full object-contain relative z-10"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent z-20" />

                        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full max-w-2xl z-30">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="space-y-4"
                            >
                                <h3 className="text-2xl md:text-3xl font-bold text-white">
                                    {photos[currentIndex].title}
                                </h3>
                                {photos[currentIndex].description && (
                                    <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-xl">
                                        {photos[currentIndex].description}
                                    </p>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Indicators */}
                    <div className="absolute top-8 right-8 flex gap-2">
                        {photos.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-1 transition-all duration-300 rounded-full ${i === currentIndex ? "w-8 bg-accent" : "w-2 bg-white/20"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
