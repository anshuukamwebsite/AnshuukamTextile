import Link from "next/link";
import { Layers, ArrowRight, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCachedFabrics } from "@/lib/services/cached-data";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fabric Options | Anshukkam Textile",
    description: "Explore our premium fabric collection. Quality-tested materials from certified suppliers. Cotton, Polyester, Blends, and more available in bulk quantities.",
};

interface Fabric {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    composition: string | null;
    weight: string | null;
    imageUrl: string | null;
}

export default async function FabricsPage() {
    const fabrics = await getCachedFabrics() as Fabric[];

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Breadcrumb */}
            <div className="bg-muted border-b border-border">
                <div className="container-industrial py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-medium">Fabrics</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <section className="relative bg-card border-b border-border py-12">
                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground font-serif-display">Fabric Options</h1>
                        <p className="text-lg text-muted-foreground">
                            Quality-tested materials from certified suppliers. All fabrics
                            available in bulk quantities.
                        </p>
                    </div>
                </div>
            </section>

            {/* Fabrics Grid */}
            <section className="section-industrial bg-blueprint relative">
                {/* Industrial Warning Stripe Top */}
                <div className="absolute top-0 left-0 right-0 h-1 industrial-stripe opacity-20" />

                <div className="container-industrial relative z-10">
                    {fabrics.length === 0 ? (
                        <div className="text-center py-16 bg-card border border-border rounded-lg p-8 max-w-md mx-auto">
                            <Layers className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h2 className="text-xl font-bold mb-2 font-serif-display">No fabrics listed yet</h2>
                            <p className="text-muted-foreground mb-6 font-mono text-sm">
                                Contact us to discuss your fabric requirements.
                            </p>
                            <Link href="/enquiry">
                                <Button className="btn-industrial">Contact Us</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {fabrics.map((fabric, index) => (
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
                    )}
                </div>
            </section>

            {/* CTA Section */}

        </div>
    );
}
