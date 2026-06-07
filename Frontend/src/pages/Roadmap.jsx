import React, { useEffect, useState } from "react";

const platformLogos = {
  YouTube:
    "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",

  GeeksforGeeks:
    "https://media.geeksforgeeks.org/gfg-gg-logo.svg",

  Documentation:
    "https://cdn-icons-png.flaticon.com/512/2991/2991112.png",
};

const Roadmap = () => {
  const userId =localStorage.getItem("userId");
  const [query, setQuery] = useState("");

  const [roadmap, setRoadmap] = useState("");

  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(false);

  const [loadingResources, setLoadingResources] =
    useState(false);

  const [error, setError] = useState("");


  // =========================================================
  // LOAD SAVED DATA
  // =========================================================

  useEffect(() => {

    const savedRoadmap =
      localStorage.getItem("roadmap");

    const savedResources =
      localStorage.getItem("resources");

    const savedQuery =
      localStorage.getItem("query");

    if (savedRoadmap) {

      setRoadmap(savedRoadmap);
    }

    if (savedResources) {

      setResources(JSON.parse(savedResources));
    }

    if (savedQuery) {

      setQuery(savedQuery);
    }

  }, []);


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

      localStorage.removeItem("roadmap");

      localStorage.removeItem("resources");

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

      if (!roadmapData.success) {

        setError(
          roadmapData.error || "Roadmap generation failed"
        );

        return;
      }

      const generatedRoadmap = roadmapData.roadmap;

      localStorage.setItem(
        "roadmap",
        generatedRoadmap
      );

      localStorage.setItem(
        "query",
        query
      );

      // ============================================
      // FETCH RESOURCES IN PARALLEL
      // ============================================

      fetchResources(generatedRoadmap);

      // ============================================
      // TYPE EFFECT
      // ============================================

      await typeText(generatedRoadmap);

    } catch (err) {

      console.log(err);

      setError("Server error");

    } finally {

      setLoading(false);
    }
  };

