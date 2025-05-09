import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function insertFormData(table: string, data: Record<string, any>): Promise<Record<string, any>[]> {
  const { data: result, error } = await supabase.from(table).insert(data).select();
  if (error || !result) {
    console.error('Error inserting data into Supabase:', error);
    throw new Error('Failed to insert data into Supabase');
  }
  return result;
}