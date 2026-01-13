import { db } from "@/lib/db";
import { designTemplates, type NewDesignTemplate } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getDesignTemplates() {
    return await db.select().from(designTemplates).where(eq(designTemplates.isActive, true)).orderBy(desc(designTemplates.createdAt));
}

export async function getAllDesignTemplates() {
    return await db.select().from(designTemplates).orderBy(desc(designTemplates.createdAt));
}

export async function getDesignTemplateById(id: string) {
    const result = await db.select().from(designTemplates).where(eq(designTemplates.id, id));
    return result[0] || null;
}

export async function createDesignTemplate(data: NewDesignTemplate) {
    const result = await db.insert(designTemplates).values(data).returning();
    return result[0];
}

export async function updateDesignTemplate(id: string, data: Partial<NewDesignTemplate>) {
    const result = await db
        .update(designTemplates)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(designTemplates.id, id))
        .returning();
    return result[0];
}

export async function deleteDesignTemplate(id: string) {
    return await db.delete(designTemplates).where(eq(designTemplates.id, id));
}
