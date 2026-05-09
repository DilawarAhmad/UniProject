import React from "react";
import JobsDashboard from "../components/dashboard/JobsDashboard";
import RoadmapDashboard from "../components/dashboard/RoadmapDashboard";


const Dashboard = () => {

  return (

    <div className="min-h-screen bg-[#0B1120] text-white">

      {/* ===================================================== */}
      {/* PAGE CONTAINER */}
      {/* ===================================================== */}

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ===================================================== */}
        {/* PAGE HEADER */}
        {/* ===================================================== */}

        <div className="mb-14">

          <h1 className="
            text-6xl
            font-black
            bg-gradient-to-r
            from-indigo-400
            to-cyan-400
            bg-clip-text
            text-transparent
            mb-4
          ">

            AI Career Dashboard

          </h1>

          <p className="text-slate-400 text-lg">

            Track your jobs, learning roadmaps, and progress in one place

          </p>
        </div>

        {/* ===================================================== */}
        {/* JOBS DASHBOARD */}
        {/* ===================================================== */}

        <div className="mb-24">

          <JobsDashboard />

        </div>

        {/* ===================================================== */}
        {/* ROADMAP DASHBOARD */}
        {/* ===================================================== */}

        <div>

          <RoadmapDashboard />

        </div>

      </div>
    </div>
  );
};

export default Dashboard;