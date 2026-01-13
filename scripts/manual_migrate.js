require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

async function main() {
    try {
        console.log('Adding columns...');
        await sql`ALTER TABLE "design_enquiries" ADD COLUMN IF NOT EXISTS "priority" varchar(20) DEFAULT 'medium'`;
        await sql`ALTER TABLE "design_enquiries" ADD COLUMN IF NOT EXISTS "deadline" timestamp`;
        await sql`ALTER TABLE "enquiries" ADD COLUMN IF NOT EXISTS "priority" varchar(20) DEFAULT 'medium'`;
        await sql`ALTER TABLE "enquiries" ADD COLUMN IF NOT EXISTS "deadline" timestamp`;
        console.log('Migration successful');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await sql.end();
    }
}

main();
