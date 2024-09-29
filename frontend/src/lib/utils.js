import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import UserAvatar from '../assets/user-avatar.png';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const USER_IMG_PATH = UserAvatar;