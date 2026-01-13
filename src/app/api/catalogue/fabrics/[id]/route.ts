import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import {
    getFabricById,
    getFabricBySlug,
    updateFabric,
    deleteFabric,
} from "@/lib/services/catalogue";

const updateFabricSchema = z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    composition: z.string().optional().nullable(),
    weight: z.string().optional().nullable(),
    properties: z.record(z.string(), z.boolean()).optional().nullable(),
    imageUrl: z.string().url().optional().nullable(),
    images: z.array(z.string().url()).optional(),
    displayOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
});

// Helper to check if string is UUID
function isUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Try to find by ID (UUID) or by slug
        let fabric;
        if (isUUID(id)) {
            fabric = await getFabricById(id);
        } else {
            fabric = await getFabricBySlug(id);
        }

        if (!fabric) {
            return NextResponse.json(
                { success: false, error: "Fabric not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: fabric });
    } catch (error) {
        console.error("Failed to fetch fabric:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch fabric" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const validatedData = updateFabricSchema.parse(body);

        const result = await updateFabric(id, validatedData);

        if (!result) {
            return NextResponse.json(
                { success: false, error: "Fabric not found" },
                { status: 404 }
            );
        }

        // Invalidate cache so public pages show updated data immediately
        revalidateTag("fabrics", "max");

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to update fabric:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update fabric" },
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
        await deleteFabric(id);

        // Invalidate cache so public pages reflect deletion immediately
        revalidateTag("fabrics", "max");

        return NextResponse.json({ success: true, message: "Fabric deleted" });
    } catch (error) {
        console.error("Failed to delete fabric:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete fabric" },
            { status: 500 }
        );
    }
}
