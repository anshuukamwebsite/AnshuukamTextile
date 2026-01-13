// Run this with: npx tsx scripts/run-migration.ts
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    db: { schema: 'public' }
});

async function runMigration() {
    console.log('Creating factory_photos table...\n');

    const { error } = await supabase.rpc('exec_sql', {
        sql_query: `
      CREATE TABLE IF NOT EXISTS factory_photos (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        title varchar(255) NOT NULL,
        description text,
        image_url text NOT NULL,
        category varchar(100),
        display_order integer DEFAULT 0,
        is_active boolean DEFAULT true,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      );
    `
    });

    if (error) {
        // If exec_sql RPC doesn't exist, try direct query
        console.log('RPC not available, trying alternative method...');

        // Use postgres directly
        const postgres = await import('postgres');
        const sql = postgres.default(process.env.DATABASE_URL!, { prepare: false });

        try {
            await sql`
        CREATE TABLE IF NOT EXISTS factory_photos (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          title varchar(255) NOT NULL,
          description text,
          image_url text NOT NULL,
          category varchar(100),
          display_order integer DEFAULT 0,
          is_active boolean DEFAULT true,
          created_at timestamp DEFAULT now(),
          updated_at timestamp DEFAULT now()
        )
      `;
            console.log('✅ Table created successfully!');
            await sql.end();
        } catch (err: any) {
            if (err.code === '42P07') {
                console.log('✅ Table already exists!');
            } else {
                console.error('Error:', err);
            }
            await sql.end();
        }
    } else {
        console.log('✅ Table created successfully!');
    }

    process.exit(0);
}

runMigration().catch(console.error);
