import { RiDatabase2Line } from "react-icons/ri";

import { useUserStore } from "@/hooks/store/use-user-store";

import { auth } from "@/lib/firebase/firebase.config";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { capitalizer } from "@/lib/utils";
import { FaBell } from "react-icons/fa";

export function HeadView() {
  const { userData } = useUserStore();

  const onSignout = () => auth.signOut();

  return (
    <nav className="w-full flex justify-between items-center p-4 border border-b-primary">
      {/* icon */}
      <div className="w-fit flex justify-start items-center gap-2">
        <img src="icon.png" height={32} width={32} />
        <p className="text-2xl font-bold tracking-wide text-primary">
          OnlinePDFChat
        </p>
      </div>
      <div className="w-full flex justify-end items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage
                className="rounded-full h-9 w-h-9 cursor-pointer border-2 hover:border-primary"
                src={userData?.photoURL}
                alt="Avatar"
              />
              <AvatarFallback>
                {userData?.firstName[0]! + userData?.lastName[0]!}
              </AvatarFallback>
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
                <RiDatabase2Line size={20} /> {userData?.storageUsageInMb || 0}
                /200MB
              </DropdownMenuShortcut>
              <Progress value={userData?.storageUsageInMb || 0} />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </DropdownMenuGroup>
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
        <div className="cursor-pointer hover:bg-secondary p-2 rounded-md">
          <FaBell size={20} />
        </div>
        <ModeToggle />
      </div>
    </nav>
  );
}
