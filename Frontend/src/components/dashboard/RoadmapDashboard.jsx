import React, { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const platformColors = {

  YouTube: "bg-red-500/20 text-red-300",

  GeeksforGeeks: "bg-green-500/20 text-green-300",

  Documentation: "bg-blue-500/20 text-blue-300",
};


const RoadmapDashboard = () => {

  const [roadmaps, setRoadmaps] = useState([]);


  // =========================================================
  // FETCH ROADMAPS
  // =========================================================

  useEffect(() => {

    fetchRoadmaps();

  }, []);


  const fetchRoadmaps = async () => {

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/roadmap/saved-roadmaps/"
      );

      const data = await res.json();

      if (data.success) {

        setRoadmaps(data.roadmaps);
      }

    } catch (err) {

      console.log(err);
    }
  };


  // =========================================================
  // TOGGLE STEP
  // =========================================================

  const toggleStep = async (
    roadmapId,
    step
  ) => {

    try {

      await fetch(
        `http://127.0.0.1:8000/api/roadmap/toggle-step/${roadmapId}/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            step,
          }),
        }
      );

      fetchRoadmaps();

    } catch (err) {

      console.log(err);
    }
  };


  // =========================================================
  // DELETE ROADMAP
  // =========================================================

  const deleteRoadmap = async (roadmapId) => {

    const confirmDelete = window.confirm(
      "Delete this roadmap?"
    );

    if (!confirmDelete) return;

    try {

      await fetch(
        `http://127.0.0.1:8000/api/roadmap/delete-roadmap/${roadmapId}/`,
        {
          method: "DELETE",
        }
      );

      setRoadmaps(prev =>
        prev.filter(
          roadmap => roadmap.id !== roadmapId
        )
      );

    } catch (err) {

      console.log(err);
    }
  };


  return (

    <div className="mt-20">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="mb-14">

        <h1 className="
          text-5xl
          font-black
          mb-4
          bg-gradient-to-r
          from-cyan-400
          to-indigo-400
          bg-clip-text
          text-transparent
        ">

          Learning Dashboard

        </h1>

        <p className="text-slate-400 text-lg">

          Track your roadmap progress and learning resources

        </p>
      </div>

      {/* ===================================================== */}
      {/* ROADMAPS */}
      {/* ===================================================== */}

      <div className="space-y-12">

        {roadmaps.map((roadmap) => {

          const data = [

            {
              name: "Completed",
              value: roadmap.progress,
            },

            {
              name: "Remaining",
              value: 100 - roadmap.progress,
            },
          ];


          return (

            <div
              key={roadmap.id}
              className="
                bg-white/5
                border border-white/10
                rounded-3xl
                p-8
                backdrop-blur-xl
              "
            >

              {/* ================================================= */}
              {/* TOP SECTION */}
              {/* ================================================= */}

              <div className="
                flex
                flex-col
                xl:flex-row
                justify-between
                gap-10
                mb-12
              ">

                {/* LEFT */}

                <div className="flex-1">

                  <div className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-start
                    justify-between
                    gap-6
                  ">

                    <div>

                      <h2 className="
                        text-4xl
                        font-bold
                        mb-4
                        capitalize
                      ">

                        {roadmap.title}

                      </h2>

                      <p className="
                        text-slate-400
                        text-lg
                      ">

                        {roadmap.progress}% completed

                      </p>
                    </div>

                    {/* DELETE BUTTON */}

                    <button
                      onClick={() =>
                        deleteRoadmap(roadmap.id)
                      }
                      className="
                        bg-red-500/10
                        border border-red-500/20
                        hover:bg-red-500/20
                        text-red-400
                        px-5 py-3
                        rounded-2xl
                        transition
                        h-fit
                      "
                    >

                      Delete Roadmap

                    </button>
                  </div>
                </div>

                {/* RIGHT CHART */}

                <div className="
                  w-[250px]
                  h-[250px]
                  mx-auto
                ">

                  <ResponsiveContainer>

                    <PieChart>

                      <Pie
                        data={data}
                        innerRadius={70}
                        outerRadius={100}
                        dataKey="value"
                      >

                        <Cell fill="#6366F1" />

                        <Cell fill="#1E293B" />

                      </Pie>

                      <Tooltip />

                    </PieChart>

                  </ResponsiveContainer>
                </div>
              </div>

              {/* ================================================= */}
              {/* STEPS */}
              {/* ================================================= */}

              <div className="mb-14">

                <h3 className="
                  text-2xl
                  font-bold
                  mb-6
                  text-indigo-300
                ">

                  Roadmap Steps

                </h3>

                <div className="space-y-4">

                  {roadmap.steps.map((step, index) => {

                    const checked =
                      roadmap.completed_steps.includes(step);

                    return (

                      <div
                        key={index}
                        className="
                          flex
                          items-start
                          gap-4
                          p-5
                          rounded-2xl
                          bg-black/20
                          border border-white/5
                        "
                      >

                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleStep(
                              roadmap.id,
                              step
                            )
                          }
                          className="
                            w-5
                            h-5
                            mt-1
                          "
                        />

                        <p
                          className={`leading-8 ${
                            checked
                              ? "line-through text-slate-500"
                              : "text-white"
                          }`}
                        >

                          {step}

                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ================================================= */}
              {/* RESOURCES */}
              {/* ================================================= */}

              <div>

                <h3 className="
                  text-2xl
                  font-bold
                  mb-6
                  text-cyan-300
                ">

                  Learning Resources

                </h3>

                <div className="
                  grid
                  md:grid-cols-2
                  xl:grid-cols-3
                  gap-6
                ">

                  {roadmap.resources.map((resourceGroup, index) => (

                    <div
                      key={index}
                      className="
                        bg-black/20
                        border border-white/5
                        rounded-2xl
                        p-5
                      "
                    >

                      <h4 className="
                        text-xl
                        font-bold
                        capitalize
                        mb-5
                      ">

                        {resourceGroup.technology}

                      </h4>

                      <div className="space-y-4">

                        {resourceGroup.resources.map((resource, i) => (

                          <a
                            key={i}
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="
                              block
                              p-4
                              rounded-xl
                              bg-white/5
                              hover:bg-white/10
                              transition
                            "
                          >

                            <div className="
                              flex
                              items-center
                              justify-between
                              mb-3
                            ">

                              <span className={`
                                px-3 py-1
                                rounded-full
                                text-sm
                                ${platformColors[resource.platform]}
                              `}>

                                {resource.platform}

                              </span>
                            </div>

                            <p className="
                              text-sm
                              leading-6
                              text-slate-200
                            ">

                              {resource.title}

                            </p>

                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapDashboard;