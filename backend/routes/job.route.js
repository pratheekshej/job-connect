import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    getAdminJobs,
    getAllJobs,
    getAllJobsPostedToday,
    getJobById,
    postJob,
    updateJob
} from "../controllers/job.controller.js";

const router = express.Router();

// Order of routes matters here
router.route("/post").post(isAuthenticated, postJob);
router.route("/update/:id").put(isAuthenticated, updateJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);

// More specific route for today's jobs
router.route("/get/jobs-posted-today").get(isAuthenticated, getAllJobsPostedToday);

// Dynamic route for fetching job by ID (must come last)
router.route("/get/:id").get(isAuthenticated, getJobById);

export default router;
