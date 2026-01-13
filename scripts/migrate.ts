import dotenv from "dotenv";
// Load environment variables FIRST
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
    console.error("DATABASE_URL not found in .env.local");
    process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

async function migrate() {
    console.log("Running database migration...");

    try {
        // Add new columns to clothing_types table
        await db.execute(sql`
      ALTER TABLE clothing_types 
      ADD COLUMN IF NOT EXISTS min_order_quantity integer DEFAULT 500
    `);
        console.log("✓ Added min_order_quantity column");

        await db.execute(sql`
      ALTER TABLE clothing_types 
      ADD COLUMN IF NOT EXISTS lead_time varchar(100) DEFAULT '3-5 Weeks'
    `);
        console.log("✓ Added lead_time column");

        await db.execute(sql`
      ALTER TABLE clothing_types 
      ADD COLUMN IF NOT EXISTS size_range varchar(100) DEFAULT 'XS-5XL'
    `);
        console.log("✓ Added size_range column");

        console.log("\n✅ Migration completed successfully!");

        // Close the connection
        await client.end();
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        await client.end();
        process.exit(1);
    }
}

migrate();
