import { NextResponse } from "next/server";
import { createReview, getAllReviews, getPublicReviews } from "@/lib/services/reviews";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const isAdmin = searchParams.get("admin") === "true";

        if (isAdmin) {
            // Pagination parameters
            const page = parseInt(searchParams.get("page") || "1");
            const limit = parseInt(searchParams.get("limit") || "10");
            const offset = (page - 1) * limit;
            const statusFilter = searchParams.get("status");

            // Get all reviews
            let allReviews = await getAllReviews();

            // Apply status filter if provided
            if (statusFilter && statusFilter !== "all") {
                allReviews = allReviews.filter(review => review.status === statusFilter);
            }

            const totalCount = allReviews.length;
            const paginatedReviews = allReviews.slice(offset, offset + limit);

            return NextResponse.json({
                success: true,
                data: paginatedReviews,
                pagination: {
                    page,
                    limit,
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                },
            });
        } else {
            const reviews = await getPublicReviews();
            return NextResponse.json({ success: true, data: reviews });
        }
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.name || !body.rating || !body.message) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        const newReview = await createReview({
            name: body.name,
            company: body.company,
            email: body.email,
            rating: body.rating,
            message: body.message,
            status: "pending", // Always pending initially
            isVisible: true,
        });

        // Revalidate the reviews page (though new reviews won't show until approved)
        revalidatePath("/reviews");

        return NextResponse.json({ success: true, data: newReview });
    } catch (error) {
        console.error("Failed to create review:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create review" },
            { status: 500 }
        );
    }
}
