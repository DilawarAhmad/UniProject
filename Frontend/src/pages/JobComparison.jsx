import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const JobComparison = () => {

  const location = useLocation();

  const job = location.state?.job;

  const [comparison, setComparison] = useState(null);

  useEffect(() => {

    const compare = async () => {

      const userId =
        localStorage.getItem("userId");

      const res = await fetch(
        `http://127.0.0.1:8000/api/jobs/compare/${userId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(job),
        }
      );

      const data = await res.json();

      setComparison(data);
    };

    compare();

  }, []);

  if (!comparison) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-2xl">
        Loading Analysis...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          ATS Match Analysis
        </h1>

        <p className="text-slate-400 mb-10">
          Compare your profile against job requirements.
        </p>

        {/* Top Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          {/* Match Score */}
          <div className="bg-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg">

            <div className="relative w-40 h-40">

              <div className="absolute inset-0 rounded-full border-8 border-slate-700"></div>

              <div
                className="absolute inset-0 rounded-full border-8 border-indigo-500"
                style={{
                  clipPath: `inset(${100 - comparison.match_score}% 0 0 0)`
                }}
              ></div>

              <div className="absolute inset-0 flex items-center justify-center">

                <span className="text-4xl font-bold">
                  {comparison.match_score}%
                </span>

              </div>

            </div>

            <p className="mt-4 text-slate-400">
              ATS Match Score
            </p>

          </div>

          {/* Stats */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">

            <h3 className="text-xl font-semibold mb-6">
              Statistics
            </h3>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span>Matched Skills</span>
                <span className="text-green-400 font-bold">
                  {comparison.matched_skills.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Missing Skills</span>
                <span className="text-red-400 font-bold">
                  {comparison.missing_skills.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Total Skills</span>
                <span className="text-indigo-400 font-bold">
                  {comparison.job_skills.length}
                </span>
              </div>

            </div>

          </div>

          {/* Recommendation */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">

            <h3 className="text-xl font-semibold mb-4">
              Recommendation
            </h3>

            {comparison.match_score >= 80 ? (
              <p className="text-green-400">
                Strong Match 🚀
              </p>
            ) : comparison.match_score >= 60 ? (
              <p className="text-yellow-400">
                Good Match 👍
              </p>
            ) : (
              <p className="text-red-400">
                Skill Gap Detected 📚
              </p>
            )}

            <p className="text-slate-400 mt-3">
              Focus on missing skills to improve your chances.
            </p>

          </div>

        </div>

        {/* Progress Bar */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-8">

          <h3 className="text-xl font-semibold mb-4">
            Overall Match Progress
          </h3>

          <div className="w-full bg-slate-700 rounded-full h-5 overflow-hidden">

            <div
              className="h-full bg-indigo-500"
              style={{
                width: `${comparison.match_score}%`
              }}
            />

          </div>

        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Matching Skills */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">

            <h2 className="text-2xl font-bold text-green-400 mb-6">
              ✓ Matching Skills
            </h2>

            <div className="flex flex-wrap gap-3">

              {comparison.matched_skills.map(skill => (

                <span
                  key={skill}
                  className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full"
                >
                  {skill}
                </span>

              ))}

            </div>

          </div>

          {/* Missing Skills */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">

            <h2 className="text-2xl font-bold text-red-400 mb-6">
              ✗ Missing Skills
            </h2>

            <div className="flex flex-wrap gap-3">

              {comparison.missing_skills.map(skill => (

                <span
                  key={skill}
                  className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full"
                >
                  {skill}
                </span>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default JobComparison;