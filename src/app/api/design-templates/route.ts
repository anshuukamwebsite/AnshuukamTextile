import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    getAllDesignTemplates,
    getDesignTemplates,
    createDesignTemplate,
} from "@/lib/services/design-templates";

const createTemplateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    colorName: z.string().min(1, "Color name is required"),
    colorHex: z.string().min(1, "Color hex is required"),
    frontImageUrl: z.string().url("Front image URL is required"),
    backImageUrl: z.string().url("Back image URL is required"),
    sideImageUrl: z.string().url("Side image URL is required"),
    isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get("includeInactive") === "true";

        const templates = includeInactive
            ? await getAllDesignTemplates()
            : await getDesignTemplates();

        return NextResponse.json({ success: true, data: templates });
    } catch (error) {
        console.error("Failed to fetch design templates:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch design templates" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = createTemplateSchema.parse(body);

        const template = await createDesignTemplate(validatedData);

        return NextResponse.json({ success: true, data: template }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to create design template:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create design template" },
            { status: 500 }
        );
    }
}
