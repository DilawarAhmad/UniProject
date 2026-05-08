import React, { useState } from "react";

const platformLogos = {
  YouTube:
    "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",

  GeeksforGeeks:
    "https://media.geeksforgeeks.org/gfg-gg-logo.svg",

  Documentation:
    "https://cdn-icons-png.flaticon.com/512/2991/2991112.png",
};

const Roadmap = () => {

  const [query, setQuery] = useState("");

  const [roadmap, setRoadmap] = useState("");

  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(false);

  const [loadingResources, setLoadingResources] =
    useState(false);

  const [error, setError] = useState("");


  // =========================================================
  // TYPING EFFECT
  // =========================================================

  const typeText = async (text) => {

    let currentText = "";

    for (let i = 0; i < text.length; i++) {

      currentText += text[i];

      setRoadmap(currentText);

      await new Promise((resolve) =>
        setTimeout(resolve, 5)
      );
    }
  };


  // =========================================================
  // GENERATE ROADMAP
  // =========================================================

  const generateRoadmap = async () => {

    try {

      setLoading(true);

      setError("");

      setRoadmap("");

      setResources([]);

      // ============================================
      // FIRST API
      // ROADMAP
      // ============================================

      const roadmapRes = await fetch(
        "http://127.0.0.1:8000/api/roadmap/generate-roadmap/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            query,
          }),
        }
      );

      const roadmapData = await roadmapRes.json();

      console.log("Roadmap:", roadmapData);

      if (!roadmapData.success) {

        setError(
          roadmapData.error || "Roadmap generation failed"
        );

        return;
      }

      const generatedRoadmap = roadmapData.roadmap;

      // ============================================
      // START RESOURCES FETCH IN PARALLEL
      // ============================================

      fetchResources(generatedRoadmap);

      // ============================================
      // TYPE ROADMAP
      // ============================================

      await typeText(generatedRoadmap);

    } catch (err) {

      console.log(err);

      setError("Server error");

    } finally {

      setLoading(false);
    }
  };


  // =========================================================
  // FETCH RESOURCES
  // =========================================================

  const fetchResources = async (generatedRoadmap) => {

    try {

      setLoadingResources(true);

      const res = await fetch(
        "http://127.0.0.1:8000/api/roadmap/generate-resources/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            roadmap: generatedRoadmap,
          }),
        }
      );

      const data = await res.json();

      console.log("Resources:", data);

      if (!data.success) {

        return;
      }

      setResources(data.resources || []);

    } catch (err) {

      console.log(err);

    } finally {

      setLoadingResources(false);
    }
  };


  return (

    <div className="min-h-screen bg-slate-900 text-white p-10">

      {/* ========================================================= */}
      {/* TITLE */}
      {/* ========================================================= */}

      <h1 className="text-4xl font-bold mb-8">

        AI Roadmap Generator

      </h1>

      {/* ========================================================= */}
      {/* INPUT */}
      {/* ========================================================= */}

      <input
        type="text"
        placeholder="Enter topic..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-4 rounded bg-slate-800 border border-slate-700 mb-4"
      />

      {/* ========================================================= */}
      {/* BUTTON */}
      {/* ========================================================= */}

      <button
        onClick={generateRoadmap}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded font-semibold"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {/* ========================================================= */}
      {/* ERROR */}
      {/* ========================================================= */}

      {error && (

        <div className="mt-6 bg-red-500/20 border border-red-500 p-4 rounded">

          {error}

        </div>
      )}

      {/* ========================================================= */}
      {/* ROADMAP */}
      {/* ========================================================= */}

      {roadmap && (

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-5">

            Roadmap

          </h2>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 whitespace-pre-line leading-8">

            {roadmap}

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* LOADING RESOURCES */}
      {/* ========================================================= */}

      {loadingResources && (

        <div className="mt-10 text-indigo-400 text-lg">

          Searching learning resources...

        </div>
      )}

      {/* ========================================================= */}
      {/* RESOURCES */}
      {/* ========================================================= */}

      {resources.length > 0 && (

        <div className="mt-12">

          <h2 className="text-3xl font-bold mb-6">

            Learning Resources

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {resources.map((item, index) => (

              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5"
              >

                {/* TECHNOLOGY */}

                <h3 className="text-2xl font-bold text-indigo-400 mb-5 capitalize">

                  {item.technology}

                </h3>

                {/* LINKS */}

                <div className="space-y-4">

                  {item.resources.length > 0 ? (

                    item.resources.map((resource, i) => (

                      <a
                        key={i}
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block bg-slate-700 hover:bg-slate-600 rounded-lg p-4 transition"
                      >

                        <div className="flex items-center gap-4">

                          {/* LOGO */}

                          <img
                            src={platformLogos[resource.platform]}
                            alt={resource.platform}
                            className="w-10 h-10 object-contain bg-white rounded p-1"
                          />

                          {/* INFO */}

                          <div>

                            <div className="font-semibold">

                              {resource.title}

                            </div>

                            <div className="text-sm text-slate-300 mt-1">

                              {resource.platform}

                            </div>

                          </div>
                        </div>
                      </a>
                    ))

                  ) : (

                    <div className="text-slate-400">

                      No resources found

                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;