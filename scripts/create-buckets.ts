// Create storage bucket for factory photos
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createBucket() {
    console.log('Creating storage buckets...\n');

    // Create photo bucket
    const { data, error } = await supabase.storage.createBucket('all_photos', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    });

    if (error) {
        if (error.message.includes('already exists')) {
            console.log('✅ Bucket "all_photos" already exists');
        } else {
            console.error('Error creating bucket:', error.message);
        }
    } else {
        console.log('✅ Bucket "all_photos" created successfully!');
    }

    // Create catalogue-images bucket
    const { error: error2 } = await supabase.storage.createBucket('catalogue-images', {
        public: true,
        fileSizeLimit: 5242880,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    });

    if (error2) {
        if (error2.message.includes('already exists')) {
            console.log('✅ Bucket "catalogue-images" already exists');
        } else {
            console.error('Error creating bucket:', error2.message);
        }
    } else {
        console.log('✅ Bucket "catalogue-images" created successfully!');
    }

    console.log('\n✅ Storage setup complete!');
    process.exit(0);
}

createBucket().catch(console.error);
