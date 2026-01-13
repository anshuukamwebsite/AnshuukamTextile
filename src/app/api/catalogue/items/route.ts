import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import {
    getCatalogueItems,
    getCatalogueItemsByType,
    createCatalogueItem,
    updateCatalogueItemImages,
    updateCatalogueItemColors,
} from "@/lib/services/catalogue";

const createCatalogueItemSchema = z.object({
    clothingTypeId: z.string().uuid(),
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    minOrderQuantity: z.number().int().min(1).optional(),
    productionCapacity: z.string().optional(),
    leadTime: z.string().optional(),
    sizeRange: z.string().optional(),
    availableFabrics: z.array(z.string().uuid()).optional(),
    features: z.array(z.string()).optional(),
    specifications: z.record(z.string(), z.string()).optional(),
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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get("includeInactive") === "true";
        const clothingTypeId = searchParams.get("clothingTypeId");
        const isCustomizableParam = searchParams.get("isCustomizable");
        const isCustomizable = isCustomizableParam === "true" ? true : isCustomizableParam === "false" ? false : undefined;

        let items;
        if (clothingTypeId) {
            items = await getCatalogueItemsByType(clothingTypeId, !includeInactive, isCustomizable);
        } else {
            items = await getCatalogueItems(!includeInactive, isCustomizable);
        }

        return NextResponse.json({ success: true, data: items });
    } catch (error) {
        console.error("Failed to fetch catalogue items:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch catalogue items" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = createCatalogueItemSchema.parse(body);

        // Extract images and colors from data as it's not part of the catalogueItems table
        const { images, colors, ...itemData } = validatedData;

        const result = await createCatalogueItem(itemData);

        // Handle images if provided
        if (images && images.length > 0) {
            await updateCatalogueItemImages(result.id, images);
        }

        // Handle colors if provided
        if (colors && colors.length > 0) {
            await updateCatalogueItemColors(result.id, colors);
        }

        // Invalidate cache so public pages show new item immediately
        revalidateTag("catalogue", "max");

        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to create catalogue item:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create catalogue item" },
            { status: 500 }
        );
    }
}
