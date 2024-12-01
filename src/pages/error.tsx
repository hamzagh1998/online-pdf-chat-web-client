import { IoHome } from "react-icons/io5";

import { Button } from "@/components/ui/button";

export function ErrorPage() {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col ">
      <img src="error.svg" className="xl:w-1/2 xl:h-1/2" />
      <p className="text-2xl font-bold my-4">Oops something went wrong!</p>
      <Button
        variant="outline"
        size="lg"
        onClick={() => window.location.reload()}
      >
        <IoHome />
        &ensp; Back Home
      </Button>
    </div>
  );
}
