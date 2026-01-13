import Link from "next/link";
import { ArrowLeft, Shield, FileText, Truck, RefreshCcw, Copyright } from "lucide-react";
import { getLegalPageSettings } from "@/lib/services/settings";

export const metadata = {
    title: "Legal & Policies | Anshuukam Textile",
    description: "Privacy Policy, Terms of Service, Refund Policy, Shipping Terms, and Intellectual Property information for Anshuukam Textile.",
};

const iconMap: Record<string, any> = {
    privacy: Shield,
    terms: FileText,
    refund: RefreshCcw,
    shipping: Truck,
    ip: Copyright,
};

export default async function LegalPage() {
    const content = await getLegalPageSettings();

    const sectionOrder = ["privacy", "terms", "refund", "shipping", "ip"] as const;

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
                            LEGAL
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2 font-serif-display tracking-wide">
                            Legal & Policies
                        </h1>
                        <p className="text-sm text-primary-foreground/70 font-light max-w-2xl leading-relaxed font-mono">
                            Our policies governing the use of our website and services.
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Navigation */}
            <section className="border-b border-border bg-muted/30">
                <div className="container-industrial py-4">
                    <div className="flex flex-wrap gap-2">
                        {sectionOrder.map((key) => {
                            const section = content[key];
                            const Icon = iconMap[key];
                            return (
                                <a
                                    key={key}
                                    href={`#${key}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:border-accent hover:text-accent transition-colors"
                                >
                                    <Icon className="h-4 w-4" />
                                    {section.title}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Legal Content */}
            <section className="section-industrial">
                <div className="container-industrial">
                    <div className="max-w-4xl mx-auto space-y-16">
                        {sectionOrder.map((key) => {
                            const section = content[key];
                            const Icon = iconMap[key];
                            return (
                                <div key={key} id={key} className="scroll-mt-24">
                                    <div className="card-factory p-8 bg-background">
                                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
                                            <div className="p-3 bg-accent/10 rounded-lg">
                                                <Icon className="h-6 w-6 text-accent" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold font-serif-display">{section.title}</h2>
                                                <p className="text-xs font-mono text-muted-foreground">Last updated: {section.lastUpdated}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {section.sections.map((item: any, index: number) => (
                                                <div key={index}>
                                                    <h3 className="font-bold text-lg mb-2">{item.heading}</h3>
                                                    <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Company Info Footer */}
            <section className="bg-muted/50 py-12 border-t border-dashed border-border">
                <div className="container-industrial">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-sm font-mono text-muted-foreground mb-2">
                            ANSHUUKAM TEXTILE PRIVATE LIMITED
                        </p>
                        <p className="text-xs text-muted-foreground">
                            GSTIN: 23ABBCA8915B1Z5 | Registered Office: Neemuch, Madhya Pradesh, India
                        </p>
                        <p className="text-xs text-muted-foreground mt-4">
                            For any legal queries, please contact us at our official address or through the Contact page.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
