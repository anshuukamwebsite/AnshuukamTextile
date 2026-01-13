import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Scissors, PenTool } from "lucide-react";
import { getCachedClothingTypes, getCachedClothingTypeBySlug, getCachedCatalogueItems } from "@/lib/services/cached-data";
import { Metadata } from "next";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    minOrderQuantity: number | null;
    leadTime: string | null;
    sizeRange: string | null;
}

// Generate static pages for all categories at build time
export async function generateStaticParams() {
    const types = await getCachedClothingTypes();
    return types.map((type: { slug: string }) => ({
        slug: type.slug,
    }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCachedClothingTypeBySlug(slug) as Category | null;

    if (!category) {
        return { title: "Category Not Found" };
    }

    return {
        title: `${category.name} | Anshukkam Textile`,
        description: category.description || `Custom ${category.name} manufacturing. Browse our collection.`,
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const category = await getCachedClothingTypeBySlug(slug) as Category | null;

    if (!category) {
        notFound();
    }

    const products = await getCachedCatalogueItems(category.id);

    return (
        <div className="min-h-screen">
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
                        <span className="font-medium">{category.name}</span>
                    </div>
                </div>
            </div>

            {/* Category Header */}
            <section className="bg-card border-b border-border py-12">
                <div className="container-industrial">
                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                            {category.name}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="section-industrial bg-muted/30">
                <div className="container-industrial">
                    <h2 className="text-2xl font-bold mb-8">Available Products</h2>

                    {products.length === 0 ? (
                        <div className="text-center py-16 bg-card border border-border rounded-lg">
                            <Scissors className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No products added yet</h3>
                            <p className="text-muted-foreground mb-6">
                                We are currently updating our catalogue for {category.name}.
                            </p>
                            <Link href="/enquiry">
                                <Button className="btn-industrial">Request Custom Quote</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product, index) => (
                                <Link
                                    key={product.id}
                                    href={`/catalogue/${slug}/${product.slug}`}
                                    className="card-factory group block h-full hover:border-accent transition-all duration-300"
                                >
                                    {/* Technical Header */}
                                    <div className="flex justify-between items-center p-2 border-b border-border bg-muted/30 text-[10px] font-mono text-muted-foreground">
                                        <span>PROD-{(index + 1).toString().padStart(2, '0')}</span>
                                        <span>{product.name.toUpperCase().slice(0, 20)}</span>
                                    </div>

                                    <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                                        {product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="object-cover transition-transform duration-700 group-hover:scale-110 w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-muted/50">
                                                <Scissors className="h-12 w-12 text-muted-foreground/20" />
                                            </div>
                                        )}

                                        {/* Industrial Overlay */}
                                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/30 transition-colors z-20 pointer-events-none" />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                        {/* Customizable Badge */}
                                        {product.isCustomizable && (
                                            <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-2 py-1 text-[10px] font-mono font-bold z-10 flex items-center gap-1">
                                                <PenTool className="h-3 w-3" />
                                                CUSTOMIZABLE
                                            </div>
                                        )}

                                        {/* Content Overlay */}
                                        <div className="absolute bottom-0 left-0 w-full p-6 text-white z-10">
                                            <div className="w-8 h-1 bg-accent mb-4 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                                            <h3 className="text-xl font-bold mb-2 font-serif-display tracking-wide group-hover:text-accent transition-colors">
                                                {product.name}
                                            </h3>
                                            {product.description && (
                                                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed font-mono">
                                                    {product.description}
                                                </p>
                                            )}

                                            {/* Specs Grid */}
                                            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-white/60 border-t border-white/10 pt-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                <div>MOQ: {product.minOrderQuantity || category.minOrderQuantity || 100}+</div>
                                                <div>LEAD: {product.leadTime || category.leadTime || '2-4 Weeks'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
