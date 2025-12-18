import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useSupabaseUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  return user;
}
