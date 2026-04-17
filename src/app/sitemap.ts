import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { catalogueItems, clothingTypes, fabrics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const BASE_URL = "https://anshuukamtextile.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}`, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
        { url: `${BASE_URL}/catalogue`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
        { url: `${BASE_URL}/fabrics`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/factory`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE_URL}/design`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${BASE_URL}/about/team`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${BASE_URL}/about/future-goals`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${BASE_URL}/about/legal`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
        { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE_URL}/enquiry`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: `${BASE_URL}/reviews`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
        { url: `${BASE_URL}/career`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ];

    // Dynamic: Clothing type category pages
    let categoryPages: MetadataRoute.Sitemap = [];
    try {
        const categories = await db.select({ slug: clothingTypes.slug }).from(clothingTypes);
        categoryPages = categories.map((cat) => ({
            url: `${BASE_URL}/catalogue/${cat.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));
    } catch (e) {
        console.error("Sitemap: Failed to fetch categories", e);
    }

    // Dynamic: Product pages
    let productPages: MetadataRoute.Sitemap = [];
    try {
        const products = await db
            .select({
                productSlug: catalogueItems.slug,
                categorySlug: clothingTypes.slug,
            })
            .from(catalogueItems)
            .innerJoin(clothingTypes, eq(catalogueItems.clothingTypeId, clothingTypes.id))
            .where(eq(catalogueItems.isActive, true));

        productPages = products.map((p) => ({
            url: `${BASE_URL}/catalogue/${p.categorySlug}/${p.productSlug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));
    } catch (e) {
        console.error("Sitemap: Failed to fetch products", e);
    }

    // Dynamic: Fabric pages
    let fabricPages: MetadataRoute.Sitemap = [];
    try {
        const allFabrics = await db.select({ slug: fabrics.slug }).from(fabrics);
        fabricPages = allFabrics.map((f) => ({
            url: `${BASE_URL}/fabrics/${f.slug}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        }));
    } catch (e) {
        console.error("Sitemap: Failed to fetch fabrics", e);
    }

    return [...staticPages, ...categoryPages, ...productPages, ...fabricPages];
}
