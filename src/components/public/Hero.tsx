"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, MapPin, Scissors, Play, Pause } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/MotionContainer";
import { useState, useRef } from "react";

export function Hero() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <section className="relative overflow-hidden bg-fabric-pattern">
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" />
            {/* Industrial stripe accent at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1 industrial-stripe-accent opacity-60" />
            <div className="relative container-industrial">
                <div className="py-16 md:py-24 lg:py-32">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left side - Content */}
                        <div>
                            {/* Section Tag - Industrial Style */}
                            <FadeIn delay={0.05}>
                                <div className="section-tag mb-6">
                                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                                    Neemuch, M.P.
                                </div>
                            </FadeIn>

                            {/* Tagline */}
                            <FadeIn delay={0.1}>
                                <p className="text-accent font-medium mb-4 tracking-wide">
                                    Every dream starts small. Ours began with a single thread.
                                </p>
                            </FadeIn>

                            {/* Headline */}
                            <FadeIn delay={0.2}>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                                    <span className="text-accent">Anshuukam Textile</span>{" "}
                                    — Where Quality Meets Passion
                                </h1>
                            </FadeIn>

                            {/* Subheadline */}
                            <FadeIn delay={0.3}>
                                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                                    Every stitch, every thread, and every design reflects our belief —
                                    quality isn't just made, it's crafted with care.
                                </p>
                            </FadeIn>

                            {/* CTA Buttons */}
                            <FadeIn delay={0.4}>
                                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                    <Link href="/enquiry">
                                        <Button size="lg" className="btn-industrial text-base h-12 px-8">
                                            Request a Quote
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Link href="/catalogue">
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="btn-industrial-outline text-base h-12 px-8"
                                        >
                                            View Catalogue
                                        </Button>
                                    </Link>
                                </div>
                            </FadeIn>

                            {/* Trust Indicators */}
                            <FadeInStagger className="flex flex-wrap gap-6 text-sm text-muted-foreground" staggerDelay={0.1}>
                                <FadeInItem>
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-5 w-5 text-accent" />
                                        <span>Crafted with Care</span>
                                    </div>
                                </FadeInItem>
                                <FadeInItem>
                                    <div className="flex items-center gap-2">
                                        <Scissors className="h-5 w-5 text-accent" />
                                        <span>Precision Tailoring</span>
                                    </div>
                                </FadeInItem>
                                <FadeInItem>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-accent" />
                                        <span>Made in Neemuch, M.P.</span>
                                    </div>
                                </FadeInItem>
                            </FadeInStagger>
                        </div>

                        {/* Right side - Video with industrial corners */}
                        <div className="relative lg:mt-8 group">
                            <div className="industrial-corners p-2">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-auto"
                                    style={{
                                        filter: 'brightness(1.05) contrast(1.02)',
                                        mixBlendMode: 'multiply'
                                    }}
                                >
                                    <source src="/animated.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>

                                {/* Play/Pause Button */}
                                <button
                                    onClick={togglePlay}
                                    className="absolute bottom-6 right-6 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-sm border border-white/20 rounded-full text-white transition-all duration-300 hover:scale-110 group-hover:opacity-100 opacity-0"
                                    aria-label={isPlaying ? "Pause video" : "Play video"}
                                >
                                    {isPlaying ? (
                                        <Pause className="h-4 w-4 fill-current" />
                                    ) : (
                                        <Play className="h-4 w-4 fill-current ml-0.5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
