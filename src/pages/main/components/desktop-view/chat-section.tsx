import { useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { FaLock, FaShareAlt } from "react-icons/fa";

import { getAuth } from "firebase/auth";

import { useConversationStore } from "@/hooks/store/use-conversation-store";
import { useUserStore } from "@/hooks/store/use-user-store";

import { useGetConversation } from "@/services/conversation/queries";

import { CustomTooltip } from "@/components/custom-tooltip";
import { useToast } from "@/components/ui/use-toast";

import { MessageType } from "../../types";

export function ChatSection() {
  const { currentConversation } = useConversationStore();
  const { userData } = useUserStore();

  const { toast } = useToast();

  const [question, setQuestion] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [users, setUsers] = useState<string[]>([]);

  const { data, isPending, error } = useGetConversation(
    currentConversation?._id
  );

  const initializeWebSocket = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && currentConversation?._id) {
        const token = await user.getIdToken();
        const socket = new WebSocket(
          (import.meta.env.MODE === "development"
            ? import.meta.env.VITE_REACT_APP_WS_BASE_DEV_URL
            : import.meta.env.VITE_REACT_APP_WS_BASE_PRO_URL) +
            "?token=" +
            encodeURIComponent(token) +
            "&conversationId=" +
            currentConversation._id
        );

        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "notification") {
            toast({ description: data.content });
          } else if (data.type === "messages") {
            setMessages(data.content.messages);
            setUsers(data.content.users);
          }
        };

        socket.onclose = () => {
          console.log("WebSocket connection closed");
        };

        setWs(socket);
      }
    } catch (error) {
      console.error("Failed to initialize WebSocket:", error);
    }
  };

  const onSendQuestion = () => {
    if (ws && question) {
      ws.send(
        JSON.stringify({
          data: { message: question, userId: userData?.id },
          type: "question",
        })
      );
      setQuestion("");
    }
  };

  useEffect(() => {
    if (!currentConversation?._id) return;
    initializeWebSocket();
    return () => {
      ws?.close();
    };
  }, [currentConversation?._id]);

  if (!currentConversation) {
    return null;
  }

  if (error) {
    return toast({ description: error.message });
  }

  return (
    <section className="w-full h-full flex flex-col">
      <nav className="py-3 px-4 border-b border-b-gray-300 flex justify-end items-center">
        {currentConversation.isPublic ? (
          <CustomTooltip text="Stop sharing">
            <button>
              <FaLock size={24} />
            </button>
          </CustomTooltip>
        ) : (
          <CustomTooltip text="Share conversation">
            <button>
              <FaShareAlt size={24} />
            </button>
          </CustomTooltip>
        )}
      </nav>
      <div className="w-full h-full overflow-y-scroll p-4"></div>
      <div className="w-full h-16 px-4">
        <div className="w-full h-full flex justify-between items-center gap-2 rounded-xl px-4 border-2 border-secondary">
          <input
            type="text"
            className="w-full h-full border-none border-0 outline-none bg-transparent"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSendQuestion()}
            placeholder="Ask your question"
          />
          <button
            className="w-fit hover:text-primary disabled:text-muted disabled:cursor-not-allowed"
            disabled={question.length === 0}
            onClick={onSendQuestion}
          >
            <IoSend size={26} />
          </button>
        </div>
      </div>
    </section>
  );
}
