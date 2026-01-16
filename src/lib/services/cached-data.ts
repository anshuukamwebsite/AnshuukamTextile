import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import {
    clothingTypes,
    fabrics,
    factoryPhotos,
    siteSettings,
    catalogueItems,
    catalogueImages,
} from "@/lib/db/schema";
import { eq, asc, desc, and } from "drizzle-orm";

// ==================== CLOTHING TYPES ====================

export const getCachedClothingTypes = unstable_cache(
    async () => {
        const types = await db
            .select()
            .from(clothingTypes)
            .where(eq(clothingTypes.isActive, true))
            .orderBy(asc(clothingTypes.displayOrder));
        return types;
    },
    ["clothing-types"],
    {
        tags: ["catalogue"],
        revalidate: false, // Cache until tag invalidation
    }
);

export const getCachedClothingTypeBySlug = unstable_cache(
    async (slug: string) => {
        const result = await db
            .select()
            .from(clothingTypes)
            .where(eq(clothingTypes.slug, slug))
            .limit(1);
        return result[0] || null;
    },
    ["clothing-type-by-slug"],
    {
        tags: ["catalogue"],
        revalidate: false,
    }
);

// ==================== CATALOGUE ITEMS (PRODUCTS) ====================

export const getCachedCatalogueItems = unstable_cache(
    async (categoryId: string) => {
        const items = await db
            .select({
                id: catalogueItems.id,
                name: catalogueItems.name,
                slug: catalogueItems.slug,
                description: catalogueItems.description,
                minOrderQuantity: catalogueItems.minOrderQuantity,
                imageUrl: catalogueImages.imageUrl,
                isCustomizable: catalogueItems.isCustomizable,
                leadTime: catalogueItems.leadTime,
            })
            .from(catalogueItems)
            .leftJoin(
                catalogueImages,
                and(
                    eq(catalogueImages.catalogueItemId, catalogueItems.id),
                    eq(catalogueImages.isPrimary, true)
                )
            )
            .where(
                and(
                    eq(catalogueItems.clothingTypeId, categoryId),
                    eq(catalogueItems.isActive, true)
                )
            )
            .orderBy(asc(catalogueItems.displayOrder));
        return items;
    },
    ["catalogue-items-by-category"],
    {
        tags: ["catalogue"],
        revalidate: false,
    }
);

export const getCachedCatalogueItemBySlug = unstable_cache(
    async (slug: string) => {
        const item = await db
            .select()
            .from(catalogueItems)
            .where(eq(catalogueItems.slug, slug))
            .limit(1);

        if (!item[0]) return null;

        const images = await db
            .select()
            .from(catalogueImages)
            .where(eq(catalogueImages.catalogueItemId, item[0].id))
            .orderBy(asc(catalogueImages.displayOrder));

        return {
            ...item[0],
            images: images.map((img) => img.imageUrl),
            imageUrl: images.find((img) => img.isPrimary)?.imageUrl || images[0]?.imageUrl || null,
        };
    },
    ["catalogue-item-by-slug"],
    {
        tags: ["catalogue"],
        revalidate: false,
    }
);

// ==================== FABRICS ====================

export const getCachedFabrics = unstable_cache(
    async () => {
        const fabricList = await db
            .select()
            .from(fabrics)
            .where(eq(fabrics.isActive, true))
            .orderBy(asc(fabrics.displayOrder));
        return fabricList;
    },
    ["fabrics"],
    {
        tags: ["fabrics"],
        revalidate: false,
    }
);

export const getCachedFabricBySlug = unstable_cache(
    async (slug: string) => {
        const result = await db
            .select()
            .from(fabrics)
            .where(eq(fabrics.slug, slug))
            .limit(1);
        return result[0] || null;
    },
    ["fabric-by-slug"],
    {
        tags: ["fabrics"],
        revalidate: false,
    }
);

// ==================== FACTORY PHOTOS ====================

export const getCachedFactoryPhotos = unstable_cache(
    async () => {
        const photos = await db
            .select()
            .from(factoryPhotos)
            .where(eq(factoryPhotos.isActive, true))
            .orderBy(asc(factoryPhotos.displayOrder), desc(factoryPhotos.createdAt));
        return photos;
    },
    ["all_photos"],
    {
        tags: ["factory"],
        revalidate: false,
    }
);

// ==================== SETTINGS ====================

export const getCachedCapacityStats = unstable_cache(
    async () => {
        const result = await db
            .select()
            .from(siteSettings)
            .where(eq(siteSettings.key, "capacity_stats"))
            .limit(1);

        const setting = result[0];
        if (setting && setting.value && Array.isArray(setting.value)) {
            return setting.value as Array<{
                icon: string;
                value: string;
                label: string;
                description: string;
            }>;
        }

        // Return default stats if not found
        return [
            { icon: "Package", value: "500", label: "Minimum Order Qty", description: "Units per style" },
            { icon: "TrendingUp", value: "100K+", label: "Monthly Capacity", description: "Units production" },
            { icon: "Clock", value: "3-6", label: "Lead Time", description: "Weeks to delivery" },
            { icon: "Ruler", value: "XS-5XL", label: "Size Range", description: "Full size coverage" },
            { icon: "Layers", value: "50+", label: "Fabric Options", description: "Premium materials" },
            { icon: "Award", value: "25+", label: "Years Experience", description: "In the industry" },
        ];
    },
    ["capacity-stats"],
    {
        tags: ["settings"],
        revalidate: false,
    }
);

export const getCachedNavigationData = unstable_cache(
    async () => {
        // Fetch Categories
        const categories = await db
            .select()
            .from(clothingTypes)
            .where(eq(clothingTypes.isActive, true))
            .orderBy(asc(clothingTypes.displayOrder));

        // Fetch Products for all active categories
        const allProducts = await db
            .select({
                id: catalogueItems.id,
                name: catalogueItems.name,
                slug: catalogueItems.slug,
                clothingTypeId: catalogueItems.clothingTypeId,
                description: catalogueItems.description,
                imageUrl: catalogueImages.imageUrl,
            })
            .from(catalogueItems)
            .leftJoin(
                catalogueImages,
                and(
                    eq(catalogueImages.catalogueItemId, catalogueItems.id),
                    eq(catalogueImages.isPrimary, true)
                )
            )
            .where(eq(catalogueItems.isActive, true));

        // Group products by category
        const categoriesWithProducts = categories.map(cat => ({
            ...cat,
            products: allProducts.filter(p => p.clothingTypeId === cat.id)
        }));

        // Fetch Fabrics
        const fabricList = await db
            .select()
            .from(fabrics)
            .where(eq(fabrics.isActive, true))
            .orderBy(asc(fabrics.displayOrder));

        return {
            categories: categoriesWithProducts,
            fabrics: fabricList
        };
    },
    ["navigation-data"],
    {
        tags: ["catalogue", "fabrics"],
        revalidate: false,
    }
);
