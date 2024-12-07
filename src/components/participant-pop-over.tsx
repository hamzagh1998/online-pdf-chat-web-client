import { useQueryClient } from "@tanstack/react-query";
import { HiUserRemove } from "react-icons/hi";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import { useRemoveUserFromConversation } from "@/services/conversation/queries";

import { useUserStore } from "@/hooks/store/use-user-store";

import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { Badge } from "./ui/badge";
import { PopoverClose } from "@radix-ui/react-popover";

import { capitalizer, cn } from "@/lib/utils";

type ParticipantPopOverProps = {
  userId: string;
  conversationId: string;
  isOnline: boolean;
  owner: string;
  firstName: string;
  lastName: string;
  photoURL: string;
  children: React.ReactNode;
};

export function ParticipantPopOver({
  userId,
  conversationId,
  isOnline,
  owner,
  firstName,
  lastName,
  photoURL,
  children,
}: ParticipantPopOverProps) {
  const { userData } = useUserStore();

  const queryClient = useQueryClient();

  const removeUserFromConversation = useRemoveUserFromConversation();

  const onRemoveUserFromConversation = async () => {
    try {
      await removeUserFromConversation.mutateAsync({
        conversationId,
        userId,
      });
      queryClient
        .invalidateQueries({
          queryKey: ["getConversation", conversationId],
        })
        .then(() =>
          toast({
            description: `${firstName} has been removed from the conversation!`,
          })
        );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="xl:w-52 flex justify-center items-center flex-col rounded-lg p-4 w-full bg-secondary space-y-4">
        <div className="w-full flex justify-start items-start gap-2">
          <img src={photoURL} className="w-9 h-9 rounded-full" alt="AV" />
          <div>
            <p className="font-bold">
              {capitalizer(firstName + " " + lastName)}
            </p>
            <p className="font-bold text-xs flex justify-start items-center gap-1">
              <div
                className={cn(
                  "h-3 w-3 rounded-full",
                  isOnline ? "bg-emerald-500" : "bg-gray-500"
                )}
              />
              {isOnline ? "online" : "offline"}
            </p>
            <Badge
              className="text-xs"
              variant={userId === owner ? "default" : "outline"}
            >
              {userId === owner ? "Owner" : "Participant"}
            </Badge>
          </div>
        </div>

        {
          // Only the owner can remove participants
          owner === userData?.id && (
            <PopoverClose>
              <Button
                size="sm"
                variant="destructive"
                className="font-bold"
                onClick={onRemoveUserFromConversation}
              >
                <HiUserRemove size={16} />
                &ensp; Remove from chat
              </Button>
            </PopoverClose>
          )
        }
      </PopoverContent>
    </Popover>
  );
}
