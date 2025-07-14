import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kuciemubptchqqtfmjei.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y2llbXVicHRjaHFxdGZtamVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMjU0MjgsImV4cCI6MjA2MjkwMTQyOH0.5-oHZVi2SmRjlDgkWO0uRzsBso_z1ZUsJ-5QSCI_sOg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);