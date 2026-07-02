import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://obqmlpwuvkdedovfoeqt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_jEQmqfBq6WkY2irZnp1EqA_mSSMA0pO';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
