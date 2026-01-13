import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    getDesignTemplateById,
    updateDesignTemplate,
    deleteDesignTemplate,
} from "@/lib/services/design-templates";

const updateTemplateSchema = z.object({
    name: z.string().min(1).optional(),
    colorName: z.string().min(1).optional(),
    colorHex: z.string().min(1).optional(),
    frontImageUrl: z.string().url().optional(),
    backImageUrl: z.string().url().optional(),
    sideImageUrl: z.string().url().optional(),
    isActive: z.boolean().optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const template = await getDesignTemplateById(id);

        if (!template) {
            return NextResponse.json(
                { success: false, error: "Template not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: template });
    } catch (error) {
        console.error("Failed to fetch template:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch template" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const validatedData = updateTemplateSchema.parse(body);

        const template = await updateDesignTemplate(id, validatedData);

        if (!template) {
            return NextResponse.json(
                { success: false, error: "Template not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: template });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to update template:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update template" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteDesignTemplate(id);

        return NextResponse.json({ success: true, message: "Template deleted" });
    } catch (error) {
        console.error("Failed to delete template:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete template" },
            { status: 500 }
        );
    }
}
