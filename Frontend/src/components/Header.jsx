import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { LogOut, User, LayoutDashboard } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <header className="bg-slate-800 text-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Logo */}
      <h1
        onClick={() => navigate("/home")}
        className="text-2xl font-bold text-indigo-400 cursor-pointer"
      >
        CareerGuide AI
      </h1>

      {/* Nav Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition"
        >
          <LayoutDashboard size={18} /> Dashboard
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition"
        >
          <User size={18} /> Profile
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
