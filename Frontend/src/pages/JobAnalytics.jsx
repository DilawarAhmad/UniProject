import React, { useEffect, useState,useRef } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const JobAnalytics = () => {
  const [jobs, setJobs] = useState([]);
  const [jobTrends, setJobTrends] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const [internships, setInternships] = useState([]);
  const [appliedLinks, setAppliedLinks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const COLORS = ["#6366f1", "#22d3ee", "#a78bfa", "#fbbf24", "#4ade80", "#f87171"];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const userId = localStorage.getItem("userId");

        // ✅ CORRECT reload detection (THIS FIXES YOUR ISSUE)
        // const navEntry = performance.getEntriesByType("navigation")[0];
        // const isReload = navEntry && navEntry.type === "reload";

        // ================= CACHE LOGIC =================
        const cached = localStorage.getItem("jobs_cache");
        const cachedTime = localStorage.getItem("jobs_cache_time");

        const FIVE_MINUTES = 5 * 60 * 1000;

        if (
          cached &&
          cachedTime &&
          Date.now() - Number(cachedTime) < FIVE_MINUTES
        ) {
          console.log("⚡ Using cached jobs");

          const parsed = JSON.parse(cached);

          setJobs(parsed.jobs || []);
          setInternships(parsed.internships || []);
          setJobTrends(parsed.trending_jobs || []);
          setTopSkills(parsed.topSkills || []);
          setAppliedLinks(parsed.appliedLinks || []);

          setLoading(false);
          return;
        }

        console.log("🌐 Fetching fresh jobs");
        if (hasFetched.current) return;   // ✅ prevents double call
        hasFetched.current = true;
        const res = await fetch(
          `http://127.0.0.1:8000/api/jobs/recommend/${userId}/`
        );

        if (!res.ok) {
          console.error("API failed");
          setLoading(false);
          return;
        }

        const data = await res.json();

        const jobsData = data.recommended_jobs || [];
        const trendingData = data.trending_jobs || [];
        const internshipData = data.internships || [];
        const skills = data.skills_used || [];

        setJobs(jobsData);
        setInternships(internshipData);
        setJobTrends(trendingData);

        const appliedRes = await fetch(
          `http://127.0.0.1:8000/api/jobs/applied/${userId}/`
        );
        const appliedData = await appliedRes.json();
        const applied = appliedData.map(j => j.link);
        setAppliedLinks(applied);

        const skillFrequency = {};

        jobsData.forEach((job) => {
          const text = (job.description || "").toLowerCase();

          skills.forEach((skill) => {
            if (text.includes(skill)) {
              skillFrequency[skill] =
                (skillFrequency[skill] || 0) + 1;
            }
          });
        });

        const skillData = Object.entries(skillFrequency)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6);

        setTopSkills(skillData);

        // ================= SAVE CACHE =================
        localStorage.setItem(
          "jobs_cache",
          JSON.stringify({
            jobs: jobsData,
            internships: internshipData,
            trending_jobs: trendingData,
            topSkills: skillData,
            appliedLinks: applied,
          })
        );

        localStorage.setItem("jobs_cache_time", Date.now().toString());

      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchJobs();
  }, []);

  const saveJob = async (job) => {
    const userId = localStorage.getItem("userId");

    await fetch(`http://127.0.0.1:8000/api/jobs/save/${userId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });

    alert("Job saved!");
  };

  const applyJob = async (job) => {
    const userId = localStorage.getItem("userId");

    await fetch(`http://127.0.0.1:8000/api/jobs/apply/${userId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: job.title,
        company: job.company,
        link: job.link,
      }),
    });

    setAppliedLinks(prev => [...prev, job.link]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading jobs...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-4">
          Job Insights
        </h1>

        <p className="text-gray-400 text-center mb-12">
          Jobs matched with your skills intelligently
        </p>

        <div className="bg-slate-800 p-8 rounded-2xl shadow-md mb-12">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-6 text-center">
            🔥 Trending Roles
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="role" tick={{ fill: "#cbd5e1" }} />
              <YAxis tick={{ fill: "#cbd5e1" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                }}
              />
              <Bar dataKey="openings" fill="#6366f1" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-6 text-center">
            💼 Recommended Jobs
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {jobs.map((job, index) => {
              const isApplied = appliedLinks.includes(job.link);

              return (
                <div
                  key={index}
                  className="relative bg-slate-800 rounded-xl p-6 shadow hover:shadow-indigo-500/20 transition"
                >
                  <button
                    onClick={() => saveJob(job)}
                    className="absolute top-3 right-3 bg-pink-500 hover:bg-pink-600 px-2 py-1 rounded text-xs"
                  >
                    ❤️
                  </button>

                  <h3 className="text-lg font-semibold text-indigo-300 mb-2">
                    {job.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-1">
                    {job.company}
                  </p>

                  <p className="text-gray-500 text-sm mb-3">
                    {job.location}
                  </p>

                  <p className="text-xs text-gray-400 line-clamp-3 mb-4">
                    {job.description}
                  </p>

                  <div className="flex gap-2">
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded text-sm"
                    >
                      View
                    </a>

                    <button
                      onClick={() => applyJob(job)}
                      disabled={isApplied}
                      className={`px-4 py-2 rounded text-sm ${
                        isApplied
                          ? "bg-gray-500"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {isApplied ? "Applied" : "Apply"}
                    </button>
                  </div>

                  {job.score && (
                    <p className="text-xs text-green-400 mt-2">
                      Match Score: {job.score}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {internships.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-indigo-400 mb-6 text-center">
              🎓 Internships
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {internships.map((job, index) => (
                <div
                  key={index}
                  className="bg-slate-800 rounded-xl p-6 shadow hover:shadow-green-500/20 transition"
                >
                  <h3 className="text-lg font-semibold text-green-300 mb-2">
                    {job.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-1">
                    {job.company}
                  </p>

                  <p className="text-gray-500 text-sm mb-3">
                    {job.location}
                  </p>

                  <a
                    href={job.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm"
                  >
                    Apply
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-800 p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-6 text-center">
            🧠 Top Skills Used
          </h2>

          <ResponsiveContainer width="100%" height={300}>
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
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default JobAnalytics;