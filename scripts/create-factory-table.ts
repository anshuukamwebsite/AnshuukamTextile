import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "../src/lib/db";
import { sql } from "drizzle-orm";

async function createFactoryPhotosTable() {
    console.log("Creating factory_photos table...\n");

    try {
        await db.execute(sql`
      CREATE TABLE IF NOT EXISTS factory_photos (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        title varchar(255) NOT NULL,
        description text,
        image_url text NOT NULL,
        category varchar(100),
        display_order integer DEFAULT 0,
        is_active boolean DEFAULT true,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      );
    `);
        console.log("✅ Table created successfully!");
    } catch (error) {
        console.error("Error creating table:", error);
    }

    process.exit(0);
}

createFactoryPhotosTable();
