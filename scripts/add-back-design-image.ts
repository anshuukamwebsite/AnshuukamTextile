// Run this with: npx tsx scripts/add-back-design-image.ts
import { config } from 'dotenv';

config({ path: '.env.local' });

async function runMigration() {
    console.log('Adding design image columns to design_enquiries...\n');

    const postgres = await import('postgres');
    const sql = postgres.default(process.env.DATABASE_URL!, { prepare: false });

    try {
        await sql`
            ALTER TABLE design_enquiries 
            ADD COLUMN IF NOT EXISTS back_design_image_url text,
            ADD COLUMN IF NOT EXISTS side_design_image_url text
        `;
        console.log('✅ Columns added successfully!');
        await sql.end();
    } catch (err: any) {
        if (err.code === '42701') { // Column already exists
            console.log('✅ Columns already exist!');
        } else {
            console.error('Error:', err);
        }
        await sql.end();
    }

    process.exit(0);
}

runMigration().catch(console.error);
