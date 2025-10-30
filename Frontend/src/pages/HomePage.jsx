import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // Dummy feature data (to be replaced with real data later)
  const features = [
    {
      title: "Smart Career Roadmaps",
      desc: "Get personalized learning paths based on your resume and skill gaps.",
      icon: "🎯",
      route: "/roadmap"
    },
    {
      title: "AI Chatbot Assistant",
      desc: "Ask career questions and receive guidance from an AI-powered mentor.",
      icon: "🤖",
      route: "/chatbot"
    },
    {
      title: "Job & Internship Insights",
      desc: "Discover trending roles and skills with real-time analytics.",
      icon: "📊",
      route: "/analytics"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero Section */}
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

      {/* Features Section */}
      <section className="py-16 bg-slate-800">
        <h2 className="text-center text-3xl font-semibold mb-12">
          What You’ll Get
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {features.map((f, idx) => (
            <div
              key={idx}
              onClick={()=>navigate(f.route)}
              className="bg-slate-700 p-8 rounded-2xl text-center shadow-md hover:shadow-lg hover:bg-slate-600 transition-all"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section (Dummy Data) */}
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

      {/* Footer */}
      <footer className="bg-slate-800 py-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} CareerGuide AI
      </footer>
    </div>
  );
};

export default Home;
