import { db } from "@/lib/db";
import { siteSettings, siteSections } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const SETTING_KEY = "about_page";
const FACTORY_SETTING_KEY = "factory_page";

// Default content structure for About Page
const defaultContent = {
    hero: {
        title: "Where Fabric Meets Emotion",
        description: "A dream that started with passion and dedication has now taken shape into a professional garment manufacturing unit."
    },
    mission: {
        quote: "Every stitch, every thread, and every design reflects our belief — quality isn't just made, it's crafted with care.",
        description: "From fabric checking to final dispatch, we bring together skill, precision, and trust under one roof. Proudly based in Neemuch (M.P.), we're here to deliver excellence in every piece we create."
    },
    story: {
        title: "Meet the Founders",
        content: [
            "Behind every strong brand, there's a story stitched with courage, consistency, and belief.",
            "Ours began with two minds, one vision — to build something meaningful. A dream company built together, where passion becomes partnership and the result is pure creation.",
            "Together, we are shaping Anshuukam Textile Pvt Ltd — a space where fabric meets emotion, and quality meets trust."
        ],
        founders: [
            { name: "Purva Jain", role: "Director", id: "01", imageUrl: "" },
            { name: "Sanath Sharma", role: "Director", id: "02", imageUrl: "" }
        ]
    },
    values: {
        title: "What We Stand For",
        description: "This is more than a company — it's a journey woven with hard work, vision, and dreams come true.",
        items: [
            {
                id: "VAL-01",
                title: "Crafted with Care",
                description: "Every garment goes through meticulous quality checks. We believe quality isn't just made — it's crafted.",
                icon: "Sparkles"
            },
            {
                id: "VAL-02",
                title: "Precision & Trust",
                description: "From fabric selection to final dispatch, we bring together skill, precision, and trust under one roof.",
                icon: "Shield"
            },
            {
                id: "VAL-03",
                title: "Partnership",
                description: "When passion becomes partnership, the result is pure creation. We grow together with our clients.",
                icon: "Users"
            }
        ]
    },
    company_info: {
        location: "Neemuch, Madhya Pradesh, India",
        name: "Anshuukam Textile Private Limited",
        gstin: "23ABBCA8915B1Z5"
    },
    cta: {
        title: "Ready to create something beautiful?",
        description: "Let's bring your vision to life. Get in touch to discuss your requirements."
    }
};

// Default content structure for Factory Page
const defaultFactoryContent = {
    hero: {
        title: "Our Factory",
        description: "Take a virtual tour of our state-of-the-art manufacturing facility with 50,000+ sq ft of production space."
    },
    stats: [
        { value: "50,000+", label: "Sq Ft Facility", id: "AREA" },
        { value: "200+", label: "Skilled Workers", id: "TEAM" },
        { value: "24/7", label: "Production", id: "TIME" },
        { value: "100%", label: "Quality Checked", id: "QC" },
    ],
    gallery: {
        title: "Inside Our Facility",
        description: "Explore our manufacturing facility through these photos. From cutting-edge machinery to our dedicated team."
    }
};

export const getAboutPageSettings = unstable_cache(
    async () => {
        try {
            const setting = await db.query.siteSettings.findFirst({
                where: eq(siteSettings.key, SETTING_KEY),
            });

            if (!setting) {
                return defaultContent;
            }

            return setting.value as typeof defaultContent;
        } catch (error) {
            console.error("Failed to fetch about page settings:", error);
            return defaultContent;
        }
    },
    ["about-page-settings"],
    {
        tags: ["about-page"],
        revalidate: false // Cache indefinitely until revalidated
    }
);

export const getFactoryPageSettings = unstable_cache(
    async () => {
        try {
            const setting = await db.query.siteSettings.findFirst({
                where: eq(siteSettings.key, FACTORY_SETTING_KEY),
            });

            if (!setting) {
                return defaultFactoryContent;
            }

            return setting.value as typeof defaultFactoryContent;
        } catch (error) {
            console.error("Failed to fetch factory page settings:", error);
            return defaultFactoryContent;
        }
    },
    ["factory-page-settings"],
    {
        tags: ["factory-page"],
        revalidate: false // Cache indefinitely until revalidated
    }
);

