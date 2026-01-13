import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Users, MapPin, CheckCircle, Sparkles, Shield, Target, Globe, Award, Zap, Star } from "lucide-react";
import { getAboutPageSettings } from "@/lib/services/settings";

const iconMap: Record<string, any> = {
    Sparkles, Shield, Users, Target, Globe, Award, Zap, Heart, Star, CheckCircle,
    "VAL-01": Heart,
    "VAL-02": CheckCircle,
    "VAL-03": Users,
};

export default async function AboutPage() {
    const content = await getAboutPageSettings();

    return (
        <div className="min-h-screen bg-blueprint relative">
            {/* Industrial Warning Stripe Top */}
            <div className="absolute top-0 left-0 right-0 h-1 industrial-stripe opacity-20" />

            {/* Page Header */}
            <section className="relative bg-primary text-primary-foreground py-8 overflow-hidden border-b border-white/10">
                {/* Fabric background pattern */}
                <div className="absolute inset-0 bg-fabric-pattern opacity-10" />
                <div className="absolute inset-0 bg-steel-plate opacity-5 mix-blend-overlay" />

                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <div className="section-tag mb-2 text-white/80 border-white/20">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                            OUR STORY
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2 font-serif-display tracking-wide">
                            {content.hero.title}
                        </h1>
                        <p className="text-sm text-primary-foreground/70 font-light max-w-2xl leading-relaxed font-mono">
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
                        <blockquote className="text-3xl md:text-4xl font-medium mb-8 leading-relaxed font-serif-display">
                            "{content.mission.quote}"
                        </blockquote>
                        <div className="h-1 w-24 bg-accent mx-auto mb-8" />
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto font-light">
                            {content.mission.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Founders Section */}
            <section className="section-industrial-alt border-y border-border relative overflow-hidden">
                <div className="absolute inset-0 bg-metal-mesh opacity-5" />
                <div className="container-industrial relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Founders Image Placeholder */}
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

                        {/* Founders Story */}
                        <div>
                            <div className="section-tag mb-6">
                                <span className="w-2 h-2 bg-accent rounded-full" />
                                LEADERSHIP
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif-display">
                                {content.story.title}
                            </h2>
                            <div className="space-y-6 text-muted-foreground leading-relaxed">
                                {content.story.content.map((paragraph: string, index: number) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>

                            {/* Founders Names */}

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

            {/* Company Info */}
            <section className="bg-muted/50 py-12 border-t border-dashed border-border">
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
