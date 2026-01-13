import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, Layers, Scale, CheckCircle, Mail
} from "lucide-react";
import { getCachedFabrics, getCachedFabricBySlug } from "@/lib/services/cached-data";
import { Metadata } from "next";
import { FabricImageGallery } from "@/components/public/FabricImageGallery";

interface Fabric {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    composition: string | null;
    weight: string | null;
    properties: Record<string, boolean> | null;
    imageUrl: string | null;
    images: string[] | null;
}

const propertyLabels: Record<string, string> = {
    breathable: "Breathable",
    moisture_wicking: "Moisture Wicking",
    stretchable: "Stretchable",
    durable: "Durable",
    wrinkle_resistant: "Wrinkle Resistant",
    uv_protection: "UV Protection",
    quick_dry: "Quick Dry",
    anti_bacterial: "Anti-Bacterial",
};

// Generate static pages for all fabrics at build time
export async function generateStaticParams() {
    const fabricList = await getCachedFabrics();
    return fabricList.map((fabric: { slug: string }) => ({
        slug: fabric.slug,
    }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const fabric = await getCachedFabricBySlug(slug) as Fabric | null;

    if (!fabric) {
        return { title: "Fabric Not Found" };
    }

    return {
        title: `${fabric.name} Fabric | Anshukkam Textile`,
        description: fabric.description || `Premium ${fabric.name} fabric. Composition: ${fabric.composition || "N/A"}. Weight: ${fabric.weight || "N/A"}.`,
    };
}

export default async function FabricDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const fabric = await getCachedFabricBySlug(slug) as Fabric | null;

    if (!fabric) {
        notFound();
    }

    const activeProperties = fabric?.properties
        ? Object.entries(fabric.properties).filter(([_, value]) => value)
        : [];

    // Prepare images list for gallery
    const galleryImages = fabric.images && fabric.images.length > 0
        ? fabric.images
        : fabric.imageUrl
            ? [fabric.imageUrl]
            : [];

    return (
        <div className="min-h-screen bg-blueprint relative">
            {/* Industrial Warning Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 industrial-stripe opacity-20" />

            {/* Breadcrumb */}
            <div className="bg-muted border-b border-border">
                <div className="container-industrial py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <span className="text-muted-foreground">/</span>
                        <Link href="/fabrics" className="text-muted-foreground hover:text-foreground transition-colors">
                            Fabrics
                        </Link>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-medium">{fabric.name}</span>
                    </div>
                </div>
            </div>

            <div className="container-industrial py-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Left Column - Images */}
                    <div>
                        <FabricImageGallery
                            images={galleryImages}
                            fabricName={fabric.name}
                        />
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-8">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Badge variant="outline" className="text-accent border-accent/30 bg-accent/5 font-mono text-[10px] tracking-wider">
                                    PREMIUM FABRIC
                                </Badge>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground font-serif-display tracking-tight">
                                {fabric.name}
                            </h1>
                            {fabric.description && (
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {fabric.description}
                                </p>
                            )}
                        </div>

                        {/* Specifications - Industrial Card */}
                        <div className="card-factory">
                            <div className="flex justify-between items-center p-2 border-b border-border bg-muted/30 text-[10px] font-mono text-muted-foreground">
                                <span>SPEC-SHEET</span>
                                <span>MAT-{fabric.id.slice(0, 8).toUpperCase()}</span>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                            <Layers className="h-4 w-4 text-accent" />
                                            Composition
                                        </div>
                                        <p className="font-bold text-xl text-foreground">{fabric.composition || "100% Cotton"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                            <Scale className="h-4 w-4 text-accent" />
                                            Weight
                                        </div>
                                        <p className="font-bold text-xl text-foreground">{fabric.weight || "180 GSM"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Properties */}
                        {activeProperties.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-2">
                                    <div className="w-2 h-2 bg-accent rounded-full" />
                                    Fabric Properties
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {activeProperties.map(([key]) => (
                                        <Badge
                                            key={key}
                                            variant="secondary"
                                            className="px-4 py-2 text-sm font-medium border border-white/10"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2 text-accent" />
                                            {propertyLabels[key] || key.replace(/_/g, " ")}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="pt-6 border-t border-white/10">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/contact" className="flex-1">
                                    <Button className="w-full btn-industrial h-14 text-lg">
                                        <Mail className="mr-2 h-5 w-5" />
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Fabrics */}
            <section className="bg-muted/30 py-8 border-t border-white/10 relative z-10">
                <div className="container-industrial">
                    <Link href="/fabrics">
                        <Button variant="ghost" className="group hover:bg-transparent pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-accent">
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Fabrics
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
