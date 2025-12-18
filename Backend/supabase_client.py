from supabase import create_client
import os
# print("keys")
# SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
# print("supabaseurl",SUPABASE_URL)
# print("supbasekey",SUPABASE_SERVICE_KEY)
SUPABASE_URL="https://vwgwyssgmmthvrdqhnkl.supabase.co"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Z3d5c3NnbW10aHZyZHFobmtsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTcyNTIyOCwiZXhwIjoyMDc1MzAxMjI4fQ.CkDZzOhZbJKO6xOgnbuKJIPTMC2rldIzuVGDp46kET4"

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
print("supabase",supabase)