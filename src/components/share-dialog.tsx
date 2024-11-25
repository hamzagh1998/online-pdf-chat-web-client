import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function ShareDialog({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>{children}</button>
      </DialogTrigger>
      <DialogContent className="lg:w-[480px] w-full">
        <DialogHeader>
          <DialogTitle>Add Participants</DialogTitle>
          <DialogDescription>
            Add new participants to this conversation
          </DialogDescription>
        </DialogHeader>
        <div className="w-full space-y-2">
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div></div>
          <Button className="w-full font-bold">+&ensp;Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
