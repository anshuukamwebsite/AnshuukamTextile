import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { getFabrics, createFabric } from "@/lib/services/catalogue";

const createFabricSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    composition: z.string().optional(),
    weight: z.string().optional(),
    properties: z.record(z.string(), z.boolean()).optional(),
    imageUrl: z.string().url().optional().nullable(),
    images: z.array(z.string().url()).optional(),
    displayOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get("includeInactive") === "true";

        const fabricList = await getFabrics(!includeInactive);

        return NextResponse.json({ success: true, data: fabricList });
    } catch (error) {
        console.error("Failed to fetch fabrics:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch fabrics" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = createFabricSchema.parse(body);

        const result = await createFabric(validatedData);

        // Invalidate cache so public pages show new data immediately
        revalidateTag("fabrics", "max");

        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to create fabric:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create fabric" },
            { status: 500 }
        );
    }
}
