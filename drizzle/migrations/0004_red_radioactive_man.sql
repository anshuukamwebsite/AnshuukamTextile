CREATE TABLE "catalogue_item_colors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"catalogue_item_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"hex" varchar(50) NOT NULL,
	"front_image_url" text NOT NULL,
	"back_image_url" text NOT NULL,
	"side_image_url" text NOT NULL,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "catalogue_items" ADD COLUMN "is_customizable" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "design_enquiries" ADD COLUMN "original_logo_url" text;--> statement-breakpoint
ALTER TABLE "catalogue_item_colors" ADD CONSTRAINT "catalogue_item_colors_catalogue_item_id_catalogue_items_id_fk" FOREIGN KEY ("catalogue_item_id") REFERENCES "public"."catalogue_items"("id") ON DELETE cascade ON UPDATE no action;