"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Factory, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const navigation = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/catalogue" },
    { name: "Fabrics", href: "/fabrics" },
    { name: "Design", href: "/design" },
    { name: "Factory", href: "/factory" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

interface HeaderProps {
    navigationData?: {
        categories: any[];
        fabrics: any[];
    };
}

export function Header({ navigationData }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<any | null>(null);
    const pathname = usePathname();

    // Set default active category when opening Categories menu
    useEffect(() => {
        if (hoveredNav === "Categories" && navigationData?.categories && navigationData.categories.length > 0) {
            setActiveCategory(navigationData.categories[0]);
        }
    }, [hoveredNav, navigationData]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container-industrial">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative h-12 w-48">
                            <img
                                src="/logo.png"
                                alt="Anshuukam Textile"
                                className="object-contain object-left w-full h-full"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navigation.map((item) => {
                            const isActive = item.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(item.href);

                            const hasDropdown = (item.name === "Categories" || item.name === "Fabrics") && navigationData;

                            return (
                                <div
                                    key={item.name}
                                    className="relative group"
                                    onMouseEnter={() => setHoveredNav(item.name)}
                                    onMouseLeave={() => setHoveredNav(null)}
                                >
                                    <Link
                                        href={item.href}
                                        className={`relative px-4 py-2 text-sm font-medium transition-colors inline-block ${isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="navbar-active"
                                                className="absolute inset-0 bg-accent/10 rounded-full -z-10"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 380,
                                                    damping: 30
                                                }}
                                            />
                                        )}
                                        {item.name}
                                    </Link>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {hasDropdown && hoveredNav === item.name && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-max min-w-[200px] z-50"
                                            >
                                                <div className="bg-card border border-border shadow-xl rounded-lg overflow-hidden p-1">
                                                    {/* Categories Mega Menu */}
                                                    {item.name === "Categories" && navigationData?.categories && (
                                                        <div className="flex w-[800px] h-[400px]">
                                                            {/* Sidebar: Categories List */}
                                                            <div className="w-1/3 border-r border-border bg-muted/30 p-2 overflow-y-auto">
                                                                {navigationData.categories.map((cat) => (
                                                                    <div
                                                                        key={cat.id}
                                                                        className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${activeCategory?.id === cat.id
                                                                            ? "bg-accent text-accent-foreground font-medium"
                                                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                                                            }`}
                                                                        onMouseEnter={() => setActiveCategory(cat)}
                                                                    >
                                                                        <span>{cat.name}</span>
                                                                        {activeCategory?.id === cat.id && <ChevronRight className="h-4 w-4" />}
                                                                    </div>
                                                                ))}
                                                                <Link href="/catalogue" className="block mt-4 px-3 py-2 text-xs text-accent hover:underline">
                                                                    View All Categories →
                                                                </Link>
                                                            </div>

                                                            {/* Main Content: Products Grid */}
                                                            <div className="w-2/3 p-4 overflow-y-auto bg-card">
                                                                {activeCategory ? (
                                                                    <div>
                                                                        <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                                                                            <h3 className="font-bold text-lg">{activeCategory.name}</h3>
                                                                            <Link href={`/catalogue/${activeCategory.slug}`} className="text-xs text-muted-foreground hover:text-accent">
                                                                                View Category Page
                                                                            </Link>
                                                                        </div>

                                                                        {activeCategory.products && activeCategory.products.length > 0 ? (
                                                                            <div className="grid grid-cols-2 gap-4">
                                                                                {activeCategory.products.slice(0, 6).map((prod: any) => (
                                                                                    <Link
                                                                                        key={prod.id}
                                                                                        href={`/catalogue/${activeCategory.slug}/${prod.slug}`}
                                                                                        className="flex items-start gap-3 group/prod p-2 rounded-md hover:bg-muted/50 transition-colors"
                                                                                    >
                                                                                        <div className="relative w-12 h-12 rounded bg-muted overflow-hidden flex-shrink-0 border border-border">
                                                                                            {prod.imageUrl ? (
                                                                                                <img src={prod.imageUrl} alt={prod.name} className="object-cover w-full h-full" />
                                                                                            ) : (
                                                                                                <div className="w-full h-full bg-muted" />
                                                                                            )}
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-sm font-medium group-hover/prod:text-accent line-clamp-1">{prod.name}</p>
                                                                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                                                                {prod.description || "Custom manufacturing"}
                                                                                            </p>
                                                                                        </div>
                                                                                    </Link>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <p className="text-sm text-muted-foreground py-8 text-center">No products listed yet.</p>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                                                        Select a category
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Fabrics Menu */}
                                                    {item.name === "Fabrics" && navigationData?.fabrics && (
                                                        <div className="w-[300px] p-2 max-h-[400px] overflow-y-auto">
                                                            <div className="mb-2 px-2 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                                Available Fabrics
                                                            </div>
                                                            {navigationData.fabrics.map((fabric) => (
                                                                <Link
                                                                    key={fabric.id}
                                                                    href={`/fabrics/${fabric.slug}`}
                                                                    className="block px-3 py-2 rounded-md hover:bg-muted text-sm transition-colors"
                                                                >
                                                                    {fabric.name}
                                                                </Link>
                                                            ))}
                                                            <Link href="/fabrics" className="block mt-2 px-3 py-2 text-xs text-accent hover:underline border-t border-border">
                                                                View All Fabrics →
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/enquiry">
                            <Button className="btn-industrial">
                                Request Quote
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] p-6">
                            <VisuallyHidden>
                                <SheetTitle>Navigation Menu</SheetTitle>
                            </VisuallyHidden>
                            <div className="flex flex-col gap-6 mt-8">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <Link href="/enquiry" onClick={() => setIsOpen(false)}>
                                    <Button className="btn-industrial w-full mt-4">
                                        Request Quote
                                    </Button>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
