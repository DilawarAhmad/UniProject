// import React, { useState } from "react";
// import { FileText, Sparkles, Github } from "lucide-react";
// import { supabase } from "../supabaseClient";
// import { useNavigate } from "react-router-dom";

// const API_URL = "http://127.0.0.1:8000/api";

// const ResumeUpload = () => {
//   const navigate = useNavigate();
//   const [file, setFile] = useState(null);
//   const [manualSkills, setManualSkills] = useState("");
//   const [githubUser, setGithubUser] = useState("");   // ⭐ New
//   const [loading, setLoading] = useState(false);

//   const handleFile = (e) => setFile(e.target.files[0]);

//   // ✅ Upload to Supabase
//   const uploadToSupabase = async () => {
//   const { data } = await supabase.auth.getUser();
//   const user = data.user;

//   if (!user) {
//     alert("Please login first");
//     throw new Error("User not authenticated");
//   }

//   const { data: existingUser, error } = await supabase
//   .from("user_profiles")
//   .select("user_id")
//   .eq("user_id", user.id)
//   .maybeSingle();
// if (error && error.code !== 'PGRST116') {
//   // PGRST116 = no rows found (safe to insert)
//   throw error;
// }

// // If no existingUser, insert new
// if (!existingUser) {
//   const { error: insertError } = await supabase.from("user_profiles").insert({
//     user_id: user.id,
//     full_name: user.user_metadata?.full_name || "",
//   });

//   if (insertError) throw insertError;
// }


//   const uniqueName = `${Date.now()}_${file.name}`;
//   const path = `${user.id}/${uniqueName}`;

//   // Upload file to storage
//   const { error: uploadError } = await supabase.storage
//     .from("resumes")
//     .upload(path, file, { upsert: true });
//   if (uploadError) throw uploadError;

//   // Create signed URL
//   const { data: signedUrlData, error: urlError } = await supabase.storage
//     .from("resumes")
//     .createSignedUrl(path, 60 * 60 * 24 * 7);
//   if (urlError) throw urlError;

//   // Upsert resume record (no fallback, no updated_at)
//   const { error: dbError } = await supabase
//     .from("resumes")
//     .upsert(
//       {
//         user_id: user.id,
//         resume_url: signedUrlData.signedUrl,
//         parsed_text: "",
//       },
//       { onConflict: "user_id" }
//     );

//   if (dbError) throw dbError;

//   return { userId: user.id, resumeURL: signedUrlData.signedUrl };
// };

//   // ✅ Send to Django backend
//   const sendToBackend = async (body, endpoint) => {
//     const res = await fetch(`${API_URL}/${endpoint}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });

//     if (!res.ok) {
//       const text = await res.text();
//       console.error("Backend error:", text);
//       throw new Error(`Backend returned ${res.status}`);
//     }

//     return res.json();
//   };

//   // ✅ Main submit handler
//   const handleSubmit = async () => {
//     setLoading(true);

//     try {
//       const { data } = await supabase.auth.getUser();
//       const user = data.user;
//       if (!user) return alert("Login first!");

//       if (file) {
//         const { userId, resumeURL } = await uploadToSupabase();
//         const result = await sendToBackend(
//           { user_id: userId, resume_url: resumeURL },
//           "process-resume/"
//         );

//         localStorage.setItem("userSkills", JSON.stringify(result.skills));
//         localStorage.setItem("skillScore", result.score);
//       } else {
//         const skillsArr = manualSkills
//           .split(",")
//           .map((s) => s.trim())
//           .filter((s) => s);
//         const result = await sendToBackend(
//           { user_id: user.id, skills: skillsArr },
//           "manual-skills/"
//         );

//         localStorage.setItem("userSkills", JSON.stringify(result.skills));
//         localStorage.setItem("skillScore", result.score);
//       }

//       navigate("/dashboard");
//     } catch (err) {
//       console.error("❌ Upload failed:", err);
//       alert("Error — try again");
//     } finally {
//       setLoading(false);
//     }
//   };
//   // ======================================================
//   // 4️⃣ GITHUB SKILL FETCH LOGIC — NEW
//   // ======================================================
//   const handleGithubImport = async () => {
//   if (!githubUser.trim()) {
//     alert("Enter a GitHub username");
//     return;
//   }

//   const { data } = await supabase.auth.getUser();
//   const user = data.user;
//   if (!user) return alert("Login first!");

//   setLoading(true);

//   try {
//     await sendToBackend(
//       {
//         github_username: githubUser.trim(),
//         user_id: user.id
//       },
//       "github-skills/"
//     );

//     // navigate("/dashboard"); // dashboard loads DB skills anyway
//   } catch (err) {
//     console.error("GitHub fetch error:", err);
//     alert("Failed to fetch GitHub skills");
//   }

//   setLoading(false);
// };



//   return (
//     <div className="min-h-screen flex flex-col items-center bg-slate-900 text-white p-6">
//       <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
//         <FileText className="text-indigo-400" /> Build Your Career Profile
//       </h2>

