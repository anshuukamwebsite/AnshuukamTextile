
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/lib/db/schema";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function main() {
    console.log("Migrating images...");

    try {
        // Migrate Clothing Types
        const types = await db.select().from(schema.clothingTypes);
        let typesCount = 0;
        for (const type of types) {
            if (type.imageUrl && (!type.images || type.images.length === 0)) {
                await db.update(schema.clothingTypes)
                    .set({ images: [type.imageUrl] })
                    .where(eq(schema.clothingTypes.id, type.id));
                typesCount++;
            }
        }
        console.log(`Migrated ${typesCount} clothing types.`);

        // Migrate Fabrics
        const fabrics = await db.select().from(schema.fabrics);
        let fabricsCount = 0;
        for (const fabric of fabrics) {
            if (fabric.imageUrl && (!fabric.images || fabric.images.length === 0)) {
                await db.update(schema.fabrics)
                    .set({ images: [fabric.imageUrl] })
                    .where(eq(schema.fabrics.id, fabric.id));
                fabricsCount++;
            }
        }
        console.log(`Migrated ${fabricsCount} fabrics.`);

        console.log("Migration complete!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await client.end();
    }
}

main();
