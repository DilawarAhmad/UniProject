import React from "react";

import {
  Send,
  Bot,
  Loader2,
} from "lucide-react";

const ChatArea = ({
  messages,
  input,
  setInput,
  handleSend,
  isTyping,
  chatEndRef,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-900">

      <header className="bg-slate-800 p-4 border-b border-slate-700">

        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          <Bot size={22} />
          Career Assistant
        </h1>

      </header>

      <div className="flex-1 overflow-y-auto p-6">

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
                className={`max-w-[75%] whitespace-pre-wrap px-4 py-3 rounded-2xl

                ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-100"
                }
                `}
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
        className="p-4 border-t border-slate-800 flex gap-2 bg-slate-900"
      >
        <input
          value={input}
          onChange={(e) =>
            setInput(
              e.target.value
            )
          }
          placeholder="Ask anything..."
          className="flex-1 bg-slate-800 p-3 rounded-xl outline-none text-white"
        />

        <button
          disabled={isTyping}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 rounded-xl"
        >
          <Send size={18} />
        </button>
      </form>

    </div>
  );
};

export default ChatArea;