import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { useRemoveUserFromConversation } from "@/services/conversation/queries";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "./ui/use-toast";

type ParticipantPopOverProps = {
  userId: string;
  conversationId: string;
  firstName: string;
  lastName: string;
  photoURL: string;
  children: React.ReactNode;
};

export function ParticipantPopOver({
  userId,
  conversationId,
  firstName,
  lastName,
  photoURL,
  children,
}: ParticipantPopOverProps) {
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
          toast({ description: `${firstName} removed from the conversation!` })
        );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="xl:w-52 rounded-lg p-4 w-full bg-secondary space-y-4">
        <div className="w-full flex justify-start items-center gap-2">
          <img src={photoURL} className="w-8 h-8 rounded-full" alt="AV" />
          <p>{firstName}</p>
          <p>{lastName}</p>
        </div>
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
      </PopoverContent>
    </Popover>
  );
}
