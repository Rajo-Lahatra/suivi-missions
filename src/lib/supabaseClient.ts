// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error(
    'Missing env vars VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY'
  );
}

console.log('🔍 Supabase URL:', url);
console.log('🔒 Key prefix:', key.slice(0, 8) + '…');

export const supabase = createClient(url, key);
