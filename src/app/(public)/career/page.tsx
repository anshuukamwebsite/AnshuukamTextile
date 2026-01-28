import { Briefcase } from "lucide-react";

export default function CareerPage() {
    return (
        <div className="min-h-screen bg-blueprint flex flex-col relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

            <main className="flex-1 container-industrial py-12 md:py-24 relative z-10 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-8 border border-accent/20 ">
                    <Briefcase className="h-12 w-12 text-accent" />
                </div>

                <div className="section-tag mb-4 justify-center">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    CAREERS
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif-display tracking-wide">
                    Career Opportunities
                </h1>

                <p className="text-muted-foreground max-w-xl text-lg font-mono leading-relaxed mb-8">
                    Content yet to be updated. Check back soon for exciting positions at Anshuukam Textile.
                </p>


            </main>
        </div>
    );
}
