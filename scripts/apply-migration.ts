
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/lib/db/schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function main() {
    console.log("Applying migration...");
    try {
        await client`ALTER TABLE "clothing_types" ADD COLUMN IF NOT EXISTS "images" text[]`;
        await client`ALTER TABLE "fabrics" ADD COLUMN IF NOT EXISTS "images" text[]`;
        console.log("Migration applied successfully!");
    } catch (e) {
        console.error("Migration failed:", e);
    } finally {
        await client.end();
    }
}

main();
