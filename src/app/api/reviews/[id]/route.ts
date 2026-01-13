import { NextResponse } from "next/server";
import { updateReviewStatus, toggleReviewVisibility, deleteReview } from "@/lib/services/reviews";
import { revalidatePath } from "next/cache";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (body.status) {
            await updateReviewStatus(id, body.status);
        }

        if (typeof body.isVisible === "boolean") {
            await toggleReviewVisibility(id, body.isVisible);
        }

        // Revalidate the reviews page so changes appear immediately
        revalidatePath("/reviews");

        return NextResponse.json({ success: true, message: "Review updated successfully" });
    } catch (error) {
        console.error("Failed to update review:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update review" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteReview(id);

        // Revalidate the reviews page
        revalidatePath("/reviews");

        return NextResponse.json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        console.error("Failed to delete review:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete review" },
            { status: 500 }
        );
    }
}
