import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  User,
  LogOut,
  LayoutDashboard,
  Upload,
  Menu,
  X,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // Feature cards (your same data)
  const features = [
    {
      title: "Smart Career Roadmaps",
      desc: "Get personalized learning paths based on your resume and skill gaps.",
      icon: "🎯",
      route: "/roadmap",
    },
    {
      title: "AI Chatbot Assistant",
      desc: "Ask career questions and receive guidance from an AI-powered mentor.",
      icon: "🤖",
      route: "/chatbot",
    },
    {
      title: "Job & Internship Insights",
      desc: "Discover trending roles and skills with real-time analytics.",
      icon: "📊",
      route: "/analytics",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* ======================= HEADER ======================= */}
      <header className="bg-slate-800 shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
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

        {/* Mobile Dropdown Menu */}
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

      {/* ======================= HERO SECTION ======================= */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          AI-Powered Career Guidance Platform
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8">
          Bridge the gap between your skills and dream career with personalized
          AI insights, learning roadmaps, and real-time job analytics.
        </p>
        <button
          onClick={() => navigate("/upload")}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all"
        >
          Get Started
        </button>
      </section>

      {/* ======================= FEATURES ======================= */}
      <section className="py-16 bg-slate-800">
        <h2 className="text-center text-3xl font-semibold mb-12">
          What You’ll Get
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {features.map((f, idx) => (
            <div
              key={idx}
              onClick={() => navigate(f.route)}
              className="bg-slate-700 p-8 rounded-2xl text-center shadow-md hover:shadow-xl hover:bg-slate-600 transition-all cursor-pointer transform hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-300">
                {f.title}
              </h3>
              <p className="text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================= STATS SECTION ======================= */}
      <section className="py-16 bg-slate-900 border-t border-slate-700">
        <h2 className="text-center text-3xl font-semibold mb-10">
          Platform in Numbers
        </h2>
        <div className="flex flex-wrap justify-center gap-10 text-center">
          <div>
            <h3 className="text-4xl font-bold text-indigo-400">10K+</h3>
            <p className="text-gray-400">Resumes Analyzed</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-indigo-400">5K+</h3>
            <p className="text-gray-400">Learning Roadmaps Generated</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-indigo-400">1K+</h3>
            <p className="text-gray-400">Job Trends Tracked Weekly</p>
          </div>
        </div>
      </section>

      {/* ======================= FOOTER ======================= */}
      <footer className="bg-slate-800 py-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} CareerGuide AI — All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
