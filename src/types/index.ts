// Re-export database types
export type {
    ClothingType,
    NewClothingType,
    Fabric,
    NewFabric,
    CatalogueItem,
    NewCatalogueItem,
    CatalogueImage,
    NewCatalogueImage,
    Enquiry,
    NewEnquiry,
    SiteSetting,
    NewSiteSetting,
    SiteSection,
    NewSiteSection,
} from "@/lib/db/schema";

// API Response Types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Enquiry Form Types
export interface EnquiryFormData {
    clothingTypeId: string;
    fabricId: string;
    quantity: number;
    sizeRange: string;
    phoneNumber: string;
    email?: string;
    companyName?: string;
    contactPerson?: string;
    notes?: string;
}

// Catalogue with relations
export interface CatalogueItemWithRelations {
    id: string;
    clothingTypeId: string;
    name: string;
    slug: string;
    description: string | null;
    minOrderQuantity: number;
    productionCapacity: string | null;
    leadTime: string | null;
    sizeRange: string | null;
    availableFabrics: string[] | null;
    features: string[] | null;
    specifications: Record<string, string> | null;
    displayOrder: number | null;
    isActive: boolean | null;
    isFeatured: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    clothingType: {
        id: string;
        name: string;
        slug: string;
    };
    images: {
        id: string;
        imageUrl: string;
        altText: string | null;
        isPrimary: boolean | null;
    }[];
}

// Enquiry with relations
export interface EnquiryWithRelations {
    id: string;
    phoneNumber: string;
    email: string | null;
    companyName: string | null;
    contactPerson: string | null;
    clothingTypeId: string | null;
    clothingTypeName: string | null;
    fabricId: string | null;
    fabricName: string | null;
    quantity: number;
    sizeRange: string | null;
    notes: string | null;
    status: string | null;
    adminNotes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    clothingType: {
        id: string;
        name: string;
    } | null;
    fabric: {
        id: string;
        name: string;
    } | null;
}

// Section Content Types
export interface HeroContent {
    headline: string;
    subheadline: string;
    ctaText: string;
    backgroundImage?: string;
}

export interface AboutContent {
    headline: string;
    description: string;
    stats: { label: string; value: string }[];
}

export interface CapacityContent {
    headline: string;
    items: { label: string; value: string }[];
}

export interface ContactContent {
    headline: string;
    email: string;
    phone: string;
    address: string;
}

export interface SocialLinks {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
}

// Enquiry Stats
export interface EnquiryStats {
    total: number;
    pending: number;
    contacted: number;
    quoted: number;
    closed: number;
}
