import React, { useState } from "react";

const Roadmap = () => {
  const [query, setQuery] = useState("");
  const [roadmap, setRoadmap] = useState("");

  const generateRoadmap = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/roadmap/generate-roadmap/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setRoadmap(data.roadmap);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-3xl mb-6">AI Roadmap Generator</h1>

      <input
        type="text"
        placeholder="Enter topic (e.g. MERN, Python, AI...)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-3 w-full text-white rounded mb-4"
      />

      <button
        onClick={generateRoadmap}
        className="bg-indigo-600 px-6 py-2 rounded"
      >
        Generate
      </button>

      <div className="mt-8 whitespace-pre-line bg-slate-800 p-6 rounded">
        {roadmap}
      </div>
    </div>
  );
};

export default Roadmap;