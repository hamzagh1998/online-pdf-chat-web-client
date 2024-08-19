import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { FaLock, FaShareAlt } from "react-icons/fa";

import { useConversationStore } from "@/hooks/store/use-conversation-store";

import { CustomTooltip } from "@/components/custom-tooltip";

export function ChatSection() {
  const { currentConversation } = useConversationStore();

  const [search, setSearch] = useState("");

  const ws = new WebSocket(
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_REACT_APP_WS_BASE_DEV_URL
      : import.meta.env.VITE_REACT_APP_WS_BASE_PRO_URL
  );

  ws.onopen = () => {
    console.log("Connected to WebSocket");
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
  };

  if (!currentConversation) {
    return null;
  }

  const onSendQuestion = () => {
    console.log(search);
  };

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
          <CustomTooltip text="share conversation">
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSendQuestion()}
            placeholder="Ask your question"
          />
          <button
            className="w-fit hover:text-primary disabled:text-muted disabled:cursor-not-allowed"
            disabled={search.length === 0}
            onClick={onSendQuestion}
          >
            <IoSend size={26} />
          </button>
        </div>
      </div>
    </section>
  );
}
