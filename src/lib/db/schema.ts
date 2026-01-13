import {
    pgTable,
    uuid,
    varchar,
    text,
    integer,
    boolean,
    timestamp,
    jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==================== CATALOGUE TABLES ====================

export const clothingTypes = pgTable("clothing_types", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    imageUrl: text("image_url"),
    images: text("images").array(),
    // Manufacturing specs
    minOrderQuantity: integer("min_order_quantity").default(500),
    leadTime: varchar("lead_time", { length: 100 }).default("3-5 Weeks"),
    sizeRange: varchar("size_range", { length: 100 }).default("XS-5XL"),
    displayOrder: integer("display_order").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const fabrics = pgTable("fabrics", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    composition: varchar("composition", { length: 500 }),
    weight: varchar("weight", { length: 100 }), // e.g., "180 GSM"
    properties: jsonb("properties"), // e.g., { "breathable": true, "stretchable": false }
    imageUrl: text("image_url"),
    images: text("images").array(),
    displayOrder: integer("display_order").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const catalogueItems = pgTable("catalogue_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    clothingTypeId: uuid("clothing_type_id")
        .notNull()
        .references(() => clothingTypes.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    minOrderQuantity: integer("min_order_quantity").notNull().default(100),
    productionCapacity: varchar("production_capacity", { length: 255 }), // e.g., "10,000 units/month"
    leadTime: varchar("lead_time", { length: 100 }), // e.g., "3-4 weeks"
    sizeRange: varchar("size_range", { length: 255 }), // e.g., "XS-5XL"
    availableFabrics: uuid("available_fabrics").array(), // Array of fabric IDs
    features: jsonb("features"), // Array of feature strings
    specifications: jsonb("specifications"), // Key-value specifications
    displayOrder: integer("display_order").default(0),
    isActive: boolean("is_active").default(true),
    isFeatured: boolean("is_featured").default(false),

    isCustomizable: boolean("is_customizable").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const catalogueItemColors = pgTable("catalogue_item_colors", {
    id: uuid("id").primaryKey().defaultRandom(),
    catalogueItemId: uuid("catalogue_item_id")
        .notNull()
        .references(() => catalogueItems.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    hex: varchar("hex", { length: 50 }).notNull(),
    frontImageUrl: text("front_image_url").notNull(),
    backImageUrl: text("back_image_url").notNull(),
    sideImageUrl: text("side_image_url").notNull(),
    displayOrder: integer("display_order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
});

export const catalogueImages = pgTable("catalogue_images", {
    id: uuid("id").primaryKey().defaultRandom(),
    catalogueItemId: uuid("catalogue_item_id")
        .notNull()
        .references(() => catalogueItems.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    altText: varchar("alt_text", { length: 255 }),
    displayOrder: integer("display_order").default(0),
    isPrimary: boolean("is_primary").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

// ==================== ENQUIRY TABLES ====================

export const enquiries = pgTable("enquiries", {
    id: uuid("id").primaryKey().defaultRandom(),
    // Contact Information
    phoneNumber: varchar("phone_number", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }),
    companyName: varchar("company_name", { length: 255 }),
    contactPerson: varchar("contact_person", { length: 255 }),
    // Order Details
    clothingTypeId: uuid("clothing_type_id").references(() => clothingTypes.id, {
        onDelete: "set null",
    }),
    clothingTypeName: varchar("clothing_type_name", { length: 255 }), // Stored for reference
    fabricId: uuid("fabric_id").references(() => fabrics.id, {
        onDelete: "set null",
    }),
    fabricName: varchar("fabric_name", { length: 255 }), // Stored for reference
    quantity: integer("quantity").notNull(),
    sizeRange: varchar("size_range", { length: 255 }),
    notes: text("notes"),
    // Status
    status: varchar("status", { length: 50 }).default("pending"), // pending, contacted, quoted, closed
    priority: varchar("priority", { length: 20 }).default("medium"), // low, medium, high
    deadline: timestamp("deadline"),
    adminNotes: text("admin_notes"),
    // Timestamps
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// ==================== DESIGN ENQUIRIES TABLE ====================



export const designEnquiries = pgTable("design_enquiries", {
    id: uuid("id").primaryKey().defaultRandom(),
    // Design Data
    designImageUrl: text("design_image_url").notNull(), // Front design image
    backDesignImageUrl: text("back_design_image_url"), // Back design image
    sideDesignImageUrl: text("side_design_image_url"), // Side design image
    originalLogoUrl: text("original_logo_url"), // High-res uploaded logo
    designJson: jsonb("design_json"), // Canvas state
    // Product Details
    fabricId: uuid("fabric_id").references(() => fabrics.id, {
        onDelete: "set null",
    }),
    fabricName: varchar("fabric_name", { length: 255 }),
    printType: varchar("print_type", { length: 100 }).notNull(),
    quantity: integer("quantity").notNull(),
    sizeRange: varchar("size_range", { length: 255 }),
    // Contact Information
    phoneNumber: varchar("phone_number", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }),
    companyName: varchar("company_name", { length: 255 }),
    contactPerson: varchar("contact_person", { length: 255 }),
    notes: text("notes"),
    // Status
    status: varchar("status", { length: 50 }).default("pending"),
    priority: varchar("priority", { length: 20 }).default("medium"), // low, medium, high
    deadline: timestamp("deadline"),
    adminNotes: text("admin_notes"),
    // Timestamps
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const designTemplates = pgTable("design_templates", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    colorName: varchar("color_name", { length: 100 }).notNull(),
    colorHex: varchar("color_hex", { length: 50 }).notNull(),
    frontImageUrl: text("front_image_url").notNull(),
    backImageUrl: text("back_image_url").notNull(),
    sideImageUrl: text("side_image_url").notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// ==================== SITE SETTINGS TABLES ====================

export const siteSettings = pgTable("site_settings", {
    id: uuid("id").primaryKey().defaultRandom(),
    key: varchar("key", { length: 100 }).notNull().unique(),
    value: jsonb("value"),
    description: varchar("description", { length: 500 }),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const siteSections = pgTable("site_sections", {
    id: uuid("id").primaryKey().defaultRandom(),
    sectionKey: varchar("section_key", { length: 100 }).notNull().unique(),
    title: varchar("title", { length: 255 }),
    content: jsonb("content"), // Flexible content storage
    isVisible: boolean("is_visible").default(true),
    displayOrder: integer("display_order").default(0),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// ==================== FACTORY PHOTOS TABLE ====================

export const factoryPhotos = pgTable("factory_photos", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    imageUrl: text("image_url").notNull(),
    category: varchar("category", { length: 100 }), // e.g., "production", "warehouse", "quality-control"
    displayOrder: integer("display_order").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// ==================== REVIEWS TABLE ====================

export const reviews = pgTable("reviews", {
    id: uuid("id").primaryKey().defaultRandom(),
    // Reviewer info
    name: varchar("name", { length: 255 }).notNull(),
    company: varchar("company", { length: 255 }),
    email: varchar("email", { length: 255 }),
    // Review content
    rating: integer("rating").notNull(), // 1-5 stars
    message: text("message").notNull(),
    // Status
    status: varchar("status", { length: 50 }).default("pending"), // pending, approved, rejected
    isVisible: boolean("is_visible").default(true), // Can hide approved reviews
    // Timestamps
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// ==================== RELATIONS ====================

export const clothingTypesRelations = relations(clothingTypes, ({ many }) => ({
    catalogueItems: many(catalogueItems),
    enquiries: many(enquiries),
}));

export const fabricsRelations = relations(fabrics, ({ many }) => ({
    enquiries: many(enquiries),
    designEnquiries: many(designEnquiries),
}));

export const catalogueItemsRelations = relations(
    catalogueItems,
    ({ one, many }) => ({
        clothingType: one(clothingTypes, {
            fields: [catalogueItems.clothingTypeId],
            references: [clothingTypes.id],
        }),
        images: many(catalogueImages),
        colors: many(catalogueItemColors),
    })
);

export const catalogueItemColorsRelations = relations(
    catalogueItemColors,
    ({ one }) => ({
        catalogueItem: one(catalogueItems, {
            fields: [catalogueItemColors.catalogueItemId],
            references: [catalogueItems.id],
        }),
    })
);

export const catalogueImagesRelations = relations(
    catalogueImages,
    ({ one }) => ({
        catalogueItem: one(catalogueItems, {
            fields: [catalogueImages.catalogueItemId],
            references: [catalogueItems.id],
        }),
    })
);

export const enquiriesRelations = relations(enquiries, ({ one }) => ({
    clothingType: one(clothingTypes, {
        fields: [enquiries.clothingTypeId],
        references: [clothingTypes.id],
    }),
    fabric: one(fabrics, {
        fields: [enquiries.fabricId],
        references: [fabrics.id],
    }),
}));

export const designEnquiriesRelations = relations(designEnquiries, ({ one }) => ({
    fabric: one(fabrics, {
        fields: [designEnquiries.fabricId],
        references: [fabrics.id],
    }),
}));

// ==================== TYPES ====================

export type ClothingType = typeof clothingTypes.$inferSelect;
export type NewClothingType = typeof clothingTypes.$inferInsert;

export type Fabric = typeof fabrics.$inferSelect;
export type NewFabric = typeof fabrics.$inferInsert;

export type CatalogueItem = typeof catalogueItems.$inferSelect;
export type NewCatalogueItem = typeof catalogueItems.$inferInsert;

export type CatalogueImage = typeof catalogueImages.$inferSelect;
export type NewCatalogueImage = typeof catalogueImages.$inferInsert;

export type Enquiry = typeof enquiries.$inferSelect;
export type NewEnquiry = typeof enquiries.$inferInsert;

export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;

export type SiteSection = typeof siteSections.$inferSelect;
export type NewSiteSection = typeof siteSections.$inferInsert;

export type FactoryPhoto = typeof factoryPhotos.$inferSelect;
export type NewFactoryPhoto = typeof factoryPhotos.$inferInsert;

export type DesignEnquiry = typeof designEnquiries.$inferSelect;
export type NewDesignEnquiry = typeof designEnquiries.$inferInsert;

export type CatalogueItemColor = typeof catalogueItemColors.$inferSelect;
export type NewCatalogueItemColor = typeof catalogueItemColors.$inferInsert;

export type DesignTemplate = typeof designTemplates.$inferSelect;
export type NewDesignTemplate = typeof designTemplates.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
