// src/utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_KEY = process.env.SUPABASE_KEY as string;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase URL and KEY must be set in environment variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
    global: { fetch: (...args) => fetch(...args) },
});
