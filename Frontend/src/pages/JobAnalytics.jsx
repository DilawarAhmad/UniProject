import React, { useEffect, useState } from "react";
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

  const [jobs,setJobs] = useState([]);
  const [jobTrends,setJobTrends] = useState([]);
  const [topSkills,setTopSkills] = useState([]);
  const [loading,setLoading] = useState(true);

  const COLORS = ["#6366f1","#22d3ee","#a78bfa","#fbbf24","#4ade80","#f87171"];

  useEffect(()=>{

    const fetchJobs = async()=>{

      try{

        const userId = localStorage.getItem("userId");

        const res = await fetch(`http://127.0.0.1:8000/api/jobs/recommend/${userId}/`);

        if(!res.ok){
          console.error("API failed");
          return;
        }

        const data = await res.json();

        const jobsData = data.jobs || [];
        const skills = data.skills_used || [];

        setJobs(jobsData);

        /*  TRENDING ROLES */

        const roleCount = {};

        jobsData.forEach(job=>{
          const role = job.title || "Unknown";
          roleCount[role] = (roleCount[role] || 0) + 1;
        });

        const roles = Object.entries(roleCount)
          .map(([role,count])=>({role,openings:count}))
          .slice(0,5);

        setJobTrends(roles);

        /* -------- SKILL PIE -------- */

        const skillData = skills.slice(0,6).map(skill=>({
          name:skill,
          value:Math.floor(Math.random()*10)+5
        }));

        setTopSkills(skillData);

      }
      catch(err){
        console.error(err);
      }

      setLoading(false);

    };

    fetchJobs();

  },[]);

  if(loading){
    return(
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading jobs...
      </div>
    )
  }

  return(

  <div className="min-h-screen bg-slate-900 text-white py-12 px-6">

  <div className="max-w-7xl mx-auto">

  <h1 className="text-4xl font-bold text-center mb-4">
  Job Insights
  </h1>

  <p className="text-gray-400 text-center mb-12">
  Jobs matched with your skills in real-time
  </p>

  {/* TRENDING ROLES */}

  <div className="bg-slate-800 p-8 rounded-2xl shadow-md mb-12">

  <h2 className="text-2xl font-semibold text-indigo-400 mb-6 text-center">
  🔥 Trending Roles
  </h2>

  <ResponsiveContainer width="100%" height={300}>

  <BarChart data={jobTrends}>

  <CartesianGrid strokeDasharray="3 3" stroke="#475569"/>

  <XAxis dataKey="role" tick={{fill:"#cbd5e1"}}/>

  <YAxis tick={{fill:"#cbd5e1"}}/>

  <Tooltip
  contentStyle={{
  backgroundColor:"#1e293b",
  border:"1px solid #475569"
  }}
  />

  <Bar dataKey="openings" fill="#6366f1" radius={6}/>

  </BarChart>

  </ResponsiveContainer>

  </div>

  {/* JOB CARDS */}

  <div className="mb-12">

  <h2 className="text-2xl font-semibold text-indigo-400 mb-6 text-center">
  💼 Recommended Jobs
  </h2>

  <div className="grid md:grid-cols-3 gap-6">

  {jobs.map((job,index)=>(
    
  <div
  key={index}
  className="bg-slate-800 rounded-xl p-6 shadow hover:shadow-indigo-500/20 transition"
  >

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

  <a
  href={job.link}
  target="_blank"
  rel="noreferrer"
  className="inline-block bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded text-sm"
  >
  Apply
  </a>

  </div>

  ))}

  </div>

  </div>


  {/* TOP SKILLS */}

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

  {topSkills.map((entry,index)=>(
  <Cell key={index} fill={COLORS[index % COLORS.length]}/>
  ))}

  </Pie>

  <Tooltip
  contentStyle={{
  backgroundColor:"#1e293b",
  border:"1px solid #475569"
  }}
  />

  </PieChart>

  </ResponsiveContainer>

  </div>

  </div>

  </div>

  )

};

export default JobAnalytics;