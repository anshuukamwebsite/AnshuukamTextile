import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("DATABASE_URL is not defined");
    process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

async function createReviewsTable() {
    try {
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS "reviews" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                "name" varchar(255) NOT NULL,
                "company" varchar(255),
                "email" varchar(255),
                "rating" integer NOT NULL,
                "message" text NOT NULL,
                "status" varchar(50) DEFAULT 'pending',
                "is_visible" boolean DEFAULT true,
                "created_at" timestamp DEFAULT now(),
                "updated_at" timestamp DEFAULT now()
            );
        `);
        console.log("✅ Reviews table created successfully!");
    } catch (error) {
        console.error("Error creating reviews table:", error);
    } finally {
        await client.end();
    }
    process.exit(0);
}

createReviewsTable();
