import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IoMdExit } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";

import { useUserStore } from "@/hooks/store/use-user-store";

import {
  useDeleteConversation,
  useRemoveUserFromConversation,
} from "@/services/conversation/queries";

import { toast } from "@/components/ui/use-toast";
import { ConversationType } from "@/hooks/store/common-types";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { CustomTooltip } from "@/components/custom-tooltip";

import { capitalizer, cn, convertUTCToLocal } from "@/lib/utils";
import { deleteFileFromUrl } from "@/lib/firebase/storage/delete-file";

type ConversationProps = {
  conversations: ConversationType[];
  currentConversation?: ConversationType;
  setConversationData: (conversation: ConversationType) => void;
  setIsSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ConversationsList({
  conversations,
  currentConversation,
  setConversationData,
  setIsSidebarOpen,
}: ConversationProps) {
  const currentConversationRef = useRef<HTMLDivElement>(null);

  const { userData } = useUserStore();

  const queryClient = useQueryClient();

  const removeUserFromConversation = useRemoveUserFromConversation();

  const deleteConversation = useDeleteConversation();

  const onRemoveUserFromConversation = async (conversationId: string) => {
    try {
      await removeUserFromConversation.mutateAsync({
        conversationId,
        userId: userData?.id!,
      });
      queryClient
        .invalidateQueries({
          queryKey: ["userData"],
        })
        .then(() =>
          toast({
            description: `You have been removed from the conversation!`,
          })
        );
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteConversation = async (conversation: ConversationType) => {
    try {
      await deleteConversation.mutateAsync(conversation!._id);
      deleteFileFromUrl(conversation!.pdfFileURL);
      queryClient
        .invalidateQueries({
          queryKey: ["userData"],
        })
        .then(() =>
          toast({
            description: `Conversation has been deleted!`,
          })
        );
    } catch (error) {
      console.error(error);
    }
  };

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
    localStorage.setItem("convId", JSON.stringify(conversation!._id));
    setIsSidebarOpen && setIsSidebarOpen(false);
  };

  const organizeConversations = (conversations: ConversationType[]) => {
    const now = new Date();
    const categories: {
      today: ConversationType[];
      yesterday: ConversationType[];
      "this Week": ConversationType[];
      "last Week": ConversationType[];
      "this Month": ConversationType[];
      [key: string]: ConversationType[];
    } = {
      today: [],
      yesterday: [],
      "this Week": [],
      "last Week": [],
      "this Month": [],
    };

    conversations.forEach((conversation) => {
      const createdAt = new Date(conversation!.createdAt);
      const diffTime = now.getTime() - createdAt.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (createdAt.toDateString() === now.toDateString()) {
        categories.today.push(conversation);
      } else if (diffDays <= 1) {
        categories.yesterday.push(conversation);
      } else if (diffDays <= 7) {
        categories["this Week"].push(conversation);
      } else if (diffDays <= 14) {
        categories["last Week"].push(conversation);
      } else if (createdAt.getMonth() === now.getMonth()) {
        categories["this Month"].push(conversation);
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
                  key={conversation!._id}
                  ref={
                    currentConversation?._id === conversation!._id
                      ? currentConversationRef
                      : null
                  }
                  className={cn(
                    " w-full p-3 space-y-2 rounded-xl hover:bg-secondary flex justify-between items-center gap-2",
                    {
                      "bg-secondary":
                        currentConversation?._id === conversation!._id,
                    }
                  )}
                >
                  {/* Main Content */}
                  <div onClick={() => onUpdateConversation(conversation)}>
                    <CustomTooltip text={conversation!.name}>
                      <p className="w-fit text-sm max-w-full line-clamp-1 hover:cursor-pointer hover:underline">
                        {conversation!.name.length > 15
                          ? conversation!.name.substring(0, 15) + "..."
                          : conversation!.name}
                      </p>
                    </CustomTooltip>
                    <p className="text-xs">
                      {convertUTCToLocal(conversation!.createdAt.toString())}
                    </p>
                  </div>

                  {/* Actions Visible on Hover */}
                  <div className="w-fit flex justify-center items-center gap-2">
                    {conversation?.owner === userData?.id ? (
                      <DeleteConfirmationDialog
                        title="Deleting Conversation"
                        description="Are you absolutely sure you to delete this conversation, This action cannot be undone!"
                        onConfirm={() => onDeleteConversation(conversation)}
                      >
                        <button>
                          <CustomTooltip text="Delete Conversation">
                            <div className="cursor-pointer">
                              <FaTrashAlt
                                className="hover:text-destructive"
                                size={16}
                              />
                            </div>
                          </CustomTooltip>
                        </button>
                      </DeleteConfirmationDialog>
                    ) : (
                      <DeleteConfirmationDialog
                        title="Leaving Conversation"
                        description="Are you absolutely sure you to leave this conversation, This action cannot be undone!"
                        onConfirm={() =>
                          onRemoveUserFromConversation(conversation!._id)
                        }
                      >
                        <button>
                          <CustomTooltip text="Leave Conversation">
                            <div className="cursor-pointer">
                              <IoMdExit
                                className="hover:text-sky-500"
                                size={21}
                              />
                            </div>
                          </CustomTooltip>
                        </button>
                      </DeleteConfirmationDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
      )}
    </div>
  );
}
