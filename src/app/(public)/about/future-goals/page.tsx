import { Leaf, Sun, Wind, Recycle, Droplets, Target } from "lucide-react";

export const metadata = {
    title: "Future Goals & Sustainability | Anshuukam Textile",
    description: "Discover Anshuukam Textile's commitment to a sustainable future through renewable energy and eco-friendly manufacturing practices.",
};

export default function FutureGoalsPage() {
    return (
        <div className="min-h-screen bg-blueprint relative">
            {/* Industrial Warning Stripe Top */}
            <div className="absolute top-0 left-0 right-0 h-1 industrial-stripe opacity-20" />

            {/* Page Header */}
            <section className="relative bg-primary text-primary-foreground py-16 overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 bg-fabric-pattern opacity-10" />
                <div className="absolute inset-0 bg-steel-plate opacity-5 mix-blend-overlay" />

                <div className="container-industrial relative z-10">
                    <div className="max-w-3xl">
                        <div className="section-tag mb-4 text-white/80 border-white/20">
                            <span className="w-2 h-2 bg-accent rounded-full " />
                            VISION 2030
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif-display tracking-wide">
                            Our Future Goals
                        </h1>
                        <p className="text-lg text-primary-foreground/80 font-light max-w-2xl leading-relaxed">
                            At Anshuukam Textile, we believe that the future of manufacturing is green.
                            Our roadmap focuses on integrating sustainable energy and circular practices
                            into every stitch of our production.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sustainability Pillars */}
            <section className="section-industrial">
                <div className="container-industrial">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Renewable Energy */}
                        <div className="card-factory p-8 bg-background border-accent/10 hover:border-accent transition-all duration-300 group">
                            <div className="relative h-48 w-full mb-6 overflow-hidden rounded-lg bg-muted shadow-lg">
                                <img
                                    src="https://images.pexels.com/photos/9800003/pexels-photo-9800003.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    alt="Solar Panels on Factory Roof"
                                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100"
                                />
                            </div>
                            <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4">
                                <Sun className="h-6 w-6 text-accent" />
                            </div>
                            <h3 className="text-xl font-bold font-serif-display mb-4">Renewable Energy</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                Strategic transition to 100% solar and wind energy for our manufacturing units.
                                Reducing our carbon footprint through localized clean power generation.
                            </p>
                            <div className="text-[10px] font-mono text-accent uppercase tracking-widest bg-accent/5 px-2 py-1 rounded inline-block">
                                Target: 2030
                            </div>
                        </div>

                        {/* Zero Waste Manufacturing */}
                        <div className="card-factory p-8 bg-background border-accent/10 hover:border-accent transition-all duration-300 group">
                            <div className="relative h-48 w-full mb-6 overflow-hidden rounded-lg bg-muted shadow-lg">
                                <img
                                    src="https://images.pexels.com/photos/11496275/pexels-photo-11496275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    alt="Textile Recycling Process"
                                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100"
                                />
                            </div>
                            <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4">
                                <Recycle className="h-6 w-6 text-accent" />
                            </div>
                            <h3 className="text-xl font-bold font-serif-display mb-4">Zero Waste</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                Implementing a circular economy model where 100% of fabric scraps and
                                manufacturing waste are recycled or repurposed into new textile products.
                            </p>
                            <div className="text-[10px] font-mono text-accent uppercase tracking-widest bg-accent/5 px-2 py-1 rounded inline-block">
                                Target: 2030
                            </div>
                        </div>

                        {/* Water Conservation */}
                        <div className="card-factory p-8 bg-background border-accent/10 hover:border-accent transition-all duration-300 group">
                            <div className="relative h-48 w-full mb-6 overflow-hidden rounded-lg bg-muted shadow-lg">
                                <img
                                    src="https://images.pexels.com/photos/5115946/pexels-photo-5115946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    alt="Industrial Water Treatment Plant"
                                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100"
                                />
                            </div>
                            <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4">
                                <Droplets className="h-6 w-6 text-accent" />
                            </div>
                            <h3 className="text-xl font-bold font-serif-display mb-4">Water Recycling</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                Advanced Effluent Treatment Plants (ETP) to recycle process water,
                                ensuring zero liquid discharge and preserving local water resources.
                            </p>
                            <div className="text-[10px] font-mono text-accent uppercase tracking-widest bg-accent/5 px-2 py-1 rounded inline-block">
                                Target: Active/Expanding
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Deep Quote Section */}
            <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-steel-plate opacity-10" />
                <div className="container-industrial relative z-10 text-center max-w-4xl mx-auto">
                    <Target className="h-12 w-12 text-accent mx-auto mb-8 opacity-50" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 font-serif-display leading-tight italic">
                        "Sustainability is not a goal to be reached, but a mindset that guides every decision we make in the factory floor."
                    </h2>
                    <div className="h-1 w-20 bg-accent mx-auto" />
                </div>
            </section>

            {/* Long Term Strategy */}
            <section className="section-industrial relative">
                <div className="container-industrial">
                    <div className="max-w-3xl mx-auto">
                        <div className="section-tag mb-8">
                            <span className="w-2 h-2 bg-accent rounded-full" />
                            LONG TERM ROADMAP
                        </div>
                        <div className="space-y-12">
                            <div className="flex gap-6 items-start">
                                <div className="text-3xl font-serif-display font-bold text-accent/20">01</div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2 font-serif-display">Solar Grid Integration</h4>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Installing 500KW solar panels across our factory rooftops to achieve
                                        energy independence and contribute surplus power to the local grid.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start border-t border-border pt-8">
                                <div className="text-3xl font-serif-display font-bold text-accent/20">02</div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2 font-serif-display">Sustainable Sourcing</h4>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Acquiring Global Organic Textile Standard (GOTS) certification for
                                        100% of our cotton-based products by the end of 2026.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start border-t border-border pt-8 group">
                                <div className="text-3xl font-serif-display font-bold text-accent/20">03</div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-bold mb-2 font-serif-display">Digital Twin Factory</h4>
                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                        Implementing smart AI sensors to monitor energy inefficiency in real-time,
                                        optimizing machine performance for minimal ecological impact.
                                    </p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
