import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  Send,
  Bot,
  Loader2,
} from "lucide-react";

import { supabase } from "../supabaseClient";

const Chatbot = () => {
  const [user, setUser] = useState(null);

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [isTyping, setIsTyping] =
    useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const getUser = async () => {
    try {
      const { data, error } =
        await supabase.auth.getUser();

      if (error) {
        console.error(error);
        return;
      }

      if (data.user) {
        setUser(data.user);

        await loadChatHistory(
          data.user.id,
          data.user.user_metadata
            ?.full_name
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadChatHistory = async (
    userId,
    fullName
  ) => {
    if (!userId) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/chatbot/chat/history/${userId}/`
      );

      const data =
        await response.json();

      if (
        data.messages &&
        data.messages.length > 0
      ) {
        setMessages(data.messages);
      } else {
        setMessages([
          {
            sender: "bot",
            text: `👋 Hi ${
              fullName || "there"
            }! How can I help today?`,
          },
        ]);
      }
    } catch (err) {
      console.error(err);

      setMessages([
        {
          sender: "bot",
          text:
            "👋 Welcome! How can I help today?",
        },
      ]);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!user) return;

    if (!input.trim()) return;

    const currentMessage =
      input.trim();

    const userMessage = {
      sender: "user",
      text: currentMessage,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput("");

    setIsTyping(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/chatbot/chat/",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            user_id: user.id,

            name:
              user.user_metadata
                ?.full_name ||

              user.email,

            message:
              currentMessage,
          }),
        }
      );

      const data =
        await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            data.reply ||
            "No response received.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "Something went wrong.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col text-white">
      <header className="bg-slate-800 p-4 shadow-md">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Bot />
          Career Assistant
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(
          (msg, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-xl ${
                  msg.sender ===
                  "user"
                    ? "bg-indigo-600"
                    : "bg-slate-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          )
        )}

        {isTyping && (
          <div className="flex">
            <div className="bg-slate-800 px-4 py-3 rounded-xl">
              <Loader2
                className="animate-spin inline mr-2"
                size={16}
              />
              Thinking...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-4 bg-slate-800 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) =>
            setInput(
              e.target.value
            )
          }
          placeholder="Ask anything..."
          className="flex-1 bg-slate-700 p-3 rounded-lg outline-none"
        />

        <button
          type="submit"
          disabled={
            isTyping || !user
          }
          className="bg-indigo-600 px-4 rounded-lg disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;