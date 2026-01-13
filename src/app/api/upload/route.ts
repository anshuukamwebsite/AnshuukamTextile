import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createAdminClient();
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const bucket = formData.get("bucket") as string || "all_photos";

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
                { status: 400 }
            );
        }

        // Validate file size (max 2MB)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, error: "File too large. Max size: 2MB" },
                { status: 400 }
            );
        }

        // Generate unique filename
        const extension = file.name.split(".").pop();
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filename, buffer, {
                contentType: file.type,
                cacheControl: "31536000",
                upsert: false,
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return NextResponse.json(
                { success: false, error: error.message || "Failed to upload file" },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return NextResponse.json({
            success: true,
            data: {
                path: data.path,
                url: urlData.publicUrl,
            },
        });
    } catch (error) {
        console.error("Upload failed:", error);
        return NextResponse.json(
            { success: false, error: "Failed to upload file" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createAdminClient();
        const { searchParams } = new URL(request.url);
        const path = searchParams.get("path");
        const bucket = searchParams.get("bucket") || "all_photos";

        if (!path) {
            return NextResponse.json(
                { success: false, error: "File path required" },
                { status: 400 }
            );
        }

        const { error } = await supabase.storage.from(bucket).remove([path]);

        if (error) {
            console.error("Supabase delete error:", error);
            return NextResponse.json(
                { success: false, error: "Failed to delete file" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: "File deleted" });
    } catch (error) {
        console.error("Delete failed:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete file" },
            { status: 500 }
        );
    }
}
