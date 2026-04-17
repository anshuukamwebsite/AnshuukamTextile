import { getCachedFactoryPhotos } from "@/lib/services/cached-data";
import { Metadata } from "next";
import { FactoryGallery } from "@/components/public/FactoryGallery";
import { Globe } from "lucide-react";

export const metadata: Metadata = {
    title: "Gallery & Events | Anshuukam Textile",
    description: "Witness our global presence through exhibitions, trade expos, and celebrated achievements in the garment manufacturing industry.",
};

interface FactoryPhoto {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    category: string | null;
}

const categoryLabels: Record<string, string> = {
    exhibition: "Exhibitions & Expos",
    achievement: "Achievements",
    celebration: "Celebrations",
};

const galleryCategories = ["exhibition", "achievement", "celebration", "expo"]; // Including 'expo' for backward compatibility if any

export default async function GalleryPage() {
    const allPhotos = await getCachedFactoryPhotos() as FactoryPhoto[];

    // Filter for gallery related photos
    const photos = allPhotos.filter(p => p.category && galleryCategories.includes(p.category));

    // Get unique categories from photos
    const categories = Array.from(new Set(photos.map((p) => p.category).filter(Boolean))) as string[];

    return (
        <div className="min-h-screen bg-blueprint relative">
            {/* Industrial Warning Stripe Top */}
            <div className="absolute top-0 left-0 right-0 h-1 industrial-stripe opacity-20" />

            {/* Hero Section */}
            <section className="relative bg-primary text-primary-foreground py-16 overflow-hidden border-b border-white/10">
                {/* Fabric background pattern */}
                <div className="absolute inset-0 bg-fabric-pattern opacity-10" />
                <div className="absolute inset-0 bg-steel-plate opacity-5 mix-blend-overlay" />

                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 text-accent mb-4">
                            <Globe className="h-6 w-6 animate-pulse" />
                            <span className="text-sm font-bold uppercase tracking-[0.3em]">Industry Presence</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif-display tracking-wide">
                            Our Gallery & <br />
                            <span className="text-accent italic font-serif leading-tight">Achievements</span>
                        </h1>
                        <p className="text-lg text-primary-foreground/80 font-light max-w-2xl leading-relaxed">
                            From global textile exhibitions to internal celebrations and industry accolades,
                            explore the journey of Anshuukam Textile beyond the factory floor.
                        </p>
                    </div>
                </div>
            </section>

            {/* Photo Gallery */}
            <section className="section-industrial relative">
                <div className="container-industrial relative z-10">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <div className="inline-block section-tag mb-4">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                            EVENTS & MEDIA
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif-display">
                            Moments and Milestones
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm">
                            Showcasing our participation in international expos and celebrating our team's success.
                        </p>
                    </div>

                    {/* Interactive Gallery */}
                    <FactoryGallery
                        photos={photos}
                        categories={categories}
                        categoryLabels={categoryLabels}
                    />
                </div>
            </section>
        </div>
    );
}