export const getSiteSettings = unstable_cache(
    async () => {
        try {
            return await db.query.siteSettings.findMany();
        } catch (error) {
            console.error("Failed to fetch site settings:", error);
            return [];
        }
    },
    ["site-settings"],
    {
        tags: ["settings"],
        revalidate: 3600 // Revalidate every hour
    }
);

export const getSettingByKey = unstable_cache(
    async (key: string) => {
        try {
            return await db.query.siteSettings.findFirst({
                where: eq(siteSettings.key, key),
            });
        } catch (error) {
            console.error(`Failed to fetch setting ${key}:`, error);
            return null;
        }
    },
    ["setting-by-key"],
    {
        tags: ["settings"],
        revalidate: 3600
    }
);

export const upsertSetting = async (key: string, value: unknown, description?: string) => {
    try {
        const existing = await db.query.siteSettings.findFirst({
            where: eq(siteSettings.key, key),
        });

        if (existing) {
            return await db
                .update(siteSettings)
                .set({
                    value,
                    description: description || existing.description,
                    updatedAt: new Date(),
                })
                .where(eq(siteSettings.key, key))
                .returning();
        } else {
            return await db
                .insert(siteSettings)
                .values({
                    key,
                    value,
                    description,
                })
                .returning();
        }
    } catch (error) {
        console.error(`Failed to upsert setting ${key}:`, error);
        throw error;
    }
};

export async function getSettingValue<T>(key: string, defaultValue: T): Promise<T> {
    const setting = await getSettingByKey(key);
    if (!setting || setting.value === null || setting.value === undefined) {
        return defaultValue;
    }
    return setting.value as T;
}

// ==================== SITE SECTIONS ====================

export const getSiteSections = unstable_cache(
    async () => {
        try {
            return await db.query.siteSections.findMany({
                orderBy: [asc(siteSections.displayOrder)],
            });
        } catch (error) {
            console.error("Failed to fetch site sections:", error);
            return [];
        }
    },
    ["site-sections"],
    {
        tags: ["sections"],
        revalidate: 3600
    }
);

export const getVisibleSections = unstable_cache(
    async () => {
        try {
            return await db.query.siteSections.findMany({
                where: eq(siteSections.isVisible, true),
                orderBy: [asc(siteSections.displayOrder)],
            });
        } catch (error) {
            console.error("Failed to fetch visible sections:", error);
            return [];
        }
    },
    ["visible-sections"],
    {
        tags: ["sections"],
        revalidate: 3600
    }
);

export const getSectionByKey = unstable_cache(
    async (key: string) => {
        try {
            return await db.query.siteSections.findFirst({
                where: eq(siteSections.sectionKey, key),
            });
        } catch (error) {
            console.error(`Failed to fetch section ${key}:`, error);
            return null;
        }
    },
    ["section-by-key"],
    {
        tags: ["sections"],
        revalidate: 3600
    }
);

export const upsertSection = async (key: string, data: any) => {
    try {
        const existing = await db.query.siteSections.findFirst({
            where: eq(siteSections.sectionKey, key),
        });

        if (existing) {
            return await db
                .update(siteSections)
                .set({
                    ...data,
                    updatedAt: new Date(),
                })
                .where(eq(siteSections.sectionKey, key))
                .returning();
        } else {
            return await db
                .insert(siteSections)
                .values({
                    sectionKey: key,
                    ...data,
                })
                .returning();
        }
    } catch (error) {
        console.error(`Failed to upsert section ${key}:`, error);
        throw error;
    }
};

export const updateSectionVisibility = async (key: string, isVisible: boolean) => {
    try {
        return await db
            .update(siteSections)
            .set({
                isVisible,
                updatedAt: new Date(),
            })
            .where(eq(siteSections.sectionKey, key))
            .returning();
    } catch (error) {
        console.error(`Failed to update visibility for section ${key}:`, error);
        throw error;
    }
};

export const updateSectionContent = async (key: string, content: any) => {
    try {
        return await db
            .update(siteSections)
            .set({
                content,
                updatedAt: new Date(),
            })
            .where(eq(siteSections.sectionKey, key))
            .returning();
    } catch (error) {
        console.error(`Failed to update content for section ${key}:`, error);
        throw error;
    }
};
