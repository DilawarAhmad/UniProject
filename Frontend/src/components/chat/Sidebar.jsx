import React from "react";
import { Plus } from "lucide-react";

const Sidebar = ({
  user,
  conversations,
  activeConversation,
  setActiveConversation,
  createConversation,
}) => {
  return (
    <div className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col">

      <div className="p-4">
        <button
            onClick={() => createConversation()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg p-3"
            >
            <Plus size={18} />
            New Conversation
        </button>
      </div>

      <div className="px-4 py-4 border-b border-slate-800">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
            {user?.email?.[0]?.toUpperCase()}
          </div>

          <div>
            <div className="font-medium">
              {user?.user_metadata?.full_name}
            </div>

            <div className="text-xs text-slate-400">
              {user?.email}
            </div>
          </div>

        </div>

      </div>

      <div className="flex-1 overflow-y-auto">

        {conversations.map((conversation) => (

          <button
            key={conversation.id}
            onClick={() =>
              setActiveConversation(
                conversation.id
              )
            }
            className={`w-full text-left px-4 py-3 border-b border-slate-800 hover:bg-slate-800 transition

            ${
              activeConversation ===
              conversation.id
                ? "bg-slate-800"
                : ""
            }
            `}
          >
            <div className="truncate">
              {conversation.title}
            </div>
          </button>

        ))}

      </div>
    </div>
  );
};

export default Sidebar;