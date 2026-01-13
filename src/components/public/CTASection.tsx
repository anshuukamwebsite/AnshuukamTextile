import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { getSettingValue } from "@/lib/services/settings";

export async function CTASection() {
    const contactEmail = await getSettingValue<string>("contact_email", "sales@premiumtextiles.com");
    const contactPhone = await getSettingValue<string>("contact_phone", "+1 234 567 890");

    return (
        <section className="section-industrial bg-primary text-primary-foreground relative overflow-hidden">
            {/* Fabric pattern overlay */}
            <div className="absolute inset-0 bg-fabric-pattern opacity-[0.03]" />
            <div className="container-industrial relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Start Your Order?
                    </h2>
                    <p className="text-lg opacity-90 mb-8 leading-relaxed">
                        Get a custom quote for your project. Our team will review your
                        requirements and provide competitive pricing within 24 hours.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link href="/enquiry">
                            <Button
                                size="lg"
                                className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-8"
                            >
                                Request Quote
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary h-12 px-8"
                            >
                                Contact Sales
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-8 justify-center text-sm opacity-80">
                        <div className="flex items-center justify-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{contactPhone}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{contactEmail}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
