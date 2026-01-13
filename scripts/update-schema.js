const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL);

async function main() {
    try {
        console.log('Creating design_templates table...');
        await sql`
            CREATE TABLE IF NOT EXISTS "design_templates" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "name" varchar(255) NOT NULL,
                "color_name" varchar(100) NOT NULL,
                "color_hex" varchar(50) NOT NULL,
                "front_image_url" text NOT NULL,
                "back_image_url" text NOT NULL,
                "side_image_url" text NOT NULL,
                "is_active" boolean DEFAULT true,
                "created_at" timestamp DEFAULT now(),
                "updated_at" timestamp DEFAULT now()
            )
        `;
        console.log('design_templates table created.');

        console.log('Adding original_logo_url to design_enquiries...');
        await sql`
            ALTER TABLE "design_enquiries" 
            ADD COLUMN IF NOT EXISTS "original_logo_url" text
        `;
        console.log('design_enquiries updated.');

    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        await sql.end();
    }
}

main();