const saveRoadmap = async () => {

  try {

    const steps = roadmap
      .split(/\n(?=\d+\.)/)
      .filter((step) => step.trim());
    const userId = localStorage.getItem("userId");

    console.log("USER ID:", userId);
    const res = await fetch(
      "http://127.0.0.1:8000/api/roadmap/save-roadmap/",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user_id: userId,

          title: query,

          query,

          roadmap,

          steps,

          resources
        }),
      }
    );

    const data = await res.json();


    // =====================================================
    // ALREADY SAVED
    // =====================================================

    if (data.already_saved) {

      alert(data.message);

      return;
    }


    // =====================================================
    // SAVED SUCCESSFULLY
    // =====================================================

    if (data.success) {

      alert("Roadmap saved successfully");
    }

  } catch (err) {

    console.log(err);
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

      if (!data.success) {

        return;
      }

      setResources(data.resources || []);

      localStorage.setItem(
        "resources",
        JSON.stringify(data.resources || [])
      );

    } catch (err) {

      console.log(err);

    } finally {

      setLoadingResources(false);
    }
  };


  return (

    <div className="min-h-screen bg-[#0B1120] text-white">

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-6">

          <div className="flex flex-col lg:flex-row gap-4 items-center">

            <div className="flex-1 w-full">

              <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">

                AI Roadmap Generator

              </h1>

              <p className="text-slate-400">

                Generate structured learning roadmaps with resources

              </p>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">

              <input
                type="text"
                placeholder="e.g. Full Stack Developer"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="
                  flex-1 lg:w-[400px]
                  bg-white/5
                  border border-white/10
                  focus:border-indigo-500
                  outline-none
                  px-5 py-4
                  rounded-2xl
                  text-white
                  placeholder:text-slate-500
                  backdrop-blur-xl
                "
              />

              <button
                onClick={generateRoadmap}
                disabled={loading}
                className="
                  px-7 py-4
                  rounded-2xl
                  font-semibold
                  bg-gradient-to-r
                  from-indigo-500
                  to-cyan-500
                  hover:scale-105
                  transition
                  disabled:opacity-50
                "
              >
                {loading ? "Generating..." : "Generate"}
              </button>
              <button
                onClick={saveRoadmap}
                className="
                  px-7 py-4
                  rounded-2xl
                  font-semibold
                  bg-green-600
                  hover:bg-green-700
                  transition
                "
              >
                Save Roadmap
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================================== */}

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ===================================================== */}
        {/* ERROR */}
        {/* ===================================================== */}

        {error && (

          <div className="
            bg-red-500/10
            border border-red-500/30
            rounded-2xl
            p-5
            text-red-300
            mb-8
          ">

            {error}

          </div>
        )}

        {/* ===================================================== */}
        {/* ROADMAP */}
        {/* ===================================================== */}

        {roadmap && (

          <div className="
            bg-white/5
            border border-white/10
            backdrop-blur-xl
            rounded-3xl
            p-8
            mb-12
            shadow-2xl
          ">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-3xl font-bold mb-2">

                  Learning Roadmap

                </h2>

                <p className="text-slate-400">

                  AI-generated roadmap for {query}

                </p>
              </div>

            </div>

            <div className="
              whitespace-pre-line
              leading-9
              text-[17px]
              text-slate-200
            ">

              {roadmap}

            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* LOADING RESOURCES */}
        {/* ===================================================== */}

        {loadingResources && (

          <div className="
            bg-white/5
            border border-white/10
            rounded-2xl
            p-6
            mb-10
            animate-pulse
          ">

            <div className="flex items-center gap-4">

              <div className="
                w-4 h-4
                rounded-full
                bg-indigo-400
              " />

              <p className="text-indigo-300 text-lg">

                AI agents are searching for learning resources...

              </p>
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* RESOURCES */}
        {/* ===================================================== */}

        {resources.length > 0 && (

          <div>

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-3xl font-bold mb-2">

                  Learning Resources

                </h2>

                <p className="text-slate-400">

                  Curated tutorials and documentation

                </p>
              </div>

              <div className="
                px-4 py-2
                rounded-full
                bg-cyan-500/20
                text-cyan-300
                text-sm
              ">

                {resources.length} Technologies

              </div>
            </div>

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-6
            ">

              {resources.map((item, index) => (

                <div
                  key={index}
                  className="
                    group
                    bg-white/5
                    border border-white/10
                    hover:border-indigo-500/40
                    backdrop-blur-xl
                    rounded-3xl
                    p-6
                    transition-all
                    duration-300
                    hover:-translate-y-2
                  "
                >

                  {/* TECHNOLOGY */}

                  <div className="mb-6">

                    <div className="
                      inline-flex
                      px-4 py-2
                      rounded-full
                      bg-indigo-500/20
                      text-indigo-300
                      text-sm
                      mb-4
                    ">

                      {item.technology}

                    </div>

                    <h3 className="
                      text-2xl
                      font-bold
                      capitalize
                    ">

                      {item.technology}

                    </h3>
                  </div>

                  {/* LINKS */}

                  <div className="space-y-4">

                    {item.resources.map((resource, i) => (

                      <a
                        key={i}
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          flex
                          items-center
                          gap-4
                          p-4
                          rounded-2xl
                          bg-black/20
                          hover:bg-indigo-500/10
                          transition
                          border border-white/5
                        "
                      >

                        <img
                          src={platformLogos[resource.platform]}
                          alt={resource.platform}
                          className="
                            w-12 h-12
                            rounded-xl
                            bg-white
                            p-2
                            object-contain
                          "
                        />

                        <div className="flex-1">

                          <h4 className="
                            font-semibold
                            line-clamp-2
                            mb-1
                          ">

                            {resource.title}

                          </h4>

                          <p className="
                            text-sm
                            text-slate-400
                          ">

                            {resource.platform}

                          </p>
                        </div>

                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Roadmap;