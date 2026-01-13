import {
    Package, Layers, Clock, Ruler, TrendingUp, Award,
    Factory, Users, Globe, Target, Shield, Zap,
    Truck, Settings, Star, CheckCircle, Box, Shirt,
    Scissors, Palette, Sparkles, BadgeCheck, Timer, Calendar,
} from "lucide-react";
import { FadeInStagger, FadeInItem } from "@/components/ui/MotionContainer";
import { getCachedCapacityStats } from "@/lib/services/cached-data";

const iconMap: Record<string, React.ElementType> = {
    Package, Layers, Clock, Ruler, TrendingUp, Award,
    Factory, Users, Globe, Target, Shield, Zap,
    Truck, Settings, Star, CheckCircle, Box, Shirt,
    Scissors, Palette, Sparkles, BadgeCheck, Timer, Calendar,
};

export async function CapacityStats() {
    const stats = await getCachedCapacityStats();

    return (
        <section className="section-industrial-alt bg-blueprint relative border-y border-border">
            <div className="container-industrial relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <div className="label-technical mb-2">PERFORMANCE METRICS</div>
                        <div className="h-1 w-20 bg-accent mx-auto" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Production Capabilities
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        We have the capacity and expertise to handle orders of any size,
                        with flexible MOQs and reliable delivery timelines.
                    </p>
                </div>

                {/* Stats Grid */}
                <FadeInStagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {stats.map((stat, index) => {
                        const IconComponent = iconMap[stat.icon] || Package;
                        return (
                            <FadeInItem key={`${stat.label}-${index}`}>
                                <div
                                    className="card-factory p-6 text-center h-full group hover:border-accent/50 transition-colors"
                                >
                                    {/* Technical corner accent */}
                                    <div className="absolute top-0 right-0 p-1">
                                        <div className="w-2 h-2 border-t border-r border-accent/50" />
                                    </div>

                                    <IconComponent className="h-8 w-8 mx-auto mb-4 text-accent group-hover:scale-110 transition-transform duration-300" />
                                    <div className="text-2xl md:text-3xl font-bold text-primary mb-1 font-mono tracking-tight">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm font-bold uppercase tracking-wider mb-2 text-foreground/80">{stat.label}</div>
                                    <div className="text-xs text-muted-foreground border-t border-dashed border-border pt-2 mt-2">
                                        {stat.description}
                                    </div>

                                    {/* Ruler marks at bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 marks-ruler opacity-30" />
                                </div>
                            </FadeInItem>
                        );
                    })}
                </FadeInStagger>

                {/* Industrial Divider */}
                <div className="mt-16 divider-industrial" />
            </div>
        </section>
    );
}
