import { Suspense } from "react";
import { EnquiryForm } from "@/components/public";

export const metadata = {
    title: "Request a Quote | Anshuukam Textile",
    description: "Get a custom quote for your garment manufacturing needs. Fill out the form and our team will respond within 24 hours.",
};

export default function EnquiryPage() {
    return (
        <div className="min-h-screen">
            {/* Page Header */}
            <section className="relative bg-primary text-primary-foreground py-8 overflow-hidden">
                {/* Fabric background pattern */}
                <div className="absolute inset-0 bg-fabric-pattern opacity-10" />
                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-2xl md:text-3xl font-medium mb-3">
                            Request a Quote
                        </h1>
                        <p className="text-sm text-primary-foreground/70 font-light">
                            Tell us about your requirements and our team will provide a custom
                            quote within 24 business hours.
                        </p>
                    </div>
                </div>
            </section>

            {/* Enquiry Form */}
            <section className="section-industrial">
                <div className="container-industrial">
                    <Suspense fallback={<div className="flex justify-center py-12">Loading form...</div>}>
                        <EnquiryForm />
                    </Suspense>
                </div>
            </section>
        </div>
    );
}
