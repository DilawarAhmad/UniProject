import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  LogOut,
  User,
  LayoutDashboard,
  Upload,
  Menu,
  X,
} from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <header className="bg-slate-800 shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      
      {/* Logo */}
      <h1
        onClick={() => navigate("/home")}
        className="text-2xl md:text-3xl font-bold text-indigo-400 cursor-pointer"
      >
        CareerGuide <span className="text-indigo-300">AI</span>
      </h1>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition"
        >
          <LayoutDashboard size={18} /> Dashboard
        </button>

        <button
          onClick={() => navigate("/upload")}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition"
        >
          <Upload size={18} /> Upload Resume
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition"
        >
          <User size={18} /> Profile
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-200"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-slate-800 border-t border-slate-700 flex flex-col items-center gap-4 py-4 md:hidden">
          
          <button
            onClick={() => {
              navigate("/dashboard");
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg w-10/12 justify-center"
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>

          <button
            onClick={() => {
              navigate("/upload");
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg w-10/12 justify-center"
          >
            <Upload size={18} /> Upload Resume
          </button>

          <button
            onClick={() => {
              navigate("/profile");
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg w-10/12 justify-center"
          >
            <User size={18} /> Profile
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg w-10/12 justify-center"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;