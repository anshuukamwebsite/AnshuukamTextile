import { db } from "@/lib/db";
import { reviews, type NewReview } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export async function createReview(data: NewReview) {
    return await db.insert(reviews).values(data).returning();
}

export const getPublicReviews = unstable_cache(
    async () => {
        return await db.query.reviews.findMany({
            where: and(
                eq(reviews.status, "approved"),
                eq(reviews.isVisible, true)
            ),
            orderBy: [desc(reviews.createdAt)],
        });
    },
    ["public-reviews"],
    {
        tags: ["reviews"],
        revalidate: 3600 // Revalidate every hour
    }
);

export async function getAllReviews() {
    return await db.query.reviews.findMany({
        orderBy: [desc(reviews.createdAt)],
    });
}

export async function updateReviewStatus(id: string, status: "approved" | "rejected" | "pending") {
    return await db
        .update(reviews)
        .set({ status, updatedAt: new Date() })
        .where(eq(reviews.id, id))
        .returning();
}

export async function toggleReviewVisibility(id: string, isVisible: boolean) {
    return await db
        .update(reviews)
        .set({ isVisible, updatedAt: new Date() })
        .where(eq(reviews.id, id))
        .returning();
}

export async function deleteReview(id: string) {
    return await db.delete(reviews).where(eq(reviews.id, id)).returning();
}
