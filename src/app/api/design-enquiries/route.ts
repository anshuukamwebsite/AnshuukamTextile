import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    getDesignEnquiries,
    createDesignEnquiry,
    getDesignEnquiryStats,
    deleteAllDesignEnquiries,
} from "@/lib/services/design-enquiries";
import { getFabricById } from "@/lib/services/catalogue";
import { sendDesignEnquiryNotification } from "@/lib/services/email";

const createDesignEnquirySchema = z.object({
    designImageUrl: z.string(), // Front design - Can be data URL
    backDesignImageUrl: z.string().nullable().optional(), // Back design - Can be data URL
    sideDesignImageUrl: z.string().nullable().optional(), // Side design - Can be data URL
    originalLogoUrl: z.string().nullable().optional(), // Can be data URL
    fabricId: z.string().uuid(),
    printType: z.string().min(1),
    quantity: z.number().int().min(1),
    sizeRange: z.string().min(1),
    phoneNumber: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
    companyName: z.string().optional(),
    contactPerson: z.string().optional(),
    notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || undefined;
        const priority = searchParams.get("priority") || undefined;
        const search = searchParams.get("search") || undefined;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const statsOnly = searchParams.get("stats") === "true";

        if (statsOnly) {
            const stats = await getDesignEnquiryStats();
            return NextResponse.json({ success: true, data: stats });
        }

        const result = await getDesignEnquiries({
            status,
            priority,
            search,
            page,
            limit
        });

        return NextResponse.json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        console.error("Failed to fetch design enquiries:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch design enquiries" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = createDesignEnquirySchema.parse(body);

        // Fetch fabric name for reference
        const fabric = await getFabricById(validatedData.fabricId);

        if (!fabric) {
            return NextResponse.json(
                { success: false, error: "Invalid fabric" },
                { status: 400 }
            );
        }

        // Create design enquiry with fabric name stored for reference
        const result = await createDesignEnquiry({
            ...validatedData,
            fabricName: fabric.name,
            status: "pending",
        });

        // Send email notification
        try {
            await sendDesignEnquiryNotification({
                clothingType: "Custom Design",
                fabric: fabric.name,
                quantity: validatedData.quantity,
                sizeRange: validatedData.sizeRange,
                phoneNumber: validatedData.phoneNumber,
                email: validatedData.email || undefined,
                companyName: validatedData.companyName,
                contactPerson: validatedData.contactPerson,
                notes: validatedData.notes,
                printType: validatedData.printType,
            });
        } catch (emailError) {
            console.error("Failed to send email notification:", emailError);
            // Don't fail the request if email fails
        }

        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation failed:", JSON.stringify(error.issues, null, 2));
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to create design enquiry:", error);
        return NextResponse.json(
            { success: false, error: "Failed to submit design enquiry" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Design Enquiry ID is required" },
                { status: 400 }
            );
        }

        const { updateDesignEnquiry } = await import("@/lib/services/design-enquiries");
        const result = await updateDesignEnquiry(id, updateData);

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("Failed to update design enquiry:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update design enquiry" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await deleteAllDesignEnquiries();
        return NextResponse.json({ success: true, message: "All design enquiries deleted" });
    } catch (error) {
        console.error("Failed to delete all design enquiries:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete all design enquiries" },
            { status: 500 }
        );
    }
}
