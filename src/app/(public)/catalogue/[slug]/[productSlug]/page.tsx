import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Package, Clock, Ruler, CheckCircle2, Mail, PenTool, ArrowRight
} from "lucide-react";
import { getCachedCatalogueItemBySlug, getCachedClothingTypeBySlug, getCachedNavigationData } from "@/lib/services/cached-data";
import { ProductImageGallery } from "@/components/catalogue/ProductImageGallery";
import { Metadata } from "next";

// Generate metadata
export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string; productSlug: string }>
}): Promise<Metadata> {
    const { productSlug } = await params;
    const product = await getCachedCatalogueItemBySlug(productSlug);

    if (!product) {
        return { title: "Product Not Found" };
    }

    return {
        title: `${product.name} | Anshukkam Textile`,
        description: product.description || `Custom manufacturing for ${product.name}.`,
    };
}

export default async function ProductPage({
    params
}: {
    params: Promise<{ slug: string; productSlug: string }>
}) {
    const { slug, productSlug } = await params;

    // Fetch category for breadcrumb and context
    const category = await getCachedClothingTypeBySlug(slug);
    // Fetch product
    const product = await getCachedCatalogueItemBySlug(productSlug);
    // Fetch all fabrics
    const { fabrics } = await getCachedNavigationData();

    if (!product || !category) {
        notFound();
    }

    const images = product.images && product.images.length > 0
        ? product.images
        : product.imageUrl ? [product.imageUrl] : [];

    const availableFabrics = product.availableFabrics && product.availableFabrics.length > 0
        // @ts-ignore - availableFabrics might be string[] but includes expects string
        ? fabrics.filter(f => product.availableFabrics.includes(f.id))
        : fabrics;

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
                        <Link href="/catalogue" className="text-muted-foreground hover:text-foreground transition-colors">
                            Catalogue
                        </Link>
                        <span className="text-muted-foreground">/</span>
                        <Link href={`/catalogue/${slug}`} className="text-muted-foreground hover:text-foreground transition-colors">
                            {category.name}
                        </Link>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-medium">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="container-industrial py-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Left Column - Images */}
                    <div>
                        <ProductImageGallery images={images} productName={product.name} />
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-8">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Badge variant="outline" className="text-accent border-accent/20 bg-accent/5">
                                    {category.name}
                                </Badge>
                                {product.isCustomizable && (
                                    <Badge className="bg-accent text-accent-foreground font-mono text-[10px] tracking-wider flex items-center gap-1">
                                        <PenTool className="h-3 w-3" />
                                        CUSTOMIZABLE
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground font-serif-display tracking-tight">
                                {product.name}
                            </h1>
                            {product.description && (
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {product.description}
                                </p>
                            )}
                        </div>

                        {/* Key Specs */}
                        <div className="p-6 bg-muted/30 rounded-lg border border-border">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                        <Package className="h-4 w-4 text-accent" />
                                        Minimum Order
                                    </div>
                                    <p className="font-bold text-xl text-foreground">{product.minOrderQuantity || 100}+ pcs</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                        <Clock className="h-4 w-4 text-accent" />
                                        Lead Time
                                    </div>
                                    <p className="font-bold text-xl text-foreground">{product.leadTime || "3-4 Weeks"}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                        <Ruler className="h-4 w-4 text-accent" />
                                        Size Range
                                    </div>
                                    <p className="font-bold text-xl text-foreground">{product.sizeRange || "XS-5XL"}</p>
                                </div>
                                {product.productionCapacity && (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                            <CheckCircle2 className="h-4 w-4 text-accent" />
                                            Capacity
                                        </div>
                                        <p className="font-bold text-xl text-foreground">{product.productionCapacity}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Available Fabrics */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-2">
                                <div className="w-2 h-2 bg-accent rounded-full" />
                                Available Fabrics
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {availableFabrics.map(fabric => (
                                    <Link key={fabric.id} href={`/fabrics/${fabric.slug}`}>
                                        <Badge
                                            variant="secondary"
                                            className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer px-4 py-2 text-sm font-medium border border-white/10"
                                        >
                                            {fabric.name}
                                            <ArrowRight className="ml-2 h-3 w-3 opacity-50" />
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="pt-6 border-t border-white/10">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href={`/enquiry?category=${category.id}&product=${product.id}`} className="flex-1">
                                    <Button className="w-full btn-industrial h-14 text-lg">
                                        <Mail className="mr-2 h-5 w-5" />
                                        Request Quote
                                    </Button>
                                </Link>
                                {product.isCustomizable && (
                                    <Link href={`/design?product=${product.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full h-14 text-lg border-accent text-accent hover:bg-accent hover:text-accent-foreground group">
                                            <PenTool className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                                            Customize Design
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
