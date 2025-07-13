import { USER_STORAGE_NAME } from "@/constants";
import type { User } from "@/modules/auth/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCurrentUser = (): User | null => {
  try {
    const user = localStorage.getItem(USER_STORAGE_NAME);
    return user ? (JSON.parse(user) as User) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};
