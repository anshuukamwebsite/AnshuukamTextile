import {
    Hero,
    CapacityStats,
    CatalogueGrid,
    CTASection,
    ExhibitionSlider,
} from "@/components/public";
import { getFeaturedShowcasePhotos } from "@/lib/services/gallery";

export default async function HomePage() {
    const featuredPhotos = await getFeaturedShowcasePhotos();

    return (
        <>
            <Hero />
            {featuredPhotos.length > 0 && <ExhibitionSlider photos={featuredPhotos} />}
            <CapacityStats />
            <CatalogueGrid />
            <CTASection />
        </>
    );
}
