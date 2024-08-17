import { uploadFileToFbStorage } from "@/lib/firebase/storage/upload-file";
import { useState } from "react";

export function useFirebaseUploadFile() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const onAddFile = async (
    file: File | null,
    limit = 8, // in MB
    storageFolderName: string,
    action: "add" | "update"
  ) => {
    if (!file) {
      return setError("No file selected!");
    }

    setIsPending(true);
    setError(null);
    try {
      const res = await uploadFileToFbStorage(
        file,
        limit,
        storageFolderName,
        action
      );
      if (res.error) {
        setError(res.detail as string);
        return;
      }
      return res.detail;
    } catch (error) {
      if (error instanceof Error) {
        setError(error?.message);
      } else {
        setError("An unexpected error occurred while uploading the file!");
      }
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, error, onAddFile };
}
