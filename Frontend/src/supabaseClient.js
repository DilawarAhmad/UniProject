import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vwgwyssgmmthvrdqhnkl.supabase.co"; // replace this
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Z3d5c3NnbW10aHZyZHFobmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MjUyMjgsImV4cCI6MjA3NTMwMTIyOH0.VAeGGU0eeRQwouk2iOPqim9Tue9cGQk3tusRDmniddA"; // replace this

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
