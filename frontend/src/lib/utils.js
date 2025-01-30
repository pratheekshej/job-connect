import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import UserAvatar from '../assets/user-avatar.png';
import LogoAvatar from '../assets/jobconnect.png';
import { JOB_API_END_POINT, USER_API_END_POINT } from "@/utils/constant";
import axiosPrivate from "@/hooks/useAxiosPrivate";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const USER_IMG_PATH = UserAvatar;
export const LOGO_IMG_PATH = LogoAvatar;

export const truncateDesc = (desc = '', limit = 150) => {
  if (desc && desc.length >= limit) {
    return `${desc.slice(0, limit)}...`
  }
  return desc;
}

export const updateCompaniesViewedByUser = async (data) => {
  const res = await axiosPrivate.put(`${USER_API_END_POINT}/users/company-viewed`, { companyId: data.companyId }, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  });
  return res.data;
}

export const getUserById = async (userId) => {
  const res = await axiosPrivate.get(`${USER_API_END_POINT}/users/${userId}`, {
    withCredentials: true
  });
  return res?.data?.user;
}

export const getAllJobsPostedToday = async (userId) => {
  const res = await axiosPrivate.get(`${JOB_API_END_POINT}/get/jobs-posted-today`, {
    withCredentials: true
  });
  return res?.data?.jobs;
}

export const updateJobsViewedByUser = async (data) => {
  const res = await axiosPrivate.put(`${USER_API_END_POINT}/users/jobs-viewed`, { jobId: data.jobId }, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  });
  return res.data;
}

export const savedJobByUser = async (data) => {
  const res = await axiosPrivate.put(`${USER_API_END_POINT}/users/jobs-saved`, { jobId: data.jobId }, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  });
  return res.data;
}