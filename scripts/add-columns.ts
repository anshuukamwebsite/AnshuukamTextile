import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function addManufacturingColumns() {
    console.log("Adding manufacturing columns to clothing_types table...");

    try {
        // Add columns using raw SQL
        const { error } = await supabase.rpc("exec_sql", {
            sql: `
        ALTER TABLE clothing_types 
        ADD COLUMN IF NOT EXISTS min_order_quantity integer DEFAULT 500,
        ADD COLUMN IF NOT EXISTS lead_time varchar(100) DEFAULT '3-5 Weeks',
        ADD COLUMN IF NOT EXISTS size_range varchar(100) DEFAULT 'XS-5XL';
      `,
        });

        if (error) {
            // Try alternative approach - direct column additions
            console.log("Using alternative approach...");

            // This will work through the Supabase SQL editor
            console.log("\n⚠️  Please run this SQL in your Supabase SQL Editor:\n");
            console.log("================================");
            console.log(`
ALTER TABLE clothing_types 
ADD COLUMN IF NOT EXISTS min_order_quantity integer DEFAULT 500;

ALTER TABLE clothing_types 
ADD COLUMN IF NOT EXISTS lead_time varchar(100) DEFAULT '3-5 Weeks';

ALTER TABLE clothing_types 
ADD COLUMN IF NOT EXISTS size_range varchar(100) DEFAULT 'XS-5XL';
      `);
            console.log("================================");
            console.log("\nAfter running the SQL, the admin panel will work with MOQ, lead time, and size range.");
            return;
        }

        console.log("✅ Columns added successfully!");
    } catch (err) {
        console.error("Error:", err);
        console.log("\n⚠️  Please run this SQL in your Supabase SQL Editor:\n");
        console.log("================================");
        console.log(`
ALTER TABLE clothing_types 
ADD COLUMN IF NOT EXISTS min_order_quantity integer DEFAULT 500;

ALTER TABLE clothing_types 
ADD COLUMN IF NOT EXISTS lead_time varchar(100) DEFAULT '3-5 Weeks';

ALTER TABLE clothing_types 
ADD COLUMN IF NOT EXISTS size_range varchar(100) DEFAULT 'XS-5XL';
    `);
        console.log("================================");
    }
}

addManufacturingColumns();
