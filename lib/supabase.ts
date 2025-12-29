import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface RankingEntry {
  id?: number;
  nickname: string;
  visited_exhibitions: string[];
  visited_count: number;
  timestamp: string;
  created_at?: string;
}
