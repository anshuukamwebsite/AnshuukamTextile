import { db } from "@/lib/db";
import { factoryPhotos } from "@/lib/db/schema";
import { eq, and, asc, desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getFeaturedShowcasePhotos = unstable_cache(
    async () => {
        try {
            return await db
                .select()
                .from(factoryPhotos)
                .where(
                    and(
                        eq(factoryPhotos.isActive, true),
                        eq(factoryPhotos.showInHomeSlider, true)
                    )
                )
                .orderBy(asc(factoryPhotos.displayOrder), desc(factoryPhotos.createdAt));
        } catch (error) {
            console.error("Failed to fetch featured showcase photos:", error);
            return [];
        }
    },
    ["featured-showcase-photos"],
    {
        tags: ["factory", "showcase"],
        revalidate: false
    }
);
