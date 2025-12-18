import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        navigate("/login");
      }
      setChecking(false);
    };
    verify();
  }, [navigate]);

  if (checking) return <div className="text-center mt-20 text-white">Loading...</div>;

  return children;
};

export default ProtectedRoute;
