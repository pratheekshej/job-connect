import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import UserAvatar from '../assets/user-avatar.png';
import LogoAvatar from '../assets/jobconnect.png';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const USER_IMG_PATH = UserAvatar;
export const LOGO_IMG_PATH = LogoAvatar;