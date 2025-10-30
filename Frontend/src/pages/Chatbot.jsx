import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi Adil! I’m your AI Career Assistant. I can help you explore skills, roles, and personalized learning paths. What would you like to know today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom when new message appears
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI typing delay (replace with backend call later)
    setTimeout(() => {
      const dummyResponses = [
        "Based on your resume, I’d suggest focusing on improving your backend development skills — FastAPI and database design seem promising!",
        "React proficiency looks strong. Would you like me to recommend some advanced full-stack projects?",
        "The data shows a rising demand for Machine Learning Engineers. Should I generate a learning roadmap for that role?",
        "You can enhance your employability by contributing to open-source projects on GitHub. I can show trending repos if you like.",
      ];

      const randomResponse =
        dummyResponses[Math.floor(Math.random() * dummyResponses.length)];

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: randomResponse },
      ]);
      setIsTyping(false);
    }, 1500);

    // Future: Replace this with your real backend call
    /*
    const response = await fetch("http://localhost:8000/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await response.json();
    setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    setIsTyping(false);
    */
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 py-4 shadow-md flex items-center justify-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Bot className="text-indigo-400" /> Career Guidance Assistant
        </h1>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] p-4 rounded-2xl shadow-md ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-slate-800 text-gray-200 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-gray-400 px-4 py-3 rounded-2xl">
              <Loader2 className="inline animate-spin mr-2" size={16} />
              Typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSend}
        className="bg-slate-800 p-4 border-t border-slate-700 flex items-center gap-4"
      >
        <User className="text-gray-400" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about your career path..."
          className="flex-1 bg-slate-700 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-1 transition-all"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
