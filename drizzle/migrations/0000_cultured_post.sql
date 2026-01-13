CREATE TABLE "catalogue_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"catalogue_item_id" uuid NOT NULL,
	"image_url" text NOT NULL,
	"alt_text" varchar(255),
	"display_order" integer DEFAULT 0,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "catalogue_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clothing_type_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"min_order_quantity" integer DEFAULT 100 NOT NULL,
	"production_capacity" varchar(255),
	"lead_time" varchar(100),
	"size_range" varchar(255),
	"available_fabrics" uuid[],
	"features" jsonb,
	"specifications" jsonb,
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "catalogue_items_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "clothing_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"image_url" text,
	"min_order_quantity" integer DEFAULT 500,
	"lead_time" varchar(100) DEFAULT '3-5 Weeks',
	"size_range" varchar(100) DEFAULT 'XS-5XL',
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "clothing_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone_number" varchar(50) NOT NULL,
	"email" varchar(255),
	"company_name" varchar(255),
	"contact_person" varchar(255),
	"clothing_type_id" uuid,
	"clothing_type_name" varchar(255),
	"fabric_id" uuid,
	"fabric_name" varchar(255),
	"quantity" integer NOT NULL,
	"size_range" varchar(255),
	"notes" text,
	"status" varchar(50) DEFAULT 'pending',
	"admin_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fabrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"composition" varchar(500),
	"weight" varchar(100),
	"properties" jsonb,
	"image_url" text,
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "fabrics_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_key" varchar(100) NOT NULL,
	"title" varchar(255),
	"content" jsonb,
	"is_visible" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "site_sections_section_key_unique" UNIQUE("section_key")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" jsonb,
	"description" varchar(500),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "site_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "catalogue_images" ADD CONSTRAINT "catalogue_images_catalogue_item_id_catalogue_items_id_fk" FOREIGN KEY ("catalogue_item_id") REFERENCES "public"."catalogue_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalogue_items" ADD CONSTRAINT "catalogue_items_clothing_type_id_clothing_types_id_fk" FOREIGN KEY ("clothing_type_id") REFERENCES "public"."clothing_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_clothing_type_id_clothing_types_id_fk" FOREIGN KEY ("clothing_type_id") REFERENCES "public"."clothing_types"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_fabric_id_fabrics_id_fk" FOREIGN KEY ("fabric_id") REFERENCES "public"."fabrics"("id") ON DELETE set null ON UPDATE no action;