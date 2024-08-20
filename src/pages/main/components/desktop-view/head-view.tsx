import { RiDatabase2Line } from "react-icons/ri";
import { FaBell } from "react-icons/fa";

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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { capitalizer } from "@/lib/utils";
import { Link } from "react-router-dom";

export function HeadView() {
  const { userData } = useUserStore();

  const onSignout = () => {
    localStorage.clear();
    auth.signOut();
  };

  return (
    <nav className="w-full flex justify-between items-center p-4 border border-b-primary">
      {/* icon */}
      <section className="w-fit flex justify-start items-center gap-2 cursor-pointer">
        <img src="icon.png" height={32} width={32} />
        <Link to="/" className="text-2xl font-bold tracking-wide text-primary">
          OnlinePDFChat
        </Link>
      </section>
      <section className="w-full flex justify-end items-center gap-2">
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
                <RiDatabase2Line size={20} />{" "}
                {(userData?.storageUsageInMb || 0).toFixed(2)}
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
        <button className="cursor-pointer hover:bg-secondary p-2 rounded-md">
          <FaBell size={20} />
        </button>
        <ModeToggle />
      </section>
    </nav>
  );
}
