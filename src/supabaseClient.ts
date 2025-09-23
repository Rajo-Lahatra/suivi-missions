import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

console.log('🔍 https://uunaksbxptgektiavthj.supabase.co', url)
console.log('🔒 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bmFrc2J4cHRnZWt0aWF2dGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTg5MzYsImV4cCI6MjA3Mzg3NDkzNn0.yEdITfuXk8vjBlYsinpVEU0WTktNhC9n26ZPqR70lIk', key.slice(0, 8) + '…')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
