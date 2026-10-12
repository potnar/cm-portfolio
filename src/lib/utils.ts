import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Theme keys from globals.css that tailwind-merge can't infer on its own.
const twMerge = extendTailwindMerge({
  extend: { theme: { container: ["wide", "narrow"] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
