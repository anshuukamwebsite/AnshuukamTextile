import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { getContactSettings } from "@/lib/services/settings";

export const metadata = {
    title: "Contact Us | Anshuukam Textile",
    description: "Get in touch with Anshuukam Textile for enquiries, quotes, or any questions about our garment manufacturing services.",
};

export default async function ContactPage() {
    const contact = await getContactSettings();

    const email = contact.email;
    const phone = contact.phone;

    return (
        <div className="min-h-screen bg-blueprint relative">
            {/* Industrial Warning Stripe Top */}
            <div className="absolute top-0 left-0 right-0 h-1 industrial-stripe opacity-20" />

            {/* Page Header - Kept compact as requested */}
            <section className="relative bg-primary text-primary-foreground py-8 overflow-hidden border-b border-white/10">
                {/* Fabric background pattern */}
                <div className="absolute inset-0 bg-fabric-pattern opacity-10" />
                <div className="absolute inset-0 bg-steel-plate opacity-5 mix-blend-overlay" />

                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-2 text-white/80">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                            <span className="text-xs font-mono tracking-widest uppercase">GET_IN_TOUCH</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2 font-serif-display tracking-wide">Contact Us</h1>
                        <p className="text-sm text-primary-foreground/70 font-light font-mono">
                            Get in touch with our team for enquiries, quotes, or any questions
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="section-industrial relative">
                <div className="container-industrial relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <div className="section-tag mb-6">
                                <span className="w-2 h-2 bg-accent rounded-full" />
                                COMMUNICATION_CHANNELS
                            </div>
                            <h2 className="text-3xl font-bold mb-6 font-serif-display">Get In Touch</h2>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                Have questions about our products or services? Want to request
                                a quote? Our team is here to help.
                            </p>

                            <div className="grid gap-4">
                                <div className="card-factory p-4 flex items-start gap-4 group hover:border-accent transition-colors">
                                    <div className="p-3 bg-muted rounded-sm group-hover:bg-accent/10 transition-colors">
                                        <Mail className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold font-serif-display mb-1">Email</h3>
                                            <span className="text-[10px] font-mono text-muted-foreground">CH-01</span>
                                        </div>
                                        <a href={`mailto:${email}`} className="text-sm font-mono text-muted-foreground hover:text-accent transition-colors">
                                            {email}
                                        </a>
                                    </div>
                                </div>

                                <div className="card-factory p-4 flex items-start gap-4 group hover:border-accent transition-colors">
                                    <div className="p-3 bg-muted rounded-sm group-hover:bg-accent/10 transition-colors">
                                        <Phone className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold font-serif-display mb-1">Phone</h3>
                                            <span className="text-[10px] font-mono text-muted-foreground">CH-02</span>
                                        </div>
                                        <a href={`tel:${phone}`} className="text-sm font-mono text-muted-foreground hover:text-accent transition-colors">
                                            {phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="card-factory p-4 flex items-start gap-4 group hover:border-accent transition-colors">
                                    <div className="p-3 bg-muted rounded-sm group-hover:bg-accent/10 transition-colors">
                                        <MapPin className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold font-serif-display mb-1">Address</h3>
                                            <span className="text-[10px] font-mono text-muted-foreground">LOC-HQ</span>
                                        </div>
                                        <p className="text-sm font-mono text-muted-foreground">
                                            Anshuukam Textile Pvt Ltd<br />
                                            Neemuch, Madhya Pradesh<br />
                                            India
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Quote Card */}
                            <div className="card-factory p-6 mt-8 bg-muted/30 border-dashed">
                                <h3 className="text-xl font-bold mb-2 font-serif-display">Request a Quote</h3>
                                <p className="text-muted-foreground mb-4 text-sm">
                                    Fill out our enquiry form to receive a customized quote within 24 hours.
                                </p>
                                <Link href="/enquiry">
                                    <Button className="btn-industrial w-full">
                                        Start Enquiry Form
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Google Maps */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold font-serif-display">Our Location</h3>
                            </div>
                            <div className="relative w-full h-[400px] lg:h-[500px] bg-muted p-2 card-factory">
                                {/* Technical overlay corners */}
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent z-20 m-2" />
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent z-20 m-2" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent z-20 m-2" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent z-20 m-2" />

                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3629.330606800771!2d74.93329847536073!3d24.543234878137742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjTCsDMyJzM1LjciTiA3NMKwNTYnMDkuMSJF!5e0!3m2!1sen!2sin!4v1768544554889!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale hover:grayscale-0 transition-all duration-500 relative z-10"
                                />
                            </div>
                            <p className="text-xs font-mono text-muted-foreground text-center uppercase tracking-wider">
                                Visit our manufacturing facility for a tour
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
