ALTER TABLE "design_enquiries" ADD COLUMN "side_design_image_url" text;--> statement-breakpoint
ALTER TABLE "design_enquiries" ADD COLUMN "priority" varchar(20) DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE "design_enquiries" ADD COLUMN "deadline" timestamp;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "priority" varchar(20) DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "deadline" timestamp;