import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

const Dashboard = () => {
  // Get saved profile data
  const skills = JSON.parse(localStorage.getItem("userSkills")) || [];
  const skillScore = parseInt(localStorage.getItem("skillScore")) || 0;

  // Temporary: Create skillData from stored skills
  const skillData = skills.map((skill) => ({
    name: skill,
    level: Math.floor(Math.random() * 40) + 60, // random 60–100 just to visualize
  }));

  // Dummy weekly activity (until you build real tracking)
  const activityData = [
    { week: "Week 1", progress: 10 },
    { week: "Week 2", progress: 25 },
    { week: "Week 3", progress: 45 },
    { week: "Week 4", progress: 60 },
    { week: "Week 5", progress: 80 },
  ];

  // Temporary user info (later from Supabase auth profile)
  const user = {
    name: "User",
    role: "Aspiring Developer",
    email: "user@example.com",
    profileScore: 80,
    roadmapProgress: 30,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Welcome back, <span className="text-indigo-400">{user.name}</span> 👋
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {/* Profile Card */}
        <div className="col-span-1 bg-slate-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Profile Summary</h2>
          <div className="space-y-2 text-gray-300">
            <p><span className="font-semibold">Role:</span> {user.role}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Profile Strength:</span> {user.profileScore}%</p>
          </div>

          <div className="mt-6">
            <p className="text-gray-400 mb-1">Roadmap Progress</p>
            <div className="w-full bg-slate-700 h-3 rounded-full">
              <div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${user.roadmapProgress}%` }}></div>
            </div>
            <p className="text-sm text-right mt-1 text-gray-400">{user.roadmapProgress}% Complete</p>
          </div>
        </div>

        {/* Skill Score Chart */}
        <div className="col-span-1 bg-slate-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Skill Score</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={15}
              data={[{ name: "Skill Score", value: skillScore, fill: "#6366f1" }]}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" cornerRadius={10} background />
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="text-center text-gray-400">Skill Score: {skillScore}/100</p>
        </div>

        {/* Weekly Learning Activity */}
        <div className="col-span-1 bg-slate-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Weekly Learning Progress</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activityData}>
              <XAxis dataKey="week" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="progress" stroke="#6366f1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skills Table */}
      <div className="max-w-6xl mx-auto mt-12 bg-slate-800 p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Your Skills Overview</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-gray-300">
            <thead>
              <tr className="text-indigo-400 border-b border-slate-700">
                <th className="py-3 px-4 text-left">Skill</th>
                <th className="py-3 px-4 text-left">Proficiency</th>
                <th className="py-3 px-4 text-left">Progress</th>
              </tr>
            </thead>
            <tbody>
              {skillData.map((skill, index) => (
                <tr key={index} className="border-b border-slate-700 hover:bg-slate-700">
                  <td className="py-3 px-4">{skill.name}</td>
                  <td className="py-3 px-4">{skill.level}%</td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-slate-700 h-2 rounded-full">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Placeholder */}
      <div className="max-w-6xl mx-auto mt-12 bg-slate-800 p-8 rounded-2xl text-gray-300 text-center">
        <h2 className="text-2xl font-semibold text-indigo-400 mb-2">Career Insights (Coming Soon)</h2>
        <p>Soon you'll see personalized job recommendations & industry trends.</p>
      </div>
    </div>
  );
};

export default Dashboard;
