const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL);

async function main() {
    try {
        console.log('Seeding design template...');
        await sql`
            INSERT INTO "design_templates" (
                "name", "color_name", "color_hex", 
                "front_image_url", "back_image_url", "side_image_url"
            ) VALUES (
                'Classic T-Shirt', 'Black', '#1a1a1a',
                'https://placehold.co/600x800/1a1a1a/ffffff?text=Front+View',
                'https://placehold.co/600x800/1a1a1a/ffffff?text=Back+View',
                'https://placehold.co/600x800/1a1a1a/ffffff?text=Side+View'
            )
        `;

        await sql`
            INSERT INTO "design_templates" (
                "name", "color_name", "color_hex", 
                "front_image_url", "back_image_url", "side_image_url"
            ) VALUES (
                'Classic T-Shirt', 'White', '#ffffff',
                'https://placehold.co/600x800/ffffff/000000?text=Front+View',
                'https://placehold.co/600x800/ffffff/000000?text=Back+View',
                'https://placehold.co/600x800/ffffff/000000?text=Side+View'
            )
        `;

        console.log('Templates seeded.');

    } catch (error) {
        console.error('Error seeding:', error);
    } finally {
        await sql.end();
    }
}

main();
