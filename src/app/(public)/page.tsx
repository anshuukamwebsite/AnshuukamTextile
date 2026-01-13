import {
    Hero,
    CapacityStats,
    CatalogueGrid,
    FabricSection,
    CTASection,
} from "@/components/public";

export default function HomePage() {
    return (
        <>
            <Hero />
            <CapacityStats />
            <CatalogueGrid />
            <FabricSection />
            <CTASection />
        </>
    );
}
