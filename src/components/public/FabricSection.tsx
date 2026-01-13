import Link from "next/link";
import { Layers, ArrowRight, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCachedFabrics } from "@/lib/services/cached-data";

interface Fabric {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    composition: string | null;
    weight: string | null;
    imageUrl: string | null;
}

export async function FabricSection() {
    const fabrics = await getCachedFabrics() as Fabric[];

    if (fabrics.length === 0) {
        return null;
    }

    return (
        <section className="section-industrial-alt bg-blueprint relative border-t border-border">
            <div className="container-industrial relative z-10">
                {/* Section Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="section-tag mb-4">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                            MATERIALS
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Available Fabrics
                        </h2>
                        <p className="text-muted-foreground max-w-2xl">
                            Quality-tested materials from certified suppliers.
                            All fabrics available in bulk quantities.
                        </p>
                    </div>
                    <Link href="/fabrics">
                        <Button variant="outline" className="btn-industrial-outline">
                            View All Fabrics
                        </Button>
                    </Link>
                </div>

                {/* Fabric Grid - Industrial Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {fabrics.slice(0, 4).map((fabric, index) => (
                        <Link
                            key={fabric.id}
                            href={`/fabrics/${fabric.slug}`}
                            className="card-factory group block h-full hover:border-accent transition-all duration-300"
                        >
                            {/* Technical Header */}
                            <div className="flex justify-between items-center p-2 border-b border-border bg-muted/30 text-[10px] font-mono text-muted-foreground">
                                <span>MAT-{(index + 1).toString().padStart(2, '0')}</span>
                                <span>{fabric.weight || 'GSM N/A'}</span>
                            </div>

                            {/* Fabric Swatch Look */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                                {fabric.imageUrl ? (
                                    <img
                                        src={fabric.imageUrl}
                                        alt={fabric.name}
                                        className="object-cover transition-transform duration-700 group-hover:scale-110 w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted/50">
                                        <Layers className="h-12 w-12 text-muted-foreground/20" />
                                    </div>
                                )}

                                {/* Industrial Overlay */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/30 transition-colors z-20 pointer-events-none" />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                {/* Content Overlay */}
                                <div className="absolute bottom-0 left-0 w-full p-6 text-white z-10">
                                    <div className="w-8 h-1 bg-accent mb-4 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                                    <h3 className="text-xl font-bold mb-2 font-serif-display tracking-wide group-hover:text-accent transition-colors">
                                        {fabric.name}
                                    </h3>

                                    <div className="flex flex-col gap-1 text-xs text-white/70 font-mono mb-2">
                                        <span className="uppercase tracking-wider">
                                            {fabric.composition || "Composition N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bottom Note */}
                <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-2 text-sm text-muted-foreground border-t border-dashed border-border pt-8">
                    <Scroll className="h-4 w-4" />
                    <p>
                        Don't see what you need? We can source custom fabrics for bulk orders.
                    </p>
                    <Link href="/contact" className="text-accent hover:underline font-medium font-mono uppercase tracking-wide text-xs">
                        Contact Sourcing Team
                    </Link>
                </div>
            </div>
        </section>
    );
}
