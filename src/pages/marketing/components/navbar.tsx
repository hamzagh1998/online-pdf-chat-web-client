import { Link } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle.tsx";
import { LogoIcon } from "./Icons.tsx";

import { useIsAuthenticated } from "@/hooks/use-is-authenticated";

import { AUTH_PATHES } from "@/routes/auth.routes";
import { MAIN_PATHES } from "@/routes/main.routes";

export const Navbar = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl xl:text-2xl flex gap-2 items-start justify-center text-primary"
            >
              <LogoIcon />
              OnlinePDFChat
            </a>
          </NavigationMenuItem>

          {/* desktop */}
          <div className="flex gap-2">
            <Link
              to={isAuthenticated ? MAIN_PATHES.MAIN : AUTH_PATHES.SIGNIN}
              className={`border ${buttonVariants({
                variant: "secondary",
              })}`}
            >
              {typeof isAuthenticated !== "boolean" ? (
                <div className="animate-spin">
                  <FiLoader size={18} />
                </div>
              ) : isAuthenticated ? (
                "Dashboard"
              ) : (
                "Sign In"
              )}
            </Link>

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
