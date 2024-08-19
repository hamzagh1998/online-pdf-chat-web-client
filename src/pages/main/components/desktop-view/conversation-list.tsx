import { useEffect, useRef } from "react";

import { ConversationType } from "@/hooks/store/common-types";

import { capitalizer, cn, convertUTCToLocal } from "@/lib/utils";

import { CustomTooltip } from "@/components/custom-tooltip";

type ConversationProps = {
  conversations: ConversationType[];
  currentConversation?: ConversationType;
  setConversationData: (conversation: ConversationType) => void;
};

export function ConversationsList({
  conversations,
  currentConversation,
  setConversationData,
}: ConversationProps) {
  const currentConversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentConversation) return;
    if (currentConversationRef.current) {
      currentConversationRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentConversation]);

  const onUpdateConversation = (conversation: ConversationType) => {
    setConversationData(conversation);
    localStorage.setItem("convId", JSON.stringify(conversation._id));
  };

  const organizeConversations = (conversations: ConversationType[]) => {
    const now = new Date();
    const categories: {
      today: ConversationType[];
      yesterday: ConversationType[];
      thisWeek: ConversationType[];
      lastWeek: ConversationType[];
      thisMonth: ConversationType[];
      [key: string]: ConversationType[];
    } = {
      today: [],
      yesterday: [],
      thisWeek: [],
      lastWeek: [],
      thisMonth: [],
    };

    conversations.forEach((conversation) => {
      const createdAt = new Date(conversation.createdAt);
      const diffTime = now.getTime() - createdAt.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (createdAt.toDateString() === now.toDateString()) {
        categories.today.push(conversation);
      } else if (diffDays <= 1) {
        categories.yesterday.push(conversation);
      } else if (diffDays <= 7) {
        categories.thisWeek.push(conversation);
      } else if (diffDays <= 14) {
        categories.lastWeek.push(conversation);
      } else if (createdAt.getMonth() === now.getMonth()) {
        categories.thisMonth.push(conversation);
      } else {
        const monthYear = createdAt.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        if (!categories[monthYear]) {
          categories[monthYear] = [];
        }
        categories[monthYear].push(conversation);
      }
    });

    return categories;
  };

  return (
    <div className="w-full h-full">
      {Object.entries(organizeConversations(conversations)).map(
        ([category, conversations]) =>
          conversations.length > 0 && (
            <div key={category} className="space-y-2 mb-8">
              <p className="text-sm font-bold">{capitalizer(category)}</p>
              {conversations.map((conversation) => (
                <div
                  key={conversation._id}
                  ref={
                    currentConversation?._id === conversation._id
                      ? currentConversationRef
                      : null
                  }
                  className={cn(
                    "w-full p-3 space-y-2 rounded-xl hover:bg-secondary",
                    {
                      "bg-secondary":
                        currentConversation?._id === conversation._id,
                    }
                  )}
                  onClick={() => onUpdateConversation(conversation)}
                >
                  <CustomTooltip text={conversation.name}>
                    <p className="w-fit text-sm max-w-full line-clamp-1 hover:cursor-pointer hover:underline">
                      {conversation.name}
                    </p>
                  </CustomTooltip>
                  <p className="text-xs">
                    {convertUTCToLocal(conversation.createdAt.toString())}
                  </p>
                </div>
              ))}
            </div>
          )
      )}
    </div>
  );
}
