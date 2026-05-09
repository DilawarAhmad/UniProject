import React, { useEffect, useState } from "react";

const JobsDashboard = () => {

  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    Promise.all([
      fetch(`http://127.0.0.1:8000/api/jobs/saved/${userId}/`).then(res => res.json()),
      fetch(`http://127.0.0.1:8000/api/jobs/applied/${userId}/`).then(res => res.json()),
      fetch(`http://127.0.0.1:8000/api/get-skills/${userId}/`).then(res => res.json())
    ])
    .then(([saved, applied, skillRes]) => {

      setSavedJobs(saved);
      setAppliedJobs(applied);

      const skillsData = skillRes.skills || [];
      setSkills(skillsData);
      setScore(skillRes.score || 0);

      setStats({
        saved: saved.length,
        applied: applied.length,
        skills: skillsData.length
      });

    })
    .catch(err => console.error(err));

  }, []);

  // ❌ DELETE SAVED JOB (UNCHANGED)
  const deleteJob = async (link) => {
    const userId = localStorage.getItem("userId");

    if (!window.confirm("Remove this job?")) return;

    await fetch(`http://127.0.0.1:8000/api/jobs/delete/${userId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link }),
    });

    setSavedJobs(prev => prev.filter(job => job.link !== link));
  };

  // 🔥 APPLY JOB (NEW)
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

    // update UI instantly
    setAppliedJobs(prev => [
      ...prev,
      { ...job, status: "applied" }
    ]);
  };

  // 🔥 DELETE APPLIED JOB (NEW)
  const deleteAppliedJob = async (link) => {
    const userId = localStorage.getItem("userId");

    await fetch(`http://127.0.0.1:8000/api/jobs/delete-applied/${userId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link }),
    });

    setAppliedJobs(prev => prev.filter(job => job.link !== link));
  };

  // 🔥 UPDATE STATUS (NEW)
  const updateStatus = async (link, status) => {
    const userId = localStorage.getItem("userId");

    await fetch(`http://127.0.0.1:8000/api/jobs/update-status/${userId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link, status }),
    });

    setAppliedJobs(prev =>
      prev.map(job =>
        job.link === link ? { ...job, status } : job
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Dashboard</h1>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">

        <div className="bg-slate-800 p-6 rounded-xl text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.skills || 0}</p>
          <p className="text-gray-400">Skills</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl text-center">
          <p className="text-2xl font-bold text-pink-400">{stats.saved || 0}</p>
          <p className="text-gray-400">Saved Jobs</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl text-center">
          <p className="text-2xl font-bold text-green-400">{stats.applied || 0}</p>
          <p className="text-gray-400">Applied Jobs</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl text-center">
          <p className="text-2xl font-bold text-indigo-400">{score}</p>
          <p className="text-gray-400">Profile Score</p>
        </div>

      </div>

      {/* ================= SKILLS ================= */}
      <h2 className="text-xl mb-4 text-yellow-400">🧠 Your Skills</h2>

      <div className="flex flex-wrap gap-3 mb-10">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="bg-slate-700 px-3 py-1 rounded-full text-sm text-yellow-300"
          >
            {skill.name}
          </span>
        ))}
      </div>

      {/* ================= SAVED JOBS ================= */}
      <h2 className="text-xl mb-4 text-indigo-400">💾 Saved Jobs</h2>

      <div className="grid md:grid-cols-3 gap-6 mb-12">

        {savedJobs.map((job, index) => (
          <div
            key={index}
            className="relative bg-slate-800 rounded-xl p-6 shadow hover:shadow-indigo-500/20 transition"
          >

            {/* ❌ DELETE */}
            <button
              onClick={() => deleteJob(job.link)}
              className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-lg"
              title="Remove"
            >
              ✖
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

            {/* 🔥 APPLY BUTTON ADDED */}
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
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm"
              >
                Apply
              </button>
            </div>

          </div>
        ))}

      </div>

      {/* ================= APPLIED JOBS ================= */}
      <h2 className="text-xl mb-4 text-green-400">📌 Applied Jobs</h2>

      <div className="grid md:grid-cols-2 gap-4">

        {appliedJobs.map((job, i) => (
          <div
            key={i}
            className="bg-slate-800 p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{job.title}</p>
              <p className="text-sm text-gray-400">{job.company}</p>
            </div>

            {/* 🔥 STATUS + DELETE ADDED */}
            <div className="flex gap-2 items-center">

              <select
                value={job.status}
                onChange={(e) => updateStatus(job.link, e.target.value)}
                className="bg-slate-700 text-white px-2 py-1 rounded"
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>

              <button
                onClick={() => deleteAppliedJob(job.link)}
                className="text-red-400 hover:text-red-600"
              >
                ✖
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default JobsDashboard;