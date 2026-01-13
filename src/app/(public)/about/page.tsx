import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Users, FileText, ArrowRight } from "lucide-react";
import { getAboutPageSettings } from "@/lib/services/settings";

export const metadata = {
    title: "About Us | Anshuukam Textile",
    description: "Anshuukam Textile Private Limited - Where Fabric Meets Emotion. Professional garment manufacturing from Neemuch, Madhya Pradesh.",
};

export default async function AboutPage() {
    const content = await getAboutPageSettings();

    return (
        <div className="min-h-screen bg-blueprint relative">
            {/* Industrial Warning Stripe Top */}
            <div className="absolute top-0 left-0 right-0 h-1 industrial-stripe opacity-20" />

            {/* Page Header */}
            <section className="relative bg-primary text-primary-foreground py-12 overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 bg-fabric-pattern opacity-10" />
                <div className="absolute inset-0 bg-steel-plate opacity-5 mix-blend-overlay" />

                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <div className="section-tag mb-2 text-white/80 border-white/20">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                            ABOUT US
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 font-serif-display tracking-wide">
                            {content.hero.title}
                        </h1>
                        <p className="text-base text-primary-foreground/80 font-light max-w-2xl leading-relaxed">
                            {content.hero.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="section-industrial relative">
                <div className="container-industrial relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block border border-accent/20 bg-accent/5 px-4 py-1 rounded-full text-xs font-mono text-accent mb-8">
                            MISSION_STATEMENT.TXT
                        </div>
                        <blockquote className="text-2xl md:text-3xl font-medium mb-8 leading-relaxed font-serif-display">
                            "{content.mission.quote}"
                        </blockquote>
                        <div className="h-1 w-24 bg-accent mx-auto mb-8" />
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto font-light">
                            {content.mission.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Navigation Cards to Subpages */}
            <section className="section-industrial-alt border-y border-border">
                <div className="container-industrial">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold font-serif-display mb-2">Learn More About Us</h2>
                        <p className="text-muted-foreground text-sm font-mono">Explore our team, values, and policies</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {/* Team Card */}
                        <Link href="/about/team" className="group">
                            <div className="card-factory p-8 h-full bg-background hover:border-accent transition-all duration-300">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                                        <Users className="h-6 w-6 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold font-serif-display group-hover:text-accent transition-colors">
                                            Our Team & Values
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Meet our founders, learn about our story, and discover the values that drive us.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-accent">
                                    View Team
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Legal Card */}
                        <Link href="/about/legal" className="group">
                            <div className="card-factory p-8 h-full bg-background hover:border-accent transition-all duration-300">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                                        <FileText className="h-6 w-6 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold font-serif-display group-hover:text-accent transition-colors">
                                            Legal & Policies
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Privacy Policy, Terms of Service, Refund Policy, Shipping Terms, and more.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-accent">
                                    View Policies
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Company Info */}
            <section className="bg-muted/50 py-12 border-b border-dashed border-border">
                <div className="container-industrial">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 card-factory p-8 bg-background">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-accent/10 rounded-full">
                                <MapPin className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">Headquarters</p>
                                <span className="font-medium">{content.company_info.location}</span>
                            </div>
                        </div>
                        <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-8 w-full md:w-auto">
                            <p className="font-bold font-serif-display text-lg mb-1">{content.company_info.name}</p>
                            <p className="text-xs font-mono text-muted-foreground bg-muted inline-block px-2 py-1 rounded">GSTIN: {content.company_info.gstin}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-fabric-pattern opacity-10" />
                <div className="absolute inset-0 bg-blueprint mix-blend-overlay opacity-20" />

                <div className="container-industrial relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif-display">{content.cta.title}</h2>
                    <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg font-light">
                        {content.cta.description}
                    </p>
                    <Link href="/enquiry">
                        <Button variant="secondary" size="lg" className="h-12 px-8 text-base font-medium hover:bg-accent hover:text-white transition-colors">
                            Request Quote
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
