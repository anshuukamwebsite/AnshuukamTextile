import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    getCatalogueImages,
    createCatalogueImage,
    deleteCatalogueImage,
    setPrimaryCatalogueImage,
} from "@/lib/services/catalogue";

const createImageSchema = z.object({
    imageUrl: z.string().url(),
    altText: z.string().optional(),
    displayOrder: z.number().int().optional(),
    isPrimary: z.boolean().optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const images = await getCatalogueImages(id);

        return NextResponse.json({ success: true, data: images });
    } catch (error) {
        console.error("Failed to fetch catalogue images:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch catalogue images" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const validatedData = createImageSchema.parse(body);

        const result = await createCatalogueImage({
            catalogueItemId: id,
            ...validatedData,
        });

        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to create catalogue image:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create catalogue image" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const imageId = searchParams.get("imageId");

        if (!imageId) {
            return NextResponse.json(
                { success: false, error: "Image ID required" },
                { status: 400 }
            );
        }

        await deleteCatalogueImage(imageId);

        return NextResponse.json({ success: true, message: "Image deleted" });
    } catch (error) {
        console.error("Failed to delete catalogue image:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete catalogue image" },
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
        const { imageId } = body;

        if (!imageId) {
            return NextResponse.json(
                { success: false, error: "Image ID required" },
                { status: 400 }
            );
        }

        await setPrimaryCatalogueImage(id, imageId);

        return NextResponse.json({ success: true, message: "Primary image updated" });
    } catch (error) {
        console.error("Failed to set primary image:", error);
        return NextResponse.json(
            { success: false, error: "Failed to set primary image" },
            { status: 500 }
        );
    }
}
