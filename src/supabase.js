import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tghdpqdldwqvsuoibswh.supabase.co";
const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnaGRwcWRsZHdxdnN1b2lic3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNzU4NTQsImV4cCI6MjA3ODg1MTg1NH0.jMd8S7Tqky1lozOp8H4OgJ_-u9kinp7KsctElkMVlBs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
