import React, { useState } from "react";
import { Upload, FileText, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResumeUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [manualSkills, setManualSkills] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleGenerateProfile = async () => {
    setLoading(true);

    // Dummy simulation → in backend you'll parse resume or skills 
    setTimeout(() => {
      const skills = manualSkills
        ? manualSkills.split(",").map((s) => s.trim())
        : ["React", "Node.js", "SQL"]; // Mock parsed skills
      
      localStorage.setItem("userSkills", JSON.stringify(skills));
      localStorage.setItem("skillScore", 78); // temporary dummy score

      navigate("/dashboard");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-900 text-white p-6">
      
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FileText className="text-indigo-400" /> Build Your Career Profile
      </h2>

      <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-xl shadow-lg space-y-6">

        {/* Resume Upload */}
        <div>
          <label className="block text-lg font-semibold mb-3">Upload Resume</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="w-full bg-slate-700 p-3 rounded-xl cursor-pointer file:bg-indigo-600 file:text-white"
          />
          {file && <p className="text-sm text-gray-300 mt-2">{file.name}</p>}
        </div>

        <div className="text-center text-gray-500">OR</div>

        {/* Manual Skill Entry */}
        <div>
          <label className="block text-lg font-semibold mb-3">Enter Skills Manually</label>
          <textarea
            rows="3"
            placeholder="e.g. Python, React, SQL"
            value={manualSkills}
            onChange={(e) => setManualSkills(e.target.value)}
            className="w-full bg-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          disabled={loading || (!file && !manualSkills.trim())}
          onClick={handleGenerateProfile}
          className="w-full bg-indigo-500 hover:bg-indigo-600 py-3 rounded-xl text-lg font-semibold flex justify-center items-center gap-2 disabled:bg-slate-600"
        >
          {loading ? "Generating Profile..." : <>
            <Sparkles size={18}/> Generate Skill Profile
          </>}
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;
