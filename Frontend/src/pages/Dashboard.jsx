import { MoveRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer, Legend } from "recharts";

const Dashboard = () => {
  const [skills, setSkills] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    { name: "Skill Score", value: score, fill: "#6366F1"},
  ];

  if (loading) return <p className="text-center text-gray-300 mt-10">Loading dashboard...</p>;
  if (error) return <p className="text-center text-red-400 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Dashboard</h1>

      {/* --- Skill Score Radial Chart --- */}
      <div className="bg-slate-800 p-6 rounded-2xl mb-8 max-w-md mx-auto shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center text-indigo-300">Overall Skill Score</h2>

        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={18}
              data={skillChartData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar dataKey="value" cornerRadius={10} />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-center text-gray-300 mt-3 text-lg font-medium">
          {score}/100
        </p>
      </div>

      {/* --- Skills List --- */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow-lg max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-indigo-300 text-center">Detected Skills</h2>

        {skills.length === 0 ? (
          <p className="text-center text-gray-400">No skills found yet. Upload your resume!</p>
        ) : (
          <ul className="space-y-3">
            {skills.map((skill, index) => (
              <li key={index} className="bg-slate-700 p-3 rounded-xl flex justify-between items-center">
                <span className="font-medium text-indigo-200">{skill.name}</span>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Level: {skill.level}%</p>
                  <p className="text-sm text-gray-500">
                    Confidence: {(skill.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
