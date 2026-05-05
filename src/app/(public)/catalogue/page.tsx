import Link from "next/link";
import { Shirt, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCachedClothingTypes } from "@/lib/services/cached-data";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Product Catalogue | Anshuukam Textile",
    description: "Explore our full range of garment categories. T-Shirts, Polos, Hoodies, Jackets, Workwear, and more. All products can be customized to your specifications.",
};

interface ClothingType {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    minOrderQuantity: number | null;
    leadTime: string | null;
    sizeRange: string | null;
}

export default async function CataloguePage() {
    const types = await getCachedClothingTypes() as ClothingType[];

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
                        <span className="font-medium">Catalogue</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <section className="relative bg-card border-b border-border py-12">
                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground font-serif-display">Product Categories</h1>
                        <p className="text-lg text-muted-foreground">
                            Browse our manufacturing categories. Select a category to view available products.
                        </p>
                    </div>
                </div>
            </section>

            {/* Catalogue Grid */}
            <section className="section-industrial bg-blueprint relative">
                {/* Industrial Warning Stripe Top */}
                <div className="absolute top-0 left-0 right-0 h-1 industrial-stripe opacity-20" />

                <div className="container-industrial relative z-10">
                    {types.length === 0 ? (
                        <div className="text-center py-16 bg-card border border-border rounded-lg p-8 max-w-md mx-auto">
                            <Shirt className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h2 className="text-xl font-bold mb-2 font-serif-display">No categories yet</h2>
                            <p className="text-muted-foreground mb-6 font-mono text-sm">
                                Check back soon for our product catalogue.
                            </p>
                            <Link href="/enquiry">
                                <Button className="btn-industrial">Contact Us</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                            {types.map((item, index) => (
                                <Link
                                    key={item.id}
                                    href={`/catalogue/${item.slug}`}
                                    className="card-factory group block h-full hover:border-accent transition-all duration-300"
                                >
                                    {/* Technical Header */}
                                    <div className="flex justify-between items-center p-2 border-b border-border bg-muted/30 text-[10px] font-mono text-muted-foreground">
                                        <span>CAT-{(index + 1).toString().padStart(2, '0')}</span>
                                        <span>{item.name.toUpperCase()}</span>
                                    </div>

                                    <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="object-cover transition-transform duration-700 group-hover:scale-110 w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-muted/50">
                                                <Scissors className="h-12 w-12 text-muted-foreground/20" />
                                            </div>
                                        )}

                                        {/* Industrial Overlay */}
                                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/30 transition-colors z-20 pointer-events-none" />

                                        {/* Simple Gradient Overlay for hover effect */}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Category Info - Now Below Image */}
                                    <div className="p-4 bg-card border-t border-border">
                                        <div className="w-8 h-1 bg-accent mb-3" />
                                        <h3 className="text-lg font-bold mb-1 font-serif-display tracking-wide group-hover:text-accent transition-colors text-foreground">
                                            {item.name}
                                        </h3>
                                        {item.description && (
                                            <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed font-mono mb-3">
                                                {item.description}
                                            </p>
                                        )}

                                        {/* Specs Grid */}
                                        <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-muted-foreground border-t border-border pt-2 mt-auto">
                                            <div>MOQ: {item.minOrderQuantity || 'Flexible'}</div>
                                            <div>LEAD: {item.leadTime || '2-4 Weeks'}</div>
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
