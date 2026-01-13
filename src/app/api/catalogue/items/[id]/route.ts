import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import {
    getCatalogueItemById,
    updateCatalogueItem,
    deleteCatalogueItem,
    updateCatalogueItemImages,
    updateCatalogueItemColors,
} from "@/lib/services/catalogue";

const updateCatalogueItemSchema = z.object({
    clothingTypeId: z.string().uuid().optional(),
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    minOrderQuantity: z.number().int().min(1).optional(),
    productionCapacity: z.string().optional().nullable(),
    leadTime: z.string().optional().nullable(),
    sizeRange: z.string().optional().nullable(),
    availableFabrics: z.array(z.string().uuid()).optional().nullable(),
    features: z.array(z.string()).optional().nullable(),
    specifications: z.record(z.string(), z.string()).optional().nullable(),
    displayOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    images: z.array(z.string()).optional(),
    isCustomizable: z.boolean().optional(),
    colors: z.array(z.object({
        name: z.string(),
        hex: z.string(),
        frontImageUrl: z.string(),
        backImageUrl: z.string(),
        sideImageUrl: z.string(),
    })).optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const item = await getCatalogueItemById(id);

        if (!item) {
            return NextResponse.json(
                { success: false, error: "Catalogue item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: item });
    } catch (error) {
        console.error("Failed to fetch catalogue item:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch catalogue item" },
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
        const validatedData = updateCatalogueItemSchema.parse(body);

        const { images, colors, ...itemData } = validatedData;

        const result = await updateCatalogueItem(id, itemData);

        if (!result) {
            return NextResponse.json(
                { success: false, error: "Catalogue item not found" },
                { status: 404 }
            );
        }

        if (images) {
            await updateCatalogueItemImages(id, images);
        }

        if (colors) {
            await updateCatalogueItemColors(id, colors);
        }

        // Invalidate cache so public pages show updated item immediately
        revalidateTag("catalogue", "max");

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to update catalogue item:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update catalogue item" },
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
        await deleteCatalogueItem(id);

        // Invalidate cache so public pages reflect deletion immediately
        revalidateTag("catalogue", "max");

        return NextResponse.json({ success: true, message: "Catalogue item deleted" });
    } catch (error) {
        console.error("Failed to delete catalogue item:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete catalogue item" },
            { status: 500 }
        );
    }
}
