import { db } from "@/lib/db";
import { siteSettings, siteSections } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const SETTING_KEY = "about_page";
const FACTORY_SETTING_KEY = "factory_page";
const LEGAL_SETTING_KEY = "legal_page";

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

// Default content structure for Legal Page
const defaultLegalContent = {
    privacy: {
        title: "Privacy Policy",
        lastUpdated: "January 2026",
        sections: [
            {
                heading: "Information We Collect",
                text: "We collect information you provide directly to us, such as when you submit an enquiry, request a quote, or contact us. This may include your name, email address, phone number, company name, and details about your product requirements."
            },
            {
                heading: "How We Use Your Information",
                text: "We use the information we collect to: respond to your enquiries and provide customer support; process and fulfill your orders; send you updates about your orders and our services; improve our website and services; comply with legal obligations."
            },
            {
                heading: "Information Sharing",
                text: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or serving you, so long as those parties agree to keep this information confidential."
            },
            {
                heading: "Data Security",
                text: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
            },
            {
                heading: "Cookies",
                text: "Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect some functionality of the website."
            },
            {
                heading: "Your Rights",
                text: "You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at the details provided on our Contact page."
            }
        ]
    },
    terms: {
        title: "Terms of Service",
        lastUpdated: "January 2026",
        sections: [
            {
                heading: "Acceptance of Terms",
                text: "By accessing and using this website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website."
            },
            {
                heading: "Business-to-Business (B2B) Services",
                text: "Anshuukam Textile Private Limited operates as a B2B garment manufacturing company. Our services are intended for businesses, retailers, and bulk buyers. Minimum order quantities apply to all orders."
            },
            {
                heading: "Quotes and Orders",
                text: "All quotes provided are valid for 15 days unless otherwise specified. Prices are subject to change based on fabric costs, order volume, and customization requirements. Orders are confirmed only upon receipt of advance payment as per agreed terms."
            },
            {
                heading: "Intellectual Property",
                text: "All content on this website, including text, graphics, logos, and images, is the property of Anshuukam Textile Private Limited and is protected by applicable intellectual property laws."
            },
            {
                heading: "Limitation of Liability",
                text: "Anshuukam Textile shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services or products. Our total liability shall not exceed the amount paid for the specific order in question."
            },
            {
                heading: "Governing Law",
                text: "These terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Neemuch, Madhya Pradesh."
            }
        ]
    },
    refund: {
        title: "Refund & Cancellation Policy",
        lastUpdated: "January 2026",
        sections: [
            {
                heading: "Order Cancellation",
                text: "Orders may be cancelled within 24 hours of confirmation without any charges. After production has commenced, cancellation may incur charges for materials already procured and work completed."
            },
            {
                heading: "Custom Orders",
                text: "As a B2B manufacturer, most of our orders are custom-made to client specifications. Custom orders are non-refundable once production has begun, as materials are specifically procured for each order."
            },
            {
                heading: "Quality Issues",
                text: "If you receive products that do not meet the agreed-upon specifications or have manufacturing defects, please notify us within 7 days of delivery. We will inspect the products and offer replacement or credit at our discretion."
            },
            {
                heading: "Refund Process",
                text: "Approved refunds will be processed within 15-30 business days. Refunds will be credited to the original payment method used for the order. Shipping costs are non-refundable unless the return is due to our error."
            },
            {
                heading: "Advance Payments",
                text: "Advance payments are adjusted against the final order value. In case of order cancellation after advance payment, refunds will be made after deducting applicable charges for work already completed."
            }
        ]
    },
    shipping: {
        title: "Shipping & Delivery Terms",
        lastUpdated: "January 2026",
        sections: [
            {
                heading: "Production Lead Time",
                text: "Standard production lead time is 3-5 weeks from order confirmation and receipt of advance payment. Lead times may vary based on order complexity, volume, and current production capacity."
            },
            {
                heading: "Shipping Methods",
                text: "We ship via reputable logistics partners across India. International shipping is available for bulk orders. Shipping method and carrier will be confirmed at the time of dispatch."
            },
            {
                heading: "Shipping Costs",
                text: "Shipping costs are calculated based on order volume, weight, and destination. Costs will be communicated and agreed upon before order confirmation. For bulk orders above certain thresholds, we may offer subsidized or free shipping."
            },
            {
                heading: "Risk of Loss",
                text: "Risk of loss and title for products pass to the buyer upon delivery to the carrier. We recommend purchasing shipping insurance for high-value orders."
            },
            {
                heading: "Delivery Confirmation",
                text: "Tracking information will be provided once the order is dispatched. Please inspect packages upon delivery and report any visible damage to the carrier immediately."
            },
            {
                heading: "Delayed Deliveries",
                text: "While we strive to meet all delivery timelines, delays may occur due to factors beyond our control. We will communicate any significant delays promptly and work to minimize impact on your business."
            }
        ]
    },
    ip: {
        title: "Intellectual Property Notice",
        lastUpdated: "January 2026",
        sections: [
            {
                heading: "Website Content",
                text: "All content on the Anshuukam Textile website, including but not limited to text, graphics, logos, images, and software, is the property of Anshuukam Textile Private Limited and is protected by Indian and international copyright laws."
            },
            {
                heading: "Client Designs",
                text: "Designs, logos, and artwork provided by clients for manufacturing remain the intellectual property of the respective clients. We do not claim any rights over client-provided materials and maintain strict confidentiality."
            },
            {
                heading: "Custom Design Work",
                text: "For designs created by Anshuukam Textile as part of a custom order, intellectual property rights may be transferred to the client upon full payment and mutual agreement. Such transfers will be documented in writing."
            },
            {
                heading: "Prohibited Use",
                text: "You may not reproduce, distribute, modify, or create derivative works from any content on this website without prior written permission from Anshuukam Textile Private Limited."
            },
            {
                heading: "Trademark",
                text: "'Anshuukam Textile' and associated logos are trademarks of Anshuukam Textile Private Limited. Use of these trademarks without authorization is strictly prohibited."
            }
        ]
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

export const getLegalPageSettings = unstable_cache(
    async () => {
        try {
            const setting = await db.query.siteSettings.findFirst({
                where: eq(siteSettings.key, LEGAL_SETTING_KEY),
            });

            if (!setting) {
                return defaultLegalContent;
            }

            return setting.value as typeof defaultLegalContent;
        } catch (error) {
            console.error("Failed to fetch legal page settings:", error);
            return defaultLegalContent;
        }
    },
    ["legal-page-settings"],
    {
        tags: ["legal-page"],
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
