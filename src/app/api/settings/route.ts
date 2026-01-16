import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import {
    getSiteSettings,
    getSettingByKey,
    upsertSetting,
} from "@/lib/services/settings";

const updateSettingSchema = z.object({
    key: z.string().min(1),
    value: z.unknown(),
    description: z.string().optional(),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get("key");

        if (key) {
            const setting = await getSettingByKey(key);
            if (!setting) {
                return NextResponse.json(
                    { success: false, error: "Setting not found" },
                    { status: 404 }
                );
            }
            // Return just the value for easier consumption
            return NextResponse.json(
                { success: true, data: setting.value },
                {
                    headers: {
                        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
                    },
                }
            );
        }

        const settings = await getSiteSettings();

        // Convert to key-value object for easier consumption
        const settingsObject = settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {} as Record<string, unknown>);

        return NextResponse.json(
            { success: true, data: settingsObject, raw: settings },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
                },
            }
        );
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch settings" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = updateSettingSchema.parse(body);

        const result = await upsertSetting(
            validatedData.key,
            validatedData.value,
            validatedData.description
        );

        // Invalidate cache so public pages show updated settings immediately
        revalidateTag("settings", "max");

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to update setting:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update setting" },
            { status: 500 }
        );
    }
}

// Bulk update settings
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const settings = z.record(z.string(), z.unknown()).parse(body);

        const results = await Promise.all(
            Object.entries(settings).map(([key, value]) =>
                upsertSetting(key, value)
            )
        );

        // Invalidate cache so public pages show updated settings immediately
        revalidateTag("settings", "max");

        return NextResponse.json({ success: true, data: results });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to update settings:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update settings" },
            { status: 500 }
        );
    }
}
