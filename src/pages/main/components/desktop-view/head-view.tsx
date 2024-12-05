import { Link } from "react-router-dom";

import { UserDropdown } from "@/components/user-dropdown";
import { ModeToggle } from "@/components/ui/mode-toggle";

export function HeadView() {
  return (
    <nav className="w-full flex justify-between items-center p-4 border border-b-primary">
      <section className="w-fit flex justify-start items-center gap-2 cursor-pointer">
        <img src="icon.png" height={32} width={32} />
        <Link to="/" className="text-2xl font-bold tracking-wide text-primary">
          OnlinePDFChat
        </Link>
      </section>
      <section className="w-full flex justify-end items-center gap-2">
        <UserDropdown />
        <ModeToggle />
      </section>
    </nav>
  );
}
