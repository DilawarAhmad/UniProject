import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const JobAnalytics = () => {
  // Dummy data for trending job roles
  const jobTrends = [
    { role: "Full Stack Developer", openings: 1200 },
    { role: "Data Scientist", openings: 950 },
    { role: "Machine Learning Engineer", openings: 870 },
    { role: "Frontend Developer", openings: 780 },
    { role: "DevOps Engineer", openings: 600 },
  ];

  // Dummy data for top skills
  const topSkills = [
    { name: "React", value: 25 },
    { name: "Python", value: 22 },
    { name: "SQL", value: 18 },
    { name: "AWS", value: 15 },
    { name: "FastAPI", value: 10 },
    { name: "Docker", value: 10 },
  ];

  // Dummy data for weekly job posting trends
  const weeklyData = [
    { week: "Week 1", jobs: 300 },
    { week: "Week 2", jobs: 420 },
    { week: "Week 3", jobs: 390 },
    { week: "Week 4", jobs: 460 },
    { week: "Week 5", jobs: 500 },
  ];

  const COLORS = ["#6366f1", "#22d3ee", "#a78bfa", "#fbbf24", "#4ade80", "#f87171"];

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Real-Time Job & Skill Analytics
        </h1>
        <p className="text-gray-400 text-center mb-12">
          Discover trending roles, in-demand skills, and weekly hiring insights powered by AI-driven job scraping.
        </p>

        {/* Section 1: Top Roles */}
        <div className="bg-slate-800 p-8 rounded-2xl shadow-md mb-12">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-6 text-center">
            🔥 Trending Job Roles
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={jobTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="role" tick={{ fill: "#cbd5e1" }} />
              <YAxis tick={{ fill: "#cbd5e1" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="openings" fill="#6366f1" barSize={35} radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Section 2: Top Skills */}
        <div className="bg-slate-800 p-8 rounded-2xl shadow-md mb-12">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-6 text-center">
            🧠 Top In-Demand Skills
          </h2>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={topSkills}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {topSkills.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 3: Weekly Trends */}
        <div className="bg-slate-800 p-8 rounded-2xl shadow-md mb-12">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-6 text-center">
            📈 Weekly Job Posting Trends
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="week" tick={{ fill: "#cbd5e1" }} />
              <YAxis tick={{ fill: "#cbd5e1" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="jobs"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{ fill: "#22d3ee", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Section 4: Insights Summary */}
        <div className="bg-slate-800 p-8 rounded-2xl text-center text-gray-300 shadow-inner">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">
            AI-Generated Market Insights (Coming Soon)
          </h2>
          <p>
            Our AI engine will soon analyze thousands of job postings weekly to provide real-time insights
            — including demand surges, role evolution, and career recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobAnalytics;
