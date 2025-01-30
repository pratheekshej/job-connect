import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields must be completed. Please fill in the missing information.",
                success: false
            });
        };
        let cloudResponse, file = req.file;
        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                access_mode: "public",
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse?.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields must be completed. Please fill in the missing information.",
                success: false
            });
        };

        let user = await User.findOne({ email });
        console.log('>> user - - ', user);
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        if (user && user.company) {
            user.profile.company = user.company;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };

        const tokenData = { userId: user._id }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '30d' });

        delete user['password'];

        // Set cookie with secure flag only in production
        const cookieOptions = {
            maxAge: 1 * 24 * 60 * 60 * 1000,  // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production only
            sameSite: 'strict', // Adjust as needed
        };

        return res.status(200).cookie("token", token, cookieOptions).json({
            message: `Welcome back ${user.fullname}`,
            user,
            token,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};


export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        let file = req.file, cloudResponse;
        // Cloudinary code
        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                access_mode: "public",
            });
        }

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if (fullname) user.fullname = fullname
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray

        // resume comes later here...
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const resetPassword = async (req, res) => {
    const errResponse = (error) => res.status(500).json({
        message: "An error occurred",
        success: false,
        error: error.message,
    });

    try {
        const { email } = req.body;

        // Ensure email exists
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false,
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        const { fullname } = user;

        // Create token
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });

        // Success response
        return res.status(201).json({
            message: "Reset email sent successfully!",
            token,
            userName: fullname,
            success: true,
        });

    } catch (error) {
        // Catch any errors and return a failed response
        return errResponse(error);
    }
};

export const changePassword = async (req, res) => {
    try {
        const { password, token } = req.body;

        // Check if both password and token are provided
        if (!password || !token) {
            return res.status(400).json({
                message: "Password and token are required",
                success: false,
            });
        }

        // Verify the token and extract the user's email
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            return res.status(400).json({
                message: "Invalid or expired token",
                success: false,
            });
        }

        // Find the user by email
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        return res.status(201).json({
            message: "Password changed successfully",
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred",
            success: false,
        });
    }
};

export const listUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            message: "Users fetched successfully.",
            users,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while fetching users.",
            success: false
        });
    }
};

export const listRecruiters = async (req, res) => {
    try {
        const users = await User.find({ role: 'recuiter' });
        return res.status(200).json({
            message: "Users fetched successfully.",
            users,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while fetching users.",
            success: false
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "User fetched successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while fetching the user.",
            success: false
        });
    }
};

export const editUserById = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, role } = req.body;
        const { id } = req.params;

        let user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Update fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (role) user.role = role;

        await user.save();

        return res.status(200).json({
            message: "User updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while updating the user.",
            success: false
        });
    }
};

export const updateUserApprovalStatusById = async (req, res) => {
    try {
        const { approvalStatus } = req.body;
        const { id } = req.params;

        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Update fields
        if (approvalStatus) user.approvalStatus = approvalStatus;

        await user.save();

        return res.status(200).json({
            message: "User updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while updating the user.",
            success: false
        });
    }
};

export const updateCompaniesViewed = async (req, res) => {
    try {
        const userId = req.id;
        const { companyId } = req.body;

        console.log('>> companyId ', companyId);

        if (!companyId) {
            return res.status(400).json({
                message: "Invalid company ID.",
                success: false,
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        if (!Array.isArray(user.companiesViewed)) {
            user.companiesViewed = [];
        }

        // Avoid duplicate entries
        if (!user.companiesViewed.includes(companyId)) {
            user.companiesViewed.push(companyId);
        }

        console.log("Before save:", user);

        await user.save();

        return res.status(200).json({
            message: "Company viewed successfully.",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred.",
            success: false,
            error: error.message,
        });
    }
};

export const updateJobsViewed = async (req, res) => {
    try {
        const userId = req.id;
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({
                message: "Invalid job ID.",
                success: false,
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        if (!Array.isArray(user.jobsViewed)) {
            user.jobsViewed = [];
        }

        // Avoid duplicate entries
        if (!user.jobsViewed.includes(jobId)) {
            user.jobsViewed.push(jobId);
        }

        await user.save();

        return res.status(200).json({
            message: "Job viewed successfully.",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred.",
            success: false,
            error: error.message,
        });
    }
};

export const addSavedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({
                message: "Invalid job ID.",
                success: false,
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        if (!Array.isArray(user.savedJobs)) {
            user.savedJobs = [];
        }

        // Avoid duplicate entries
        if (!user.savedJobs.includes(jobId)) {
            user.savedJobs.push(jobId);
        }

        await user.save();

        return res.status(200).json({
            message: "Job saved for later successfully.",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred.",
            success: false,
            error: error.message,
        });
    }
};



