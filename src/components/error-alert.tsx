import { MdError } from "react-icons/md";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface Props {
  title: string;
  description: string;
}

export function ErrorAlert({ title, description }: Props) {
  return (
    <Alert className="flex justify-start items-center gap-2 bg-red-100">
      <div>
        <MdError size={36} className="text-destructive" />
      </div>
      <div className="">
        <AlertTitle className="text-lg font-bold text-destructive">
          {title}
        </AlertTitle>
        <AlertDescription className="text-md text-destructive">
          {description}
        </AlertDescription>
      </div>
    </Alert>
  );
}
