import { deleteObject, ref } from "firebase/storage";

import { storage } from "../firebase.config";

export async function deleteFileFromUrl(fileUrl: string) {
  try {
    // Create a reference to the file to delete
    const storageRef = ref(storage, fileUrl);

    // Delete the file
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}
