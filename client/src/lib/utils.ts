import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  
  const baseUrl = import.meta.env.VITE_API_URL || "";
  // Ensure we don't double slash if url starts with /
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${cleanUrl}`;
}
