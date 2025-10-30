import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import ResumeUpload from "./pages/ResumeUpload";
import Roadmap from "./pages/Roadmap";
import Chatbot from "./pages/Chatbot";
import JobAnalytics from "./pages/JobAnalytics";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<ResumeUpload />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/analytics" element={<JobAnalytics />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
