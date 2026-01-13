import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// For server-side database operations only
const connectionString = process.env.DATABASE_URL!;

// Disable prefetch for production - important for Supabase connection pooling
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });

export * from "./schema";
