import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

type DeleteConfirmationDialogProps = {
  title: string;
  description: string;
  onConfirm: () => void;
  children: React.ReactNode;
};

export function DeleteConfirmationDialog({
  title,
  description,
  onConfirm,
  children,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="lg:max-w-[600px] w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full flex justify-between items-center">
          <DialogClose asChild>
            <Button className="max-sm:w-full" size="lg" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="max-sm:w-full"
              size="lg"
              variant="destructive"
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