//       <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-xl space-y-6 shadow-lg">
//         <input
//           type="file"
//           accept=".pdf,.doc,.docx"
//           onChange={handleFile}
//           className="bg-slate-700 p-3 w-full rounded-xl"
//           />
//         <div className="text-center">Choose Resume or Linkedin</div>
//         <div className="text-center text-gray-400">OR</div>

//         <textarea
//           rows="3"
//           className="w-full bg-slate-700 p-3 rounded-xl"
//           placeholder="Python, React, SQL"
//           value={manualSkills}
//           onChange={(e) => setManualSkills(e.target.value)}
//         />
        
//         {/* -------------------------------------------------- */}
//         {/* ⭐⭐⭐ GITHUB SECTION ADDED HERE ⭐⭐⭐ */}
//         {/* -------------------------------------------------- */}

//         <div className="text-center text-gray-400">OR</div>

//         <input
//           type="text"
//           placeholder="GitHub Username"
//           value={githubUser}
//           onChange={(e) => setGithubUser(e.target.value)}
//           className="bg-slate-700 p-3 w-full rounded-xl"
//         />

//         <button
//           onClick={handleGithubImport}
//           disabled={loading}
//           className="bg-gray-700 hover:bg-gray-600 w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
//         >
//           <Github size={18} /> Import from GitHub
//         </button>
//       </div>
//       <button
//           disabled={loading || (!file && !manualSkills.trim()) && !githubUser.trim()}
//           onClick={handleSubmit}
//           className="bg-indigo-600 hover:bg-indigo-700 w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
//         >
//           {loading ? "Processing..." : (<><Sparkles size={18} /> Generate Profile</>)}
//         </button>
//     </div>
//   );
// };

// export default ResumeUpload;


import React, { useState } from "react";
import { FileText, Sparkles, Github } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

const ResumeUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [manualSkills, setManualSkills] = useState("");
  const [githubUser, setGithubUser] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => setFile(e.target.files[0]);

  // ✅ Upload file to Supabase
  const uploadToSupabase = async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      alert("Please login first");
      throw new Error("User not authenticated");
    }

    const { data: existingUser, error } = await supabase
      .from("user_profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") throw error;

    if (!existingUser) {
      const { error: insertError } = await supabase.from("user_profiles").insert({
        user_id: user.id,
        full_name: user.user_metadata?.full_name || "",
      });
      if (insertError) throw insertError;
    }

    const uniqueName = `${Date.now()}_${file.name}`;
    const path = `${user.id}/${uniqueName}`;

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(path, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from("resumes")
      .createSignedUrl(path, 60 * 60 * 24 * 7);
    if (urlError) throw urlError;

    return signedUrlData.signedUrl;
  };

  // ✅ Send data to backend
  const sendToBackend = async (body) => {
    const res = await fetch(`${API_URL}/generate-profile/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend error:", text);
      throw new Error(`Backend returned ${res.status}`);
    }

    return res.json();
  };

  // ✅ Handle submit (resume + manual + GitHub)
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return alert("Login first!");

      let resumeURL = null;
      if (file) {
        resumeURL = await uploadToSupabase();
      }

      const manualSkillsList = manualSkills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);

      const body = {
        user_id: user.id,
        resume_url: resumeURL,
        skills: manualSkillsList,
        github_username: githubUser.trim() || null,
      };

      const result = await sendToBackend(body);

      // Save to localStorage for dashboard
      localStorage.setItem("userSkills", JSON.stringify(result.skills));
      localStorage.setItem("skillScore", result.score);

      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Error — try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FileText className="text-indigo-400" /> Build Your Career Profile
      </h2>

      <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-xl space-y-6 shadow-lg">
        {/* Resume Upload */}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFile}
          className="bg-slate-700 p-3 w-full rounded-xl"
        />
        <div className="text-center text-gray-400">OR</div>

        {/* Manual Skills */}
        <textarea
          rows="3"
          className="w-full bg-slate-700 p-3 rounded-xl"
          placeholder="Python, React, SQL"
          value={manualSkills}
          onChange={(e) => setManualSkills(e.target.value)}
        />

        <div className="text-center text-gray-400">OR</div>

        {/* GitHub Username */}
        <input
          type="text"
          placeholder="GitHub Username"
          value={githubUser}
          onChange={(e) => setGithubUser(e.target.value)}
          className="bg-slate-700 p-3 w-full rounded-xl"
        />
      </div>

      {/* Single Generate Profile Button */}
      <button
        disabled={loading || (!file && !manualSkills.trim() && !githubUser.trim())}
        onClick={handleSubmit}
        className="bg-indigo-600 hover:bg-indigo-700 w-full max-w-xl py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mt-6"
      >
        {loading ? "Processing..." : (<><Sparkles size={18} /> Generate Profile</>)}
      </button>
    </div>
  );
};

export default ResumeUpload;

