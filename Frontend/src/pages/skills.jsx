import React, { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("User not logged in");
          return;
        }

        const res = await fetch(`http://127.0.0.1:8000/api/get-skills/${userId}/`);
        if (!res.ok) throw new Error("Failed to fetch skills");

        const data = await res.json();
        setSkills(data.skills || []);
        setScore(data.score || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const skillChartData = [
    { name: "Skill Score", value: score, fill: "#7C3AED" },
  ];

  if (loading)
    return (
      <p className="text-center text-gray-300 mt-10 text-lg">
        Loading dashboard...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-400 mt-10 text-lg">{error}</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-center flex items-center justify-center gap-2">
          <Sparkles className="text-indigo-400" />
          Skill Intelligence Dashboard
        </h1>

        <p className="text-center text-gray-400 mt-2">
          AI extracted skills from your resume
        </p>
      </div>


      {/* SCORE CARD */}
      <div className="max-w-3xl mx-auto mb-12 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-10 shadow-xl hover:shadow-indigo-500/10 transition">

        <h2 className="text-xl font-semibold text-indigo-300 text-center mb-6">
          Overall Skill Score
        </h2>

        <div className="w-full h-[280px]">
          <ResponsiveContainer>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={22}
              data={skillChartData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={12}
                background
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-center text-4xl font-bold mt-3 text-indigo-400">
          {score}/100
        </p>

      </div>


      {/* SKILLS SECTION */}
      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-10 shadow-xl">

        <h2 className="text-2xl font-semibold text-indigo-300 mb-8 text-center">
          Detected Skills
        </h2>

        {skills.length === 0 ? (
          <p className="text-center text-gray-400">
            No skills found yet. Upload your resume.
          </p>
        ) : (

          <div className="grid md:grid-cols-2 gap-6">

            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 hover:border-indigo-500 transition"
              >

                {/* Skill name */}
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-indigo-200">
                    {skill.name}
                  </span>

                  <span className="text-sm text-gray-400">
                    {skill.level}%
                  </span>
                </div>

                {/* Progress */}
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>

                {/* Confidence */}
                <p className="text-xs text-gray-400 mt-2">
                  Confidence: {(skill.confidence * 100).toFixed(0)}%
                </p>

              </div>
            ))}

          </div>
        )}

      </div>
      {/* ANALYTICS BUTTON */}
      <div className="max-w-6xl mx-auto mt-10 flex justify-center">
        <button
          onClick={() => navigate("/analytics")}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold shadow-lg transition"
        >
          View Job Analytics
        </button>
      </div>
    </div>
  );
};

export default Skills;