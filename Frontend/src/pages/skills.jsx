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
      <div className="max-w-6xl mx-auto mb-8">

        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Sparkles className="text-indigo-400" />
          Skill Intelligence
        </h1>

        <p className="text-center text-gray-400 mt-3 text-lg">
          AI-powered analysis of your resume skills
        </p>

      </div>

      {/* TOP CARDS */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-8">

        {/* SCORE */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">

          <p className="text-gray-400 text-sm">
            Overall Score
          </p>

          <div className="w-32 h-32 mx-auto mt-2">
            <ResponsiveContainer>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={12}
                data={skillChartData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  background
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-center text-3xl font-bold text-indigo-400">
            {score}/100
          </p>

        </div>

        {/* SKILL COUNT */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col justify-center">

          <p className="text-gray-400 text-sm">
            Skills Detected
          </p>

          <h2 className="text-5xl font-bold text-purple-400 mt-3">
            {skills.length}
          </h2>

          <p className="text-gray-500 mt-2">
            Technologies identified from your resume
          </p>

        </div>

        {/* INSIGHT */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">

          <p className="text-gray-400 text-sm mb-3">
            Profile Insight
          </p>

          <p className="text-gray-300 leading-relaxed">
            Your resume demonstrates a strong technical foundation across
            software development, databases, and modern web technologies.
          </p>

        </div>

      </div>

      {/* SKILLS */}
      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">

        <h2 className="text-2xl font-semibold text-center text-indigo-300 mb-8">
          Detected Skills
        </h2>

        {skills.length === 0 ? (
          <p className="text-center text-gray-400">
            No skills found yet.
          </p>
        ) : (

          <div className="flex flex-wrap justify-center gap-3">

            {skills.map((skill, index) => (

              <div
                key={index}
                className="
                  px-5
                  py-3
                  rounded-full
                  bg-indigo-500/10
                  border
                  border-indigo-500/20
                  text-indigo-200
                  font-medium
                  hover:bg-indigo-500/20
                  hover:border-indigo-400
                  hover:scale-105
                  transition-all
                  duration-200
                  cursor-default
                "
              >
                {skill.name}
              </div>

            ))}

          </div>

        )}

      </div>
      

      {/* BUTTON */}
      <div className="max-w-6xl mx-auto mt-8 flex justify-center">

        <button
          onClick={() =>
            navigate("/analytics")
          }
          className="
            px-8
            py-3
            bg-gradient-to-r
            from-indigo-600
            to-purple-600
            hover:scale-105
            transition
            rounded-xl
            font-semibold
            shadow-lg
          "
        >
          View Job Analytics
        </button>

      </div>

    </div>
  );
};

export default Skills;