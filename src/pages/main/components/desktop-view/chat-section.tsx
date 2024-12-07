import { useState, useEffect, useRef, Fragment } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IoSend } from "react-icons/io5";
import { FaShareAlt } from "react-icons/fa";
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
import { CustomSelect } from "@/components/custom-select";

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

  const messageTo =
    JSON.parse(localStorage.getItem("messageTo") as string) || "AI";

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [question, setQuestion] = useState<string>("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [questionTo, setQuestionTo] = useState<"AI" | "CHAT">(messageTo);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [typingMsg, setTypingMsg] = useState<string | null>(null);

  const { data, isPending, error } = useGetConversation(
    currentConversation?._id
  );

  const wsRef = useRef<WebSocket | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [question]);

  useEffect(() => {
    localStorage.setItem("messageTo", JSON.stringify(questionTo));
  }, [questionTo]);

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

          if (data.message) {
            toast({ description: data.message });
          }
          setOnlineUsers(data.onlineUsers);

          if (data.type === "notification") {
            setOnlineUsers(data.onlineUsers);
            toast({ description: data.content });
          }

          if (data.type === "joining") {
            queryClient
              .invalidateQueries({
                queryKey: ["getConversation", currentConversation?._id],
              })
              .then(() => {
                setOnlineUsers(data.onlineUsers);
                toast({ description: data.content });
              });
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

        wsRef.current = socket;
      }
    } catch (error) {
      console.error("Failed to initialize WebSocket:", error);
    }
  };

  useEffect(() => {
    if (!currentConversation?._id) return;
    initializeWebSocket();

    if (currentConversation?.participants.length === 1) {
      setQuestionTo("AI");
    }

    return () => {
      wsRef.current?.close();
      setQuestion("");
      setOnlineUsers([]);
    };
  }, [currentConversation?._id]);

  const onSendQuestion = () => {
    if (wsRef.current && question) {
      setIsAiLoading(true);
      wsRef.current.send(
        JSON.stringify({
          data: {
            message: question.trim(),
            userId: userData?.id,
            to: questionTo,
          },
          type: "question",
        })
      );
      setQuestion("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendQuestion();
    }
  };

  useEffect(() => {
    if (!question.length || !wsRef.current || !userData) return;
    wsRef.current.send(
      JSON.stringify({
        data: {
          message: capitalizer(userData.firstName) + " is typing...",
          userId: userData.id,
        },
        type: "typing",
      })
    );
  }, [question]);

  if (error) {
    toast({ description: error.message });
  }

  useEffect(() => {
    if (!data) return;

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  return (
    <section className="w-full h-full flex flex-col">
      {/* Navigation Section */}
      <nav className="sticky top-0 z-10 py-3 px-4 border-b h-12 border-b-gray-300 flex justify-between items-center">
        <div>
          {data?.data?.participants.length > 1 && (
            <CustomSelect
              options={["AI", "CHAT"]}
              selectedLabel="Message to"
              isCapitazed={false}
              placeholder={questionTo}
              setValue={(value) => setQuestionTo(value as "AI" | "CHAT")}
            />
          )}
        </div>
        <div className="flex justify-end items-center gap-2">
          {data?.data?.participants.map(
            (participant: any) =>
              participant._id !== userData?.id && (
                <ParticipantPopOver
                  key={participant._id}
                  userId={participant._id}
                  isOnline={onlineUsers?.includes(participant.email)}
                  conversationId={currentConversation!._id}
                  owner={currentConversation!.owner}
                  firstName={participant.firstName}
                  lastName={participant.lastName}
                  photoURL={participant.photoURL}
                >
                  <div
                    className={cn(
                      "rounded-full w-7 h-7 cursor-pointer",
                      onlineUsers?.includes(participant.email) &&
                        "border border-emerald-500"
                    )}
                  >
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
        </div>
      </nav>

      {/* Messages Section */}
      <div className="flex-grow w-full overflow-y-auto p-4">
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
                      "w-fit rounded-xl p-2 bg-secondary break-words",
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

      {/* Input Section */}
      <div className="w-full px-4 py-2">
        <p className="w-full text-right text-xs text-muted-foreground">
          {typingMsg}
        </p>
        <div className="w-full flex items-center gap-2 border-2 border-secondary rounded-xl px-4 py-2 relative">
          <textarea
            ref={textareaRef}
            className="w-full min-h-[48px] max-h-[160px] overflow-y-auto border-none border-0 bg-transparent"
            value={question}
            onChange={(e) => !isAiLoading && setQuestion(e.target.value)}
            onKeyDown={!isAiLoading ? handleKeyDown : () => null}
            placeholder={
              questionTo === "AI" ? "Message AI..." : "Message Chat..."
            }
            rows={1}
          />
          {isAiLoading ? (
            <div className="animate-spin">
              <FiLoader size={24} />
            </div>
          ) : (
            <button
              className="absolute right-4 hover:text-primary disabled:text-muted disabled:cursor-not-allowed"
              disabled={question.length === 0}
              onClick={onSendQuestion}
            >
              <IoSend size={26} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
