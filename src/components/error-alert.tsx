import { MdError } from "react-icons/md";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface Props {
  title: string;
  description: string;
}

export function ErrorAlert({ title, description }: Props) {
  return (
    <Alert className="flex justify-start items-center gap-2 bg-destructive">
      <div>
        <MdError size={36} color="#fff" />
      </div>
      <div>
        <AlertTitle className="text-lg font-bold text-white">
          {title}
        </AlertTitle>
        <AlertDescription className="text-md text-white">
          {description}
        </AlertDescription>
      </div>
    </Alert>
  );
}
