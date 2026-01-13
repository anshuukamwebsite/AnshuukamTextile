CREATE TABLE "design_enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"design_image_url" text NOT NULL,
	"design_json" jsonb,
	"fabric_id" uuid,
	"fabric_name" varchar(255),
	"print_type" varchar(100) NOT NULL,
	"quantity" integer NOT NULL,
	"size_range" varchar(255),
	"phone_number" varchar(50) NOT NULL,
	"email" varchar(255),
	"company_name" varchar(255),
	"contact_person" varchar(255),
	"notes" text,
	"status" varchar(50) DEFAULT 'pending',
	"admin_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "design_enquiries" ADD CONSTRAINT "design_enquiries_fabric_id_fabrics_id_fk" FOREIGN KEY ("fabric_id") REFERENCES "public"."fabrics"("id") ON DELETE set null ON UPDATE no action;