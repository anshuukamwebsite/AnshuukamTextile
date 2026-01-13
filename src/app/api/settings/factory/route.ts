import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

const SETTING_KEY = "factory_page";

// Default content structure to return if no settings exist
const defaultContent = {
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
        console.error("Failed to fetch factory page settings:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch settings" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

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
                description: "Content for the Factory page",
            });
        }

        // Revalidate the cache for the factory page
        revalidateTag("factory-page", "max");

        return NextResponse.json({ success: true, message: "Settings updated successfully" });
    } catch (error) {
        console.error("Failed to update factory page settings:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update settings" },
            { status: 500 }
        );
    }
}
