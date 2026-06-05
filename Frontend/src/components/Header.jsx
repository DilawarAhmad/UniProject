import React, { useState, useEffect ,useRef} from "react";
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
  const dropdownRef = useRef(null)

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setUser(data.user);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };

}, []);

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

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button
          onClick={() => navigate("/upload")}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition"
        >
          <Upload size={18} />
          Upload Resume
        </button>

        {/* Profile Dropdown */}
        <div ref={dropdownRef} className="relative">

          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition"
          >
            <User size={20} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">

              {/* User Info */}
              <div className="p-4 border-b border-slate-700">

                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                    <User size={24} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {user?.user_metadata?.full_name || "User"}
                    </h3>

                    <p className="text-sm text-gray-400 break-all">
                      {user?.email}
                    </p>
                  </div>

                </div>

              </div>


              <button
                onClick={() => {
                  navigate("/dashboard");
                  setProfileOpen(false);
                }}
                className="w-full text-white text-left px-4 py-3 hover:bg-slate-700"
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  navigate("/upload");
                  setProfileOpen(false);
                }}
                className="w-full text-white text-left px-4 py-3 hover:bg-slate-700"
              >
                Upload Resume
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-400 hover:bg-slate-700"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-200"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-slate-800 border-t border-slate-700 flex flex-col items-center gap-4 py-4 md:hidden">

          <button
            onClick={() => {
              navigate("/dashboard");
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg w-10/12 justify-center"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => {
              navigate("/upload");
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg w-10/12 justify-center"
          >
            <Upload size={18} />
            Upload Resume
          </button>

          <button
            onClick={() => {
              navigate("/profile");
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg w-10/12 justify-center"
          >
            <User size={18} />
            My Profile
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg w-10/12 justify-center"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      )}
    </header>
  );
};

export default Header;