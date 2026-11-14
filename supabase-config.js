import { createClient } from
  'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://pfninunqbkbvzjsqhdxg.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_1ZlsgqFmY4qrNOuVPaqCwQ_WChSPkkr';
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);