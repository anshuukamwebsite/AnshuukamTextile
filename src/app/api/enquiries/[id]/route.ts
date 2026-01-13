import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    getEnquiryById,
    updateEnquiry,
    updateEnquiryStatus,
    deleteEnquiry,
} from "@/lib/services/enquiries";

const updateEnquirySchema = z.object({
    status: z.enum(["pending", "contacted", "quoted", "closed"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    deadline: z.string().nullable().optional(), // ISO date string
    adminNotes: z.string().optional(),
    phoneNumber: z.string().min(1).optional(),
    email: z.string().email().optional().nullable(),
    companyName: z.string().optional().nullable(),
    contactPerson: z.string().optional().nullable(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const enquiry = await getEnquiryById(id);

        if (!enquiry) {
            return NextResponse.json(
                { success: false, error: "Enquiry not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: enquiry });
    } catch (error) {
        console.error("Failed to fetch enquiry:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch enquiry" },
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
        const validatedData = updateEnquirySchema.parse(body);

        // Prepare update data
        const updateData: any = { ...validatedData };

        // Handle deadline and priority
        if (validatedData.deadline) {
            const deadlineDate = new Date(validatedData.deadline);
            updateData.deadline = deadlineDate;

            // Calculate priority based on deadline
            const now = new Date();
            const diffTime = deadlineDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 2) {
                updateData.priority = "high";
            } else if (diffDays <= 7) {
                updateData.priority = "medium";
            } else {
                updateData.priority = "low";
            }
        } else if (validatedData.deadline === null) {
            // If deadline is removed, reset priority to medium (default)
            updateData.priority = "medium";
        }

        const result = await updateEnquiry(id, updateData);

        if (!result) {
            return NextResponse.json(
                { success: false, error: "Enquiry not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Failed to update enquiry:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update enquiry" },
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
        const { status, adminNotes } = body;

        if (!status) {
            return NextResponse.json(
                { success: false, error: "Status required" },
                { status: 400 }
            );
        }

        const result = await updateEnquiryStatus(id, status, adminNotes);

        if (!result) {
            return NextResponse.json(
                { success: false, error: "Enquiry not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("Failed to update enquiry status:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update enquiry status" },
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
        await deleteEnquiry(id);

        return NextResponse.json({ success: true, message: "Enquiry deleted" });
    } catch (error) {
        console.error("Failed to delete enquiry:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete enquiry" },
            { status: 500 }
        );
    }
}
