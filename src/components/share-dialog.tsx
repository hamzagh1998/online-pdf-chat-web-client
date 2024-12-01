import { useConversationStore } from "@/hooks/store/use-conversation-store";
import { FaCopy } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

export function ShareDialog({ children }: { children: React.ReactNode }) {
  const { currentConversation } = useConversationStore();

  const onCopy = () => {
    navigator.clipboard.writeText(
      window.location.host + "?collaborate=" + currentConversation?._id
    );
    toast({ description: "Link copied to clipboard!" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>{children}</button>
      </DialogTrigger>
      <DialogContent className="lg:w-[480px] w-full">
        <DialogHeader>
          <DialogTitle className="w-fit flex justify-start items-center gap-1">
            <FaUserGroup />
            Collaboration
          </DialogTitle>
          <DialogDescription>
            Copy send this link to your friends to start collaborating
          </DialogDescription>
        </DialogHeader>
        <div className="w-full space-y-2">
          <div className="w-full h-12 flex justify-between gap-2 items-center p-2">
            <Input
              value={
                window.location.host +
                "?collaborate=" +
                currentConversation?._id
              }
              readOnly
            />
            <DialogClose>
              <Button variant="outline" onClick={onCopy}>
                <FaCopy />
                &ensp;Copy Link
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
