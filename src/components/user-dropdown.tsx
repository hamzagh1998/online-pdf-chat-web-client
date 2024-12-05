import { useConversationStore } from "@/hooks/store/use-conversation-store";
import { RiDatabase2Line } from "react-icons/ri";

import { auth } from "@/lib/firebase/firebase.config";

import { useUserStore } from "@/hooks/store/use-user-store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

import { capitalizer } from "@/lib/utils";

export function UserDropdown() {
  const { userData, setUserData } = useUserStore();
  const { setConversationData } = useConversationStore();

  const onSignout = () => {
    localStorage.clear();
    setUserData(null);
    setConversationData(null);
    auth.signOut();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage
            className="rounded-full h-9 w-h-9 cursor-pointer border-2 hover:border-primary"
            src={userData?.photoURL || ""}
            alt="Avatar"
          />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          {capitalizer(userData?.firstName! + " " + userData?.lastName!)}
          <Badge className="text-xs ml-2" variant="secondary">
            {userData?.plan}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <DropdownMenuShortcut className="mb-2 flex justify-end items-center gap-2">
            <RiDatabase2Line size={20} />
            &ensp;
            {(userData?.storageUsageInMb || 0).toFixed(2)}
            /80MB
          </DropdownMenuShortcut>
          <Progress value={((userData?.storageUsageInMb || 0) * 100) / 80} />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Upgrade</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup onClick={onSignout}>
          <DropdownMenuItem className="text-destructive">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
