import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizer(string: string) {
  if (string) {
    let word = "";
    let words = string.split(" ");

    words = words.map((word) =>
      word != "" ? word[0].toUpperCase() + word.slice(1) : ""
    );
    for (const w of words) word += w + " ";
    return word.trim();
  }
}
