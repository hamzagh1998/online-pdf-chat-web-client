import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";

import { MAIN_PATHES } from "@/routes/main.routes";

import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col ">
      <img src="not-found.svg" className="xl:w-1/2 xl:h-1/2" />
      <p className="text-2xl font-bold my-2">Ressource not found!</p>
      <Link to={MAIN_PATHES.MAIN}>
        <Button variant="outline" size="lg">
          <IoHome />
          &ensp; Back Home
        </Button>
      </Link>
    </div>
  );
}
