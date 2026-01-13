import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import {
    getClothingTypes,
    createClothingType,
} from "@/lib/services/catalogue";

const createClothingTypeSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    imageUrl: z.string().url().optional().nullable(),
    images: z.array(z.string().url()).optional(),
    minOrderQuantity: z.number().int().optional(),
    leadTime: z.string().optional(),
    sizeRange: z.string().optional(),
    displayOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get("includeInactive") === "true";

        const types = await getClothingTypes(!includeInactive);

        return NextResponse.json({ success: true, data: types });
    } catch (error) {
        console.error("Failed to fetch clothing types:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch clothing types" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = createClothingTypeSchema.parse(body);

        const result = await createClothingType(validatedData);

        // Invalidate cache so public pages show new data immediately
        revalidateTag("catalogue", "max");

        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to create clothing type:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create clothing type" },
            { status: 500 }
        );
    }
}
