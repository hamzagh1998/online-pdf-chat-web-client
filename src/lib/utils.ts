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

export function convertUTCToLocal(utcDateStr: string) {
  const utcDate = new Date(utcDateStr);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Use 24-hour time format
  };

  const localDateStr = utcDate.toLocaleString(undefined, options);

  return localDateStr.replace(",", " -");
}
