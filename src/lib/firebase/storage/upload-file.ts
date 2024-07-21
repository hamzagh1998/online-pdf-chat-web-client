import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";

import { storage } from "../firebase.config";

export async function uploadFileToFbStorage(
  file: File | null,
  limit = 8 * 1024 * 1024, // in MB(8)
  storageFolderName: string,
  action: "add" | "update"
) {
  // Check if the file is null or undefined
  if (!file) {
    return { error: true, detail: "No file provided!" };
  }

  // Check if the file size exceeds the limit
  if (file.size > limit) {
    return { error: true, detail: `File size exceeds the limit!` };
  }

  const folderRef = ref(storage, storageFolderName);

  try {
    if (action === "update") {
      // List all files in the folder
      const listResult = await listAll(folderRef);
      // Delete all files in the folder
      const deletePromises = listResult.items.map((itemRef) =>
        deleteObject(itemRef)
      );
      await Promise.all(deletePromises);
    }

    const fileRef = ref(storage, `${storageFolderName}/${file.name}`);
    await uploadBytes(fileRef, file);

    // Get the file metadata to retrieve the size
    const metadata = await getMetadata(fileRef);
    const fileSizeBytes = metadata.size;
    const fileSizeMB = fileSizeBytes / (1024 * 1024); // Convert file size from bytes to megabytes: 1 MB = 1024 * 1024 bytes

    // Get the download URL for the file
    const url = await getDownloadURL(fileRef);

    // Extract file extension from the file name
    const fileName = metadata.name;
    const fileExtension = fileName.split(".").pop();

    // Get the file type from the content type
    const fileType = metadata.contentType;

    return {
      error: false,
      detail: { url, fileName, fileExtension, fileType, fileSizeMB },
    };
  } catch (error) {
    if (error instanceof Error) {
      return { error: true, detail: error.message };
    } else {
      return { error: true, detail: "An unknown error occurred." };
    }
  }
}
