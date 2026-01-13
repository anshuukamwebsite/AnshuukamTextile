import { db } from "@/lib/db";
import { designEnquiries, DesignEnquiry, NewDesignEnquiry } from "@/lib/db/schema";
import { eq, desc, sql, or, and } from "drizzle-orm";

export interface DesignEnquiryFilters {
    status?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export async function getDesignEnquiries(filters: DesignEnquiryFilters = {}) {
    const { status, priority, search, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (status && status !== "all") {
        conditions.push(eq(designEnquiries.status, status));
    }

    if (priority && priority !== "all") {
        conditions.push(eq(designEnquiries.priority, priority));
    }

    if (search) {
        const searchLower = `%${search.toLowerCase()}%`;
        conditions.push(
            or(
                sql`lower(${designEnquiries.companyName}) like ${searchLower}`,
                sql`lower(${designEnquiries.contactPerson}) like ${searchLower}`,
                sql`lower(${designEnquiries.email}) like ${searchLower}`,
                sql`lower(${designEnquiries.phoneNumber}) like ${searchLower}`
            )
        );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db.query.designEnquiries.findMany({
        where: whereClause,
        orderBy: [desc(designEnquiries.createdAt)],
        limit: limit,
        offset: offset,
        with: {
            fabric: true,
        },
    });

    // Get total count for pagination
    const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(designEnquiries)
        .where(whereClause);

    const total = Number(totalResult[0]?.count || 0);

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getDesignEnquiryById(id: string) {
    const result = await db.query.designEnquiries.findFirst({
        where: eq(designEnquiries.id, id),
        with: {
            fabric: true,
        },
    });
    return result || null;
}

export async function createDesignEnquiry(data: NewDesignEnquiry) {
    const result = await db.insert(designEnquiries).values(data).returning();
    return result[0];
}

export async function updateDesignEnquiry(id: string, data: Partial<DesignEnquiry>) {
    const result = await db
        .update(designEnquiries)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(designEnquiries.id, id))
        .returning();
    return result[0];
}

export async function updateDesignEnquiryStatus(
    id: string,
    status: string,
    adminNotes?: string
) {
    const updateData: Partial<DesignEnquiry> = { status, updatedAt: new Date() };
    if (adminNotes !== undefined) {
        updateData.adminNotes = adminNotes;
    }

    const result = await db
        .update(designEnquiries)
        .set(updateData)
        .where(eq(designEnquiries.id, id))
        .returning();
    return result[0];
}

export async function deleteDesignEnquiry(id: string) {
    // First, get the enquiry to find the image URLs
    const enquiry = await getDesignEnquiryById(id);

    if (enquiry) {
        // Import supabase client for storage operations
        const { createAdminClient } = await import("@/lib/supabase/server");
        const supabase = await createAdminClient();

        // Helper to extract path from Supabase URL
        const extractPath = (url: string | null | undefined): string | null => {
            if (!url) return null;
            try {
                const urlObj = new URL(url);
                // URLs are like: .../storage/v1/object/public/all_photos/path/to/file
                const match = urlObj.pathname.match(/\/storage\/v1\/object\/public\/all_photos\/(.+)/);
                return match ? match[1] : null;
            } catch {
                return null;
            }
        };

        // Collect all image paths to delete
        const pathsToDelete: string[] = [];

        const frontPath = extractPath(enquiry.designImageUrl);
        if (frontPath) pathsToDelete.push(frontPath);

        const backPath = extractPath(enquiry.backDesignImageUrl);
        if (backPath) pathsToDelete.push(backPath);

        const sidePath = extractPath(enquiry.sideDesignImageUrl);
        if (sidePath) pathsToDelete.push(sidePath);

        // Handle original logos (could be JSON array or single URL)
        if (enquiry.originalLogoUrl) {
            try {
                const logos = JSON.parse(enquiry.originalLogoUrl);
                if (Array.isArray(logos)) {
                    logos.forEach((logo: string) => {
                        const path = extractPath(logo);
                        if (path) pathsToDelete.push(path);
                    });
                }
            } catch {
                // Not JSON, treat as single URL
                const path = extractPath(enquiry.originalLogoUrl);
                if (path) pathsToDelete.push(path);
            }
        }

        // Delete files from storage
        if (pathsToDelete.length > 0) {
            const { error } = await supabase.storage.from("all_photos").remove(pathsToDelete);
            if (error) {
                console.error("Failed to delete images from storage:", error);
            }
        }
    }

    // Delete the database record
    await db.delete(designEnquiries).where(eq(designEnquiries.id, id));
}

export async function deleteAllDesignEnquiries() {
    await db.delete(designEnquiries);
}

export async function getDesignEnquiryStats() {
    const stats = await db
        .select({
            status: designEnquiries.status,
            count: sql<number>`count(*)::int`,
        })
        .from(designEnquiries)
        .groupBy(designEnquiries.status);

    const total = stats.reduce((acc, s) => acc + s.count, 0);
    const pending = stats.find((s) => s.status === "pending")?.count || 0;
    const contacted = stats.find((s) => s.status === "contacted")?.count || 0;
    const quoted = stats.find((s) => s.status === "quoted")?.count || 0;
    const closed = stats.find((s) => s.status === "closed")?.count || 0;

    return { total, pending, contacted, quoted, closed };
}
