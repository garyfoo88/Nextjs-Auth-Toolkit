import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Function to merge tailwind classnames
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
