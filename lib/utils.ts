import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimestamp = (createdAt: Date): string => {
  const currentDate = new Date();
  const milliseconds = currentDate.getTime() - createdAt.getTime();
  const seconds = milliseconds / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (days > 1) {
    return `${Math.floor(days)} days ago`;
  } else if (hours > 1) {
    return `${Math.floor(hours)} hours ago`;
  } else if (minutes > 1) {
    return `${Math.floor(minutes)} minutes ago`;
  } else if (seconds > 1) {
    return `${Math.floor(seconds)} seconds ago`;
  } else {
    return 'less a second ago';
  }
}

export const formatAndDivideNumber = (num: number): string => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return num.toFixed(0);
  }
}

