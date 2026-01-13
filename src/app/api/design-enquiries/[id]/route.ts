import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    getDesignEnquiryById,
    updateDesignEnquiryStatus,
    deleteDesignEnquiry,
} from "@/lib/services/design-enquiries";

const updateStatusSchema = z.object({
    status: z.string().min(1).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    deadline: z.string().nullable().optional(),
    adminNotes: z.string().optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const enquiry = await getDesignEnquiryById(id);

        if (!enquiry) {
            return NextResponse.json(
                { success: false, error: "Design enquiry not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: enquiry });
    } catch (error) {
        console.error("Failed to fetch design enquiry:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch design enquiry" },
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
        const validatedData = updateStatusSchema.parse(body);

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
            updateData.priority = "medium";
        }

        const { updateDesignEnquiry } = await import("@/lib/services/design-enquiries");
        const result = await updateDesignEnquiry(id, updateData);

        if (!result) {
            return NextResponse.json(
                { success: false, error: "Design enquiry not found" },
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
        console.error("Failed to update design enquiry:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update design enquiry" },
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
        await deleteDesignEnquiry(id);

        return NextResponse.json({ success: true, message: "Design enquiry deleted" });
    } catch (error) {
        console.error("Failed to delete design enquiry:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete design enquiry" },
            { status: 500 }
        );
    }
}
