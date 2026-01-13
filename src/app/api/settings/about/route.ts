import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

const SETTING_KEY = "about_page";

// Default content structure to return if no settings exist
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
            { name: "Purva Jain", role: "Director", id: "01" },
            { name: "Sanath Sharma", role: "Director", id: "02" }
        ]
    },
    values: {
        title: "What We Stand For",
        description: "This is more than a company — it's a journey woven with hard work, vision, and dreams come true.",
        items: [
            {
                id: "VAL-01",
                title: "Crafted with Care",
                description: "Every garment goes through meticulous quality checks. We believe quality isn't just made — it's crafted."
            },
            {
                id: "VAL-02",
                title: "Precision & Trust",
                description: "From fabric selection to final dispatch, we bring together skill, precision, and trust under one roof."
            },
            {
                id: "VAL-03",
                title: "Partnership",
                description: "When passion becomes partnership, the result is pure creation. We grow together with our clients."
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

export async function GET() {
    try {
        const setting = await db.query.siteSettings.findFirst({
            where: eq(siteSettings.key, SETTING_KEY),
        });

        if (!setting) {
            return NextResponse.json({ success: true, data: defaultContent });
        }

        return NextResponse.json({ success: true, data: setting.value });
    } catch (error) {
        console.error("Failed to fetch about page settings:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch settings" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        // Basic validation could go here

        const existingSetting = await db.query.siteSettings.findFirst({
            where: eq(siteSettings.key, SETTING_KEY),
        });

        if (existingSetting) {
            await db
                .update(siteSettings)
                .set({
                    value: body,
                    updatedAt: new Date()
                })
                .where(eq(siteSettings.key, SETTING_KEY));
        } else {
            await db.insert(siteSettings).values({
                key: SETTING_KEY,
                value: body,
                description: "Content for the About Us page",
            });
        }

        // Revalidate the cache for the about page
        revalidateTag("about-page", "max");

        return NextResponse.json({ success: true, message: "Settings updated successfully" });
    } catch (error) {
        console.error("Failed to update about page settings:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update settings" },
            { status: 500 }
        );
    }
}
