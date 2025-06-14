import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toastErrorStyles = {
  style: {
    background: "#fef2f2",
    border: "1px solid #f87171",
    color: "#b91c1c",
  },
  duration: 3000,
};
export const toastSuccessStyles = {
  style: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
    border: "1px solid #34d399",
  },
  duration: 3000,
};
