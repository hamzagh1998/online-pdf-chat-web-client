import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useRemoveUserFromConversation } from "@/services/conversation/queries";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "./ui/use-toast";
import { useUserStore } from "@/hooks/store/use-user-store";
import { Badge } from "./ui/badge";
import { PopoverClose } from "@radix-ui/react-popover";

import { capitalizer } from "@/lib/utils";

type ParticipantPopOverProps = {
  userId: string;
  conversationId: string;
  owner: string;
  firstName: string;
  lastName: string;
  photoURL: string;
  children: React.ReactNode;
};

export function ParticipantPopOver({
  userId,
  conversationId,
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
      <PopoverContent className="xl:w-52 rounded-lg p-4 w-full bg-secondary space-y-4">
        <div className="w-full flex justify-start items-start gap-2">
          <img src={photoURL} className="w-9 h-9 rounded-full" alt="AV" />
          <div>
            <p className="font-bold">
              {capitalizer(firstName + " " + lastName)}
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
                Remove from conversation
              </Button>
            </PopoverClose>
          )
        }
      </PopoverContent>
    </Popover>
  );
}
