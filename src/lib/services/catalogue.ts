import { db } from "@/lib/db";
import {
    clothingTypes,
    fabrics,
    catalogueItems,
    catalogueImages,
    ClothingType,
    NewClothingType,
    Fabric,
    NewFabric,
    CatalogueItem,
    NewCatalogueItem,
    CatalogueImage,
    NewCatalogueImage,
    catalogueItemColors,
    NewCatalogueItemColor,
} from "@/lib/db/schema";
import { eq, asc, desc } from "drizzle-orm";

// ==================== CLOTHING TYPES ====================

export async function getClothingTypes(activeOnly = true) {
    const query = activeOnly
        ? db
            .select()
            .from(clothingTypes)
            .where(eq(clothingTypes.isActive, true))
            .orderBy(asc(clothingTypes.displayOrder))
        : db.select().from(clothingTypes).orderBy(asc(clothingTypes.displayOrder));

    return await query;
}

export async function getClothingTypeById(id: string) {
    const result = await db
        .select()
        .from(clothingTypes)
        .where(eq(clothingTypes.id, id))
        .limit(1);
    return result[0] || null;
}

export async function getClothingTypeBySlug(slug: string) {
    const result = await db
        .select()
        .from(clothingTypes)
        .where(eq(clothingTypes.slug, slug))
        .limit(1);
    return result[0] || null;
}

export async function createClothingType(data: NewClothingType) {
    const result = await db.insert(clothingTypes).values(data).returning();
    return result[0];
}

export async function updateClothingType(
    id: string,
    data: Partial<ClothingType>
) {
    const result = await db
        .update(clothingTypes)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(clothingTypes.id, id))
        .returning();
    return result[0];
}

export async function deleteClothingType(id: string) {
    await db.delete(clothingTypes).where(eq(clothingTypes.id, id));
}

// ==================== FABRICS ====================

export async function getFabrics(activeOnly = true) {
    const query = activeOnly
        ? db
            .select()
            .from(fabrics)
            .where(eq(fabrics.isActive, true))
            .orderBy(asc(fabrics.displayOrder))
        : db.select().from(fabrics).orderBy(asc(fabrics.displayOrder));

    return await query;
}

export async function getFabricById(id: string) {
    const result = await db
        .select()
        .from(fabrics)
        .where(eq(fabrics.id, id))
        .limit(1);
    return result[0] || null;
}

export async function getFabricBySlug(slug: string) {
    const result = await db
        .select()
        .from(fabrics)
        .where(eq(fabrics.slug, slug))
        .limit(1);
    return result[0] || null;
}

export async function createFabric(data: NewFabric) {
    const result = await db.insert(fabrics).values(data).returning();
    return result[0];
}

export async function updateFabric(id: string, data: Partial<Fabric>) {
    const result = await db
        .update(fabrics)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(fabrics.id, id))
        .returning();
    return result[0];
}

export async function deleteFabric(id: string) {
    await db.delete(fabrics).where(eq(fabrics.id, id));
}

// ==================== CATALOGUE ITEMS ====================

export async function getCatalogueItems(activeOnly = true, isCustomizable?: boolean) {
    const result = await db.query.catalogueItems.findMany({
        where: (item, { and, eq }) => {
            const conditions = [];
            if (activeOnly) conditions.push(eq(item.isActive, true));
            if (isCustomizable !== undefined) conditions.push(eq(item.isCustomizable, isCustomizable));
            return and(...conditions);
        },
        orderBy: [asc(catalogueItems.displayOrder)],
        with: {
            clothingType: true,
            images: {
                orderBy: [desc(catalogueImages.isPrimary), asc(catalogueImages.displayOrder)],
            },
            colors: {
                orderBy: [asc(catalogueItemColors.displayOrder)],
            },
        },
    });
    return result;
}

export async function getCatalogueItemsByType(
    clothingTypeId: string,
    activeOnly = true,
    isCustomizable?: boolean
) {
    const result = await db.query.catalogueItems.findMany({
        where: (item, { and, eq }) => {
            const conditions = [eq(item.clothingTypeId, clothingTypeId)];
            if (activeOnly) conditions.push(eq(item.isActive, true));
            if (isCustomizable !== undefined) conditions.push(eq(item.isCustomizable, isCustomizable));
            return and(...conditions);
        },
        orderBy: [asc(catalogueItems.displayOrder)],
        with: {
            clothingType: true,
            images: {
                orderBy: [desc(catalogueImages.isPrimary), asc(catalogueImages.displayOrder)],
            },
            colors: {
                orderBy: [asc(catalogueItemColors.displayOrder)],
            },
        },
    });
    return result;
}

