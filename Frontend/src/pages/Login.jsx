import React, { useState } from "react";
import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  const { email, password } = formData;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setError(error.message);
    setLoading(false);
    return;
  }

  // ✅ Store user ID safely
  const userId = data?.user?.id;
  if (userId) {
    localStorage.setItem("userId", userId);
    console.log("✅ Logged in as:", userId);
  } else {
    console.error("⚠️ No user ID returned from Supabase.");
  }

  // ✅ Navigate only once, after saving user
  navigate("/home");
  setLoading(false);
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white px-6">
      <div className="bg-slate-800 p-10 rounded-2xl w-full max-w-md shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <LogIn size={40} className="text-indigo-400 mb-2" />
          <h1 className="text-3xl font-semibold">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Log in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2 text-gray-300">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
              className="w-full p-3 bg-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">Password</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              required
              className="w-full p-3 bg-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-semibold transition-all"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          Don’t have an account?{" "}
          <Link to="/" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
