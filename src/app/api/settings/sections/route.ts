import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    getSiteSections,
    getVisibleSections,
    getSectionByKey,
    upsertSection,
    updateSectionVisibility,
    updateSectionContent,
} from "@/lib/services/settings";

const updateSectionSchema = z.object({
    title: z.string().optional(),
    content: z.unknown().optional(),
    isVisible: z.boolean().optional(),
    displayOrder: z.number().int().optional(),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const visibleOnly = searchParams.get("visibleOnly") === "true";
        const key = searchParams.get("key");

        if (key) {
            const section = await getSectionByKey(key);
            if (!section) {
                return NextResponse.json(
                    { success: false, error: "Section not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, data: section });
        }

        const sections = visibleOnly
            ? await getVisibleSections()
            : await getSiteSections();

        return NextResponse.json({ success: true, data: sections });
    } catch (error) {
        console.error("Failed to fetch sections:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch sections" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get("key");

        if (!key) {
            return NextResponse.json(
                { success: false, error: "Section key required" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const validatedData = updateSectionSchema.parse(body);

        const result = await upsertSection(key, validatedData);

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to update section:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update section" },
            { status: 500 }
        );
    }
}

// Toggle section visibility
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { sectionKey, isVisible } = body;

        if (!sectionKey || typeof isVisible !== "boolean") {
            return NextResponse.json(
                { success: false, error: "Section key and visibility required" },
                { status: 400 }
            );
        }

        const result = await updateSectionVisibility(sectionKey, isVisible);

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("Failed to update section visibility:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update section visibility" },
            { status: 500 }
        );
    }
}
