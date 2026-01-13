import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { factoryPhotos } from "@/lib/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { z } from "zod";

const createPhotoSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    imageUrl: z.string().url(),
    category: z.string().optional(),
    displayOrder: z.number().int().optional(),
});

const updatePhotoSchema = createPhotoSchema.partial().extend({
    id: z.string().uuid(),
    isActive: z.boolean().optional(),
});

// GET - Fetch all factory photos
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get("includeInactive") === "true";

        let photos;
        if (includeInactive) {
            photos = await db
                .select()
                .from(factoryPhotos)
                .orderBy(asc(factoryPhotos.displayOrder), desc(factoryPhotos.createdAt));
        } else {
            photos = await db
                .select()
                .from(factoryPhotos)
                .where(eq(factoryPhotos.isActive, true))
                .orderBy(asc(factoryPhotos.displayOrder), desc(factoryPhotos.createdAt));
        }

        return NextResponse.json({ success: true, data: photos });
    } catch (error) {
        console.error("Failed to fetch factory photos:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch factory photos" },
            { status: 500 }
        );
    }
}

// POST - Create a new factory photo
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = createPhotoSchema.parse(body);

        const result = await db
            .insert(factoryPhotos)
            .values(validatedData)
            .returning();

        // Invalidate cache so public pages show new photo immediately
        revalidateTag("factory", "max");

        return NextResponse.json(
            { success: true, data: result[0] },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to create factory photo:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create factory photo" },
            { status: 500 }
        );
    }
}

// PUT - Update a factory photo
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = updatePhotoSchema.parse(body);
        const { id, ...updateData } = validatedData;

        const result = await db
            .update(factoryPhotos)
            .set({ ...updateData, updatedAt: new Date() })
            .where(eq(factoryPhotos.id, id))
            .returning();

        if (result.length === 0) {
            return NextResponse.json(
                { success: false, error: "Photo not found" },
                { status: 404 }
            );
        }

        // Invalidate cache so public pages show updated photo immediately
        revalidateTag("factory", "max");

        return NextResponse.json({ success: true, data: result[0] });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to update factory photo:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update factory photo" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a factory photo
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Photo ID is required" },
                { status: 400 }
            );
        }

        const result = await db
            .delete(factoryPhotos)
            .where(eq(factoryPhotos.id, id))
            .returning();

        if (result.length === 0) {
            return NextResponse.json(
                { success: false, error: "Photo not found" },
                { status: 404 }
            );
        }

        // Invalidate cache so public pages reflect deletion immediately
        revalidateTag("factory", "max");

        return NextResponse.json({ success: true, message: "Photo deleted" });
    } catch (error) {
        console.error("Failed to delete factory photo:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete factory photo" },
            { status: 500 }
        );
    }
}
