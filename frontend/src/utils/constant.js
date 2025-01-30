export const API_PORT = import.meta.env.VITE_API_PORT || 8000;
export const PRODUCTION_API = `${import.meta.env.VITE_PROD_API}/api/v1/` || `http://localhost:${API_PORT}/api/v1/`
export const USER_API_END_POINT = `user`;
export const JOB_API_END_POINT = `job`;
export const APPLICATION_API_END_POINT = `application`;
export const COMPANY_API_END_POINT = `company`;
export const FE_URL = `https://jobconnect-hag.netlify.app`;

export const USER_ROLE = {
    jobseeker: 'Job Seeker',
    recruiter: 'Recruiter',
    all: "All Users",
}