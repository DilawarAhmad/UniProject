import React, { useState } from "react";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend } from "recharts";

const Roadmap = () => {
  // Dummy roadmap data
  const [roadmap, setRoadmap] = useState([
    {
      phase: "Phase 1: Web Development Basics",
      progress: 80,
      topics: [
        { id: 1, title: "HTML & CSS Fundamentals", status: "completed" },
        { id: 2, title: "JavaScript Basics", status: "completed" },
        { id: 3, title: "Version Control with Git & GitHub", status: "in-progress" },
      ],
    },
    {
      phase: "Phase 2: Frontend Frameworks",
      progress: 50,
      topics: [
        { id: 4, title: "React Fundamentals", status: "in-progress" },
        { id: 5, title: "React Hooks & Components", status: "pending" },
        { id: 6, title: "UI Styling with TailwindCSS", status: "pending" },
      ],
    },
    {
      phase: "Phase 3: Backend Development",
      progress: 30,
      topics: [
        { id: 7, title: "Python for APIs", status: "pending" },
        { id: 8, title: "FastAPI Basics", status: "pending" },
        { id: 9, title: "Database Integration (PostgreSQL)", status: "pending" },
      ],
    },
    {
      phase: "Phase 4: AI Integration",
      progress: 10,
      topics: [
        { id: 10, title: "Introduction to NLP", status: "pending" },
        { id: 11, title: "Custom Skill Gap Detection", status: "pending" },
        { id: 12, title: "Integrating GPT APIs", status: "pending" },
      ],
    },
  ]);

  const overallProgress =
    Math.round(
      roadmap.reduce((acc, phase) => acc + phase.progress, 0) / roadmap.length
    );

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Personalized Learning Roadmap
        </h1>
        <p className="text-gray-400 text-center mb-12">
          Your AI-generated learning journey — track your skills, complete phases, and reach your goals.
        </p>

        {/* Overall Progress Section */}
        <div className="flex flex-col items-center mb-16">
          <ResponsiveContainer width="50%" height={250}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={15}
              data={[{ name: "Overall Progress", value: overallProgress, fill: "#6366f1" }]}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar dataKey="value" />
              <Legend
                iconSize={10}
                width={120}
                height={140}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="mt-4 text-lg text-indigo-400 font-semibold">
            Overall Progress: {overallProgress}%
          </p>
        </div>

        {/* Roadmap Phases */}
        <div className="space-y-12">
          {roadmap.map((phase, i) => (
            <div
              key={i}
              className="bg-slate-800 p-8 rounded-2xl shadow-md border border-slate-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-indigo-400">
                  {phase.phase}
                </h2>
                <p className="text-gray-400 text-sm">
                  Progress: {phase.progress}%
                </p>
              </div>

              <div className="space-y-4">
                {phase.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between bg-slate-900 p-4 rounded-xl hover:bg-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {topic.status === "completed" ? (
                        <CheckCircle className="text-green-400" />
                      ) : topic.status === "in-progress" ? (
                        <Clock className="text-yellow-400" />
                      ) : (
                        <Circle className="text-gray-500" />
                      )}
                      <p className="font-medium">{topic.title}</p>
                    </div>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        topic.status === "completed"
                          ? "bg-green-600/30 text-green-300"
                          : topic.status === "in-progress"
                          ? "bg-yellow-600/30 text-yellow-300"
                          : "bg-slate-600/40 text-gray-400"
                      }`}
                    >
                      {topic.status.replace("-", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Future Section */}
        <div className="mt-16 text-center bg-slate-800 p-8 rounded-2xl shadow-inner text-gray-300">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">
            Coming Soon
          </h2>
          <p>
            Soon this roadmap will be dynamically generated using your resume, GitHub data, and
            skill-gap analysis from our AI model. You’ll get adaptive updates as you learn.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
