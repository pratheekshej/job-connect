import { Job } from "../models/job.model.js";

// Create Job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "All fields must be completed. Please fill in the missing information",
                success: false
            })
        };

        if (experience === null || isNaN(experience)) {
            return res.status(400).json({
                message: "Please enter numeric data for years of experience!",
                success: false
            })
        }

        if (salary === null || isNaN(salary)) {
            return res.status(400).json({
                message: "Please enter numeric data for yearly salary!",
                success: false
            })
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experience),
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

// Update Job
export const updateJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;
        const jobId = req.params.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "All fields must be completed. Please fill in the missing information",
                success: false
            })
        };

        if (experience === null || isNaN(experience)) {
            return res.status(400).json({
                message: "Please enter numeric data for years of experience!",
                success: false
            })
        }

        if (salary === null || isNaN(salary)) {
            return res.status(400).json({
                message: "Please enter numeric data for yearly salary!",
                success: false
            })
        }

        const job = await Job.findByIdAndUpdate(jobId, {
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experience),
            position,
            company: companyId,
            created_by: userId
        }, { new: true })

        return res.status(201).json({
            message: "Job updated successfully!",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getAllJobsPostedToday = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";

        // Calculate the start and end of today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Build the query
        const query = {
            $and: [
                {
                    createdAt: {
                        $gte: todayStart, // Greater than or equal to the start of the day
                        $lt: todayEnd,    // Less than the end of the day
                    }
                },
                {
                    $or: [
                        { title: { $regex: keyword, $options: "i" } },
                        { description: { $regex: keyword, $options: "i" } },
                    ]
                }
            ]
        };

        // Fetch jobs from the database
        const jobs = await Job.find(query)
            .populate({ path: "company" })
            .sort({ createdAt: -1 });

        // Handle cases where no jobs are found
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found for today.",
                success: false
            });
        }

        // Respond with the jobs
        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error("Error fetching today's jobs:", error);
        return res.status(500).json({
            message: "An error occurred while fetching jobs.",
            success: false
        });
    }
};


export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}

// Jobs created by admin user
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company',
            createdAt: -1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
