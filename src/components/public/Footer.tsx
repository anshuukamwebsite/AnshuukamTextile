import Link from "next/link";
import { Heart, Mail, Phone, MapPin, Youtube, Instagram, Facebook } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground relative overflow-hidden">
            {/* Industrial Warning Stripe Top */}
            <div className="h-2 industrial-stripe w-full" />

            {/* Background Texture */}
            <div className="absolute inset-0 bg-steel-plate opacity-10 pointer-events-none" />

            <div className="container-industrial py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="relative h-16 w-48 mb-4">
                            <img
                                src="/logo.png"
                                alt="Anshuukam Textile"
                                className="object-contain object-left brightness-0 invert w-full h-full"
                            />
                        </div>
                        <p className="text-sm opacity-80 leading-relaxed font-mono">
                            Where fabric meets emotion, and quality meets trust.
                            Every stitch crafted with care.
                        </p>
                        <p className="text-xs font-mono tracking-wider opacity-60">
                            GSTIN: 23ABBCA8915B1Z5
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-serif-display font-bold text-xl mb-6 text-accent tracking-wide">Quick Links</h3>
                        <ul className="space-y-3 border-l border-white/10 pl-4">
                            {[
                                { name: "Product Catalogue", href: "/catalogue" },
                                { name: "Fabric Options", href: "/fabrics" },
                                { name: "Our Factory", href: "/factory" },
                                { name: "About Us", href: "/about" },
                                { name: "Our Team", href: "/about/team" },
                                { name: "Legal & Policies", href: "/about/legal" },
                                { name: "Request Quote", href: "/enquiry" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm opacity-70 hover:opacity-100 transition-all hover:text-accent hover:pl-1 block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Capabilities */}
                    <div>
                        <h3 className="font-serif-display font-bold text-xl mb-6 text-accent tracking-wide">We Manufacture</h3>
                        <ul className="space-y-3 text-sm opacity-80 border-l border-white/10 pl-4">
                            <li className="hover:text-white transition-colors">T-Shirts & Polos</li>
                            <li className="hover:text-white transition-colors">Hoodies & Sweatshirts</li>
                            <li className="hover:text-white transition-colors">Jackets & Outerwear</li>
                            <li className="hover:text-white transition-colors">Workwear & Uniforms</li>
                            <li className="hover:text-white transition-colors">Athletic Wear</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-serif-display font-bold text-xl mb-6 text-accent tracking-wide">Contact Us</h3>
                        <ul className="space-y-4 border-l border-white/10 pl-4">
                            <li className="flex items-start gap-3 group">
                                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-accent group-hover:text-white transition-colors" />
                                <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                                    Neemuch, Madhya Pradesh, India
                                </span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <Phone className="h-5 w-5 flex-shrink-0 text-accent group-hover:text-white transition-colors" />
                                <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">+91 84691 59877</span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <Mail className="h-5 w-5 flex-shrink-0 text-accent group-hover:text-white transition-colors" />
                                <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">info@anshuukam.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm opacity-60 flex items-center gap-1 font-mono">
                            © {new Date().getFullYear()} Anshuukam Textile Pvt Ltd.
                        </p>
                        <p className="text-[10px] opacity-40 uppercase tracking-widest">
                            Industrial Grade Manufacturing
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 border border-white/10 hover:border-accent hover:bg-accent/10 transition-all duration-300 group"
                            aria-label="YouTube"
                        >
                            <Youtube className="h-5 w-5 opacity-70 group-hover:opacity-100 group-hover:text-accent transition-all" />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 border border-white/10 hover:border-accent hover:bg-accent/10 transition-all duration-300 group"
                            aria-label="Instagram"
                        >
                            <Instagram className="h-5 w-5 opacity-70 group-hover:opacity-100 group-hover:text-accent transition-all" />
                        </a>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 border border-white/10 hover:border-accent hover:bg-accent/10 transition-all duration-300 group"
                            aria-label="Facebook"
                        >
                            <Facebook className="h-5 w-5 opacity-70 group-hover:opacity-100 group-hover:text-accent transition-all" />
                        </a>
                        <a
                            href="https://x.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 border border-white/10 hover:border-accent hover:bg-accent/10 transition-all duration-300 group"
                            aria-label="X (Twitter)"
                        >
                            <svg
                                className="h-5 w-5 opacity-70 group-hover:opacity-100 group-hover:text-accent transition-all"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
