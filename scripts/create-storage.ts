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

// Create admin client with service role key
const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function createStorageBucket() {
    console.log("Creating 'images' storage bucket...");

    try {
        // Check if bucket already exists
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();

        if (listError) {
            console.error("Failed to list buckets:", listError.message);
            return;
        }

        const bucketExists = buckets.some(b => b.name === "images");

        if (bucketExists) {
            console.log("⚠️  Bucket 'images' already exists.");
        } else {
            // Create the bucket
            const { data, error } = await supabase.storage.createBucket("images", {
                public: true,
                fileSizeLimit: 5 * 1024 * 1024, // 5MB
                allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
            });

            if (error) {
                console.error("Failed to create bucket:", error.message);
                return;
            }

            console.log("✅ Storage bucket 'images' created successfully!");
        }

        console.log("\n--- Bucket Configuration ---");
        console.log("Name: images");
        console.log("Public: true");
        console.log("Max file size: 5MB");
        console.log("Allowed types: JPEG, PNG, WebP, GIF");
        console.log("----------------------------");
        console.log("\nYou can now upload images from the admin panel.");
    } catch (err) {
        console.error("Failed to create storage bucket:", err);
    }
}

createStorageBucket();
