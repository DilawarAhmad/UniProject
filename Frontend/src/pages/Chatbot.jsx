import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "../supabaseClient";

import Sidebar from "../components/chat/Sidebar";
import ChatArea from "../components/chat/ChatArea";

const Chatbot = () => {

  const [user, setUser] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [conversations,
    setConversations] =
    useState([]);

  const [
    activeConversation,
    setActiveConversation,
  ] = useState(null);

  const [input, setInput] =
    useState("");

  const [isTyping,
    setIsTyping] =
    useState(false);

  const chatEndRef =
    useRef(null);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {

    chatEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);

  useEffect(() => {

    if (activeConversation) {

      loadMessages(
        activeConversation
      );

    }

  }, [activeConversation]);

  const getUser =
    async () => {

      const { data } =
        await supabase.auth.getUser();

      if (!data.user)
        return;

      setUser(data.user);

      await loadConversations(
        data.user.id
      );
    };

  const loadConversations =
    async (userId) => {

      const response =
        await fetch(
          `http://localhost:8000/api/chatbot/conversations/${userId}/`
        );

      const data =
        await response.json();

      setConversations(
        data.conversations || []
      );

      if (
        data.conversations?.length > 0 &&
        !activeConversation
      ) {
        setActiveConversation(
          data.conversations[0].id
        );
      }
      else {

        await createConversation(
          userId
        );
      }
    };

  const createConversation = async (
      passedUserId = null
    ) => {

      const uid =
        typeof passedUserId === "string"
          ? passedUserId
          : user?.id;

      if (!uid) return;

      const response = await fetch(
        "http://localhost:8000/api/chatbot/conversations/",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            user_id: uid,
          }),
        }
      );

      const data =
        await response.json();

      const newConversation = {
        id: data.conversation_id,
        title: "New Conversation",
      };

      setConversations((prev) => [
        newConversation,
        ...prev,
      ]);

      setActiveConversation(
        data.conversation_id
      );

      setMessages([
        {
          sender: "bot",
          text:
            "👋 Hi! How can I help today?",
        },
      ]);
    };
  const loadMessages =
    async (
      conversationId
    ) => {

      const response =
        await fetch(
          `http://localhost:8000/api/chatbot/chat/history/${conversationId}/`
        );

      const data =
        await response.json();

      if (
        data.messages &&
        data.messages.length > 0
      ) {
        setMessages(
          data.messages
        );
      } else {
        setMessages([
          {
            sender: "bot",
            text:
              "👋 Hi! How can I help today?",
          },
        ]);
      }
    };

  const handleSend =
    async (e) => {

      e.preventDefault();

      if (
        !input.trim() ||
        isTyping ||
        !activeConversation
      )
        return;

      const text =
        input.trim();

      setMessages(
        (prev) => [
          ...prev,
          {
            sender:
              "user",
            text,
          },
        ]
      );

      setInput("");

      setIsTyping(true);

      try {

        const response =
          await fetch(
            "http://localhost:8000/api/chatbot/chat/",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  {
                    user_id:
                      user.id,

                    conversation_id:
                      activeConversation,

                    name:
                      user
                        .user_metadata
                        ?.full_name ||
                      user.email,

                    message:
                      text,
                  }
                ),
            }
          );

        const data =
          await response.json();

        setMessages(
          (prev) => [
            ...prev,
            {
              sender: "bot",
              text: data.reply,
            },
          ]
        );

        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id ===
              activeConversation &&
            conversation.title ===
              "New Conversation"
              ? {
                  ...conversation,
                  title: text.slice(
                    0,
                    40
                  ),
                }
              : conversation
          )
        );


      } catch (error) {

        console.error(
          error
        );

      } finally {

        setIsTyping(
          false
        );
      }
    };

  return (
    <div className="h-screen flex bg-slate-900 text-white">

      <Sidebar
        user={user}
        conversations={
          conversations
        }
        activeConversation={
          activeConversation
        }
        setActiveConversation={
          setActiveConversation
        }
        createConversation={
          createConversation
        }
      />

      <ChatArea
        messages={
          messages
        }
        input={input}
        setInput={setInput}
        handleSend={
          handleSend
        }
        isTyping={
          isTyping
        }
        chatEndRef={
          chatEndRef
        }
      />

    </div>
  );
};

export default Chatbot;