import { useState, useEffect, useRef, Fragment } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IoSend } from "react-icons/io5";
import { FaChevronUp, FaShareAlt } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

import { getAuth } from "firebase/auth";

import { useConversationStore } from "@/hooks/store/use-conversation-store";
import { useUserStore } from "@/hooks/store/use-user-store";

import { useGetConversation } from "@/services/conversation/queries";

import { CustomTooltip } from "@/components/custom-tooltip";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { ParticipantPopOver } from "@/components/participant-pop-over";
import { ShareDialog } from "@/components/share-dialog";

import { capitalizer, cn, convertUTCToLocal } from "@/lib/utils";

import { MessageType } from "../../types";

function formatMessageContent(content: string): React.ReactNode {
  // Regular Expression to detect patterns like "* **Title:**", "**Title:**", etc.
  const pattern = /(\*+)?\s?\*\*([^\*:]+):\*\*\s*(.+?)\s?/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    const [, sizeMarker = "", title, text] = match;

    // Determine text size based on the number of leading asterisks (*)
    const textSizeClass =
      {
        "***": "text-lg",
        "**": "text-xl",
        "*": "text-2xl",
      }[sizeMarker] || "text-base"; // Default to "text-base" if no size marker

    // Add text before the matched pattern
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }

    // Add formatted title and text
    parts.push(
      <Fragment key={match.index}>
        <br />
        <strong className={textSizeClass}>{title}:</strong>
        <br />
        <span>{text}</span>
      </Fragment>
    );

    lastIndex = pattern.lastIndex;
  }

  // Add remaining text if any
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts.length > 0 ? parts : content;
}

export function ChatSection() {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { userData } = useUserStore();
  const { currentConversation } = useConversationStore();

  const messagesStartRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [question, setQuestion] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [typingMsg, setTypingMsg] = useState<string | null>(null);

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
            : import.meta.env.VITE_REACT_APP_WS_BASE_PROD_URL) +
            "?token=" +
            encodeURIComponent(token) +
            "&conversationId=" +
            currentConversation._id
        );

        socket.onopen = () => {
          toast({ description: "Connection established!" });
        };

        socket.onerror = (error) => {
          toast({ description: "WebSocket error: " + error });
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.type === "notification") {
            toast({ description: data.content });
          }

          if (data.type === "joining") {
            queryClient
              .invalidateQueries({
                queryKey: ["getConversation", currentConversation?._id],
              })
              .then(() => toast({ description: data.content }));
          }

          if (data.type === "messages") {
            queryClient
              .invalidateQueries({
                queryKey: ["getConversation", currentConversation?._id],
              })
              .then(() => setIsAiLoading(false));
          }

          if (data.type === "typing") {
            setTypingMsg(data.content);
            const timeoutId = setTimeout(() => setTypingMsg(null), 1500);
            return () => clearTimeout(timeoutId);
          }
        };

        socket.onclose = () => {
          toast({ description: "Connection closed" });
        };

        setWs(socket);
      }
    } catch (error) {
      console.error("Failed to initialize WebSocket:", error);
    }
  };

  const onSendQuestion = () => {
    if (ws && question) {
      setIsAiLoading(true);
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
    if (!question.length || !ws || !userData) return;
    ws.send(
      JSON.stringify({
        data: {
          message: capitalizer(userData.firstName) + " is typing...",
          userId: userData.id,
        },
        type: "typing",
      })
    );
  }, [question]);

  useEffect(() => {
    if (!currentConversation?._id) return;

    initializeWebSocket();

    return () => {
      ws?.close(); // Clean up on component unmount
    };
  }, [currentConversation?._id]);

  if (error) {
    toast({ description: error.message });
  }

  useEffect(() => {
    if (!data) return;

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  const onGoUp = () => {
    if (messagesStartRef.current) {
      messagesStartRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full h-full flex flex-col">
      <div ref={messagesStartRef} />
      <nav className="py-3 px-4 border-b h-12 border-b-gray-300 flex justify-end items-center gap-2">
        {data?.data?.participants.map(
          (participant: any) =>
            participant._id !== userData?.id && (
              <ParticipantPopOver
                userId={participant._id}
                conversationId={currentConversation!._id}
                owner={currentConversation!.owner}
                firstName={participant.firstName}
                lastName={participant.lastName}
                photoURL={participant.photoURL}
              >
                <div className="rounded-full w-7 h-7 cursor-pointer">
                  <CustomTooltip
                    text={participant.firstName + " " + participant.lastName}
                  >
                    <img
                      src={participant.photoURL}
                      alt="AV"
                      className="rounded-full"
                    />
                  </CustomTooltip>
                </div>
              </ParticipantPopOver>
            )
        )}
        {userData?.id === currentConversation?.owner && (
          <ShareDialog>
            <CustomTooltip text="Share conversation">
              <button>
                <FaShareAlt size={24} />
              </button>
            </CustomTooltip>
          </ShareDialog>
        )}
      </nav>
      <div className="w-full h-full overflow-y-scroll p-4">
        {isPending && currentConversation?._id ? (
          <p className="text-lg text-center w-full mt-auto text-muted-foreground">
            Loading conversation...
          </p>
        ) : (
          data?.data?.messages?.map((message: MessageType) => (
            <div
              key={message._id}
              className={cn(
                "w-full flex flex-col gap-2",
                message._id === userData?.id ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "w-full flex space-y-4",
                  message.sender._id === userData?.id
                )}
              >
                <div className="rounded-xl w-full">
                  <div
                    className={cn(
                      "flex gap-2 items-center w-full text-xs rounded-xl p-2 text-muted-foreground",
                      message.sender._id === userData?.id &&
                        !message.isAiResponse
                        ? "justify-end"
                        : "justify-start"
                    )}
                  >
                    {message.isAiResponse ? (
                      <img
                        src="./icon.png"
                        alt="AI"
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <img
                        src={message.sender.photoURL}
                        alt="AV"
                        className="w-5 h-5 rounded-full"
                      />
                    )}
                    <p>
                      {capitalizer(
                        message.isAiResponse
                          ? "AI"
                          : (message.sender.firstName || "removed") +
                              " " +
                              (message.sender.lastName || "user") +
                              " - " +
                              convertUTCToLocal(message.timestamp)
                      )}
                    </p>
                  </div>
                  <p
                    className={cn(
                      "w-fit rounded-xl p-2 bg-secondary",
                      message.sender._id === userData?.id &&
                        !message.isAiResponse
                        ? "float-end bg-primary text-white"
                        : "float-start"
                    )}
                  >
                    {message.isAiResponse
                      ? formatMessageContent(message.content)
                      : message.content}
                  </p>
                </div>
              </div>
              <Separator orientation="horizontal" />
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="w-full h-16 px-4">
        <p className="w-full text-right text-xs text-muted-foreground">
          {typingMsg}
        </p>
        {isAiLoading ? (
          <div className="w-full flex justify-center items-center gap-2">
            <div className="animate-spin">
              <FiLoader size={24} />
            </div>
            <p>Generating response...</p>
          </div>
        ) : (
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
        )}
      </div>
      {/* <div
        className="xl:hidden sticky bottom-24 right-6 p-3 rounded-full w-fit h-fit group-hover:flex justify-center items-center cursor-pointer left-96 bg-secondary hover:opacity-80"
        onClick={onGoUp}
      >
        <FaChevronUp size={16} />
      </div> */}
    </section>
  );
}
