CREATE TABLE "design_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"color_name" varchar(100) NOT NULL,
	"color_hex" varchar(50) NOT NULL,
	"front_image_url" text NOT NULL,
	"back_image_url" text NOT NULL,
	"side_image_url" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "design_enquiries" ADD COLUMN "back_design_image_url" text;