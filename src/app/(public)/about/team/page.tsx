import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Sparkles, Shield, Target, Globe, Award, Zap, Heart, Star, CheckCircle, ArrowLeft } from "lucide-react";
import { getAboutPageSettings } from "@/lib/services/settings";

const iconMap: Record<string, any> = {
    Sparkles, Shield, Users, Target, Globe, Award, Zap, Heart, Star, CheckCircle,
    "VAL-01": Heart,
    "VAL-02": CheckCircle,
    "VAL-03": Users,
};

export const metadata = {
    title: "Our Team | Anshuukam Textile",
    description: "Meet the founders and leadership team behind Anshuukam Textile. Learn about our story, values, and commitment to quality.",
};

export default async function TeamPage() {
    const content = await getAboutPageSettings();

    return (
        <div className="min-h-screen bg-blueprint relative">
            {/* Industrial Warning Stripe Top */}
            <div className="absolute top-0 left-0 right-0 h-1 industrial-stripe opacity-20" />

            {/* Page Header */}
            <section className="relative bg-primary text-primary-foreground py-8 overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 bg-fabric-pattern opacity-10" />
                <div className="absolute inset-0 bg-steel-plate opacity-5 mix-blend-overlay" />

                <div className="container-industrial relative z-10">
                    <Link href="/about" className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground mb-4 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to About
                    </Link>
                    <div className="max-w-3xl">
                        <div className="section-tag mb-2 text-white/80 border-white/20">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                            LEADERSHIP
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2 font-serif-display tracking-wide">
                            Our Team & Values
                        </h1>
                        <p className="text-sm text-primary-foreground/70 font-light max-w-2xl leading-relaxed font-mono">
                            Meet the people behind Anshuukam Textile and discover what drives us every day.
                        </p>
                    </div>
                </div>
            </section>

            {/* Founders Section */}
            <section className="section-industrial-alt border-b border-border relative overflow-hidden">
                <div className="absolute inset-0 bg-metal-mesh opacity-5" />
                <div className="container-industrial relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Founders Cards */}
                        <div className="grid grid-cols-1 gap-6">
                            {content.story.founders.map((founder: any) => (
                                <div key={founder.name} className="card-factory p-6 bg-background hover:border-accent transition-colors flex flex-col sm:flex-row gap-6 items-center text-center sm:text-left group">
                                    <div className="relative h-32 w-32 shrink-0 rounded-full overflow-hidden bg-muted border-2 border-border group-hover:border-accent transition-colors shadow-lg">
                                        {founder.imageUrl ? (
                                            <img src={founder.imageUrl} alt={founder.name} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full w-full bg-muted">
                                                <Users className="h-12 w-12 text-muted-foreground/50" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold font-serif-display text-2xl mb-1">{founder.name}</h3>
                                        <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">{founder.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Our Story */}
                        <div>
                            <div className="section-tag mb-6">
                                <span className="w-2 h-2 bg-accent rounded-full" />
                                OUR STORY
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif-display">
                                {content.story.title}
                            </h2>
                            <div className="space-y-6 text-muted-foreground leading-relaxed">
                                {content.story.content.map((paragraph: string, index: number) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section-industrial">
                <div className="container-industrial">
                    <div className="text-center mb-12">
                        <div className="section-tag inline-block mb-4">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                            CORE VALUES
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif-display">{content.values.title}</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto font-mono text-sm">
                            {content.values.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {content.values.items.map((value: any) => {
                            const Icon = iconMap[value.icon] || iconMap[value.id] || Sparkles;
                            return (
                                <div key={value.id} className="card-factory p-8 text-center group hover:border-accent transition-all duration-300">
                                    <div className="absolute top-2 right-2 text-[10px] font-mono text-muted-foreground opacity-50">
                                        {value.id}
                                    </div>
                                    <div className="w-16 h-16 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-300">
                                        <Icon className="h-8 w-8 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 font-serif-display group-hover:text-accent transition-colors">{value.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-fabric-pattern opacity-10" />
                <div className="absolute inset-0 bg-blueprint mix-blend-overlay opacity-20" />

                <div className="container-industrial relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif-display">Work With Us</h2>
                    <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg font-light">
                        Partner with a team that values quality, trust, and craftsmanship above all.
                    </p>
                    <a href="mailto:info@anshuukam.com">
                        <Button variant="secondary" size="lg" className="h-12 px-8 text-base font-medium hover:bg-accent hover:text-white transition-colors">
                            Get in Touch
                        </Button>
                    </a>
                </div>
            </section>
        </div>
    );
}
