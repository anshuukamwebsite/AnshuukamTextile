import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCachedFactoryPhotos } from "@/lib/services/cached-data";
import { getFactoryPageSettings } from "@/lib/services/settings";
import { Metadata } from "next";
import { FactoryGallery } from "@/components/public/FactoryGallery";

export const metadata: Metadata = {
    title: "Our Factory | Anshukkam Textile",
    description: "Take a virtual tour of our state-of-the-art manufacturing facility. 50,000+ sq ft production space, 200+ skilled workers, 24/7 production capability.",
};

interface FactoryPhoto {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    category: string | null;
}

const categoryLabels: Record<string, string> = {
    production: "Production Floor",
    warehouse: "Warehouse",
    "quality-control": "Quality Control",
    machinery: "Machinery",
    office: "Office",
    exterior: "Exterior",
    team: "Our Team",
    other: "Other",
};

export default async function FactoryPage() {
    const photos = await getCachedFactoryPhotos() as FactoryPhoto[];
    const content = await getFactoryPageSettings();

    // Get unique categories from photos
    const categories = Array.from(new Set(photos.map((p) => p.category).filter(Boolean))) as string[];

    return (
        <div className="min-h-screen bg-blueprint relative">
            {/* Industrial Warning Stripe Top */}
            <div className="absolute top-0 left-0 right-0 h-1 industrial-stripe opacity-20" />

            {/* Hero Section */}
            <section className="relative bg-primary text-primary-foreground py-8 overflow-hidden border-b border-white/10">
                {/* Fabric background pattern */}
                <div className="absolute inset-0 bg-fabric-pattern opacity-10" />
                <div className="absolute inset-0 bg-steel-plate opacity-5 mix-blend-overlay" />

                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <div className="section-tag mb-2 text-white/80 border-white/20">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                            INFRASTRUCTURE
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2 font-serif-display tracking-wide">
                            {content.hero.title}
                        </h1>
                        <p className="text-sm text-primary-foreground/70 font-light max-w-2xl leading-relaxed font-mono">
                            {content.hero.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Factory Stats */}
            <section className="py-12 border-b border-border bg-background/50 backdrop-blur-sm">
                <div className="container-industrial">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {content.stats.map((stat: any) => (
                            <div
                                key={stat.label}
                                className="card-factory p-6 group hover:border-accent transition-all duration-300"
                            >
                                <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-2">
                                    <span className="text-[10px] font-mono text-muted-foreground">STAT-{stat.id}</span>
                                    <div className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-accent mb-2 font-serif-display tracking-wide">
                                    {stat.value}
                                </div>
                                <div className="text-muted-foreground text-xs font-mono uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
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
                            GALLERY
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif-display">
                            {content.gallery.title}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm">
                            {content.gallery.description}
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