export async function getCatalogueItemById(id: string) {
    const result = await db.query.catalogueItems.findFirst({
        where: eq(catalogueItems.id, id),
        with: {
            clothingType: true,
            images: {
                orderBy: [desc(catalogueImages.isPrimary), asc(catalogueImages.displayOrder)],
            },
            colors: {
                orderBy: [asc(catalogueItemColors.displayOrder)],
            },
        },
    });
    return result || null;
}

export async function getCatalogueItemBySlug(slug: string) {
    const result = await db.query.catalogueItems.findFirst({
        where: eq(catalogueItems.slug, slug),
        with: {
            clothingType: true,
            images: {
                orderBy: [desc(catalogueImages.isPrimary), asc(catalogueImages.displayOrder)],
            },
            colors: {
                orderBy: [asc(catalogueItemColors.displayOrder)],
            },
        },
    });
    return result || null;
}

export async function getFeaturedCatalogueItems() {
    const result = await db.query.catalogueItems.findMany({
        where: (item, { and }) =>
            and(eq(item.isFeatured, true), eq(item.isActive, true)),
        orderBy: [asc(catalogueItems.displayOrder)],
        with: {
            clothingType: true,
            images: {
                orderBy: [desc(catalogueImages.isPrimary), asc(catalogueImages.displayOrder)],
            },
            colors: {
                orderBy: [asc(catalogueItemColors.displayOrder)],
            },
        },
    });
    return result;
}

export async function createCatalogueItem(data: NewCatalogueItem) {
    const result = await db.insert(catalogueItems).values(data).returning();
    return result[0];
}

export async function updateCatalogueItem(
    id: string,
    data: Partial<CatalogueItem>
) {
    const result = await db
        .update(catalogueItems)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(catalogueItems.id, id))
        .returning();
    return result[0];
}

export async function deleteCatalogueItem(id: string) {
    await db.delete(catalogueItems).where(eq(catalogueItems.id, id));
}

// ==================== CATALOGUE IMAGES ====================

export async function getCatalogueImages(catalogueItemId: string) {
    return await db
        .select()
        .from(catalogueImages)
        .where(eq(catalogueImages.catalogueItemId, catalogueItemId))
        .orderBy(desc(catalogueImages.isPrimary), asc(catalogueImages.displayOrder));
}

export async function createCatalogueImage(data: NewCatalogueImage) {
    const result = await db.insert(catalogueImages).values(data).returning();
    return result[0];
}

export async function updateCatalogueImage(
    id: string,
    data: Partial<CatalogueImage>
) {
    const result = await db
        .update(catalogueImages)
        .set(data)
        .where(eq(catalogueImages.id, id))
        .returning();
    return result[0];
}

export async function deleteCatalogueImage(id: string) {
    await db.delete(catalogueImages).where(eq(catalogueImages.id, id));
}

export async function setPrimaryCatalogueImage(
    catalogueItemId: string,
    imageId: string
) {
    // First, unset all primary flags for this item
    await db
        .update(catalogueImages)
        .set({ isPrimary: false })
        .where(eq(catalogueImages.catalogueItemId, catalogueItemId));

    // Then set the new primary image
    await db
        .update(catalogueImages)
        .set({ isPrimary: true })
        .where(eq(catalogueImages.id, imageId));
}

export async function updateCatalogueItemImages(
    itemId: string,
    imageUrls: string[]
) {
    // Delete existing images
    await db
        .delete(catalogueImages)
        .where(eq(catalogueImages.catalogueItemId, itemId));

    // Insert new images
    if (imageUrls.length > 0) {
        const newImages = imageUrls.map((url, index) => ({
            catalogueItemId: itemId,
            imageUrl: url,
            displayOrder: index,
            isPrimary: index === 0,
        }));
        await db.insert(catalogueImages).values(newImages);
    }
}

export async function updateCatalogueItemColors(
    itemId: string,
    colors: Omit<NewCatalogueItemColor, "catalogueItemId">[]
) {
    // Delete existing colors
    await db
        .delete(catalogueItemColors)
        .where(eq(catalogueItemColors.catalogueItemId, itemId));

    // Insert new colors
    if (colors.length > 0) {
        const newColors = colors.map((color, index) => ({
            ...color,
            catalogueItemId: itemId,
            displayOrder: index,
        }));
        await db.insert(catalogueItemColors).values(newColors);
    }
}
