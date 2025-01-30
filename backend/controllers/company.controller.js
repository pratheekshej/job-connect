import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        console.log(" companyName -----> ", companyName);
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName.trim() });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getCompanies = async (req, res) => {
    try {
        // Fetch companies and populate the 'userId' field with corresponding user data
        const companies = await Company.find().populate('userId', '-password').sort({ updatedAt: -1 });;

        if (!companies || companies.length === 0) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            });
        }

        // Map the populated data to include the user data
        const companyList = companies.map(company => {
            const { userId, ...rest } = company.toObject(); // Convert Mongoose document to plain object
            return {
                ...rest,
                userData: userId // 'userId' now contains the populated user data
            };
        });

        return res.status(200).json({
            companies: companyList,
            success: true
        });
    } catch (error) {
        console.error('Error fetching companies:', error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateCompany = async (req, res) => {
    try {
        let { name, description, website, location, logo } = req.body;
        const file = req.file;
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                access_mode: "public",
            });
            logo = cloudResponse.secure_url;
        }
        const updateData = { name, description, website, location, logo };

        const user = await User.findByIdAndUpdate(req.id, { company: req.params.id, approvalStatus: 'pending' }, { new: true });
        if (!user) {
            return res.status(404).json({
                message: "Update error! User not found.",
                success: false
            })
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }

        return res.status(200).json({
            message: "Company information updated.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const deleteCompany = async (req, res) => {
    try {
        // Find the company by ID and delete it
        const company = await Company.findByIdAndDelete(req.params.id);

        // If company is not found, return a 404 response
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false,
            });
        }

        // Find the user associated with the company
        const user = await User.findById(company.userId);
        if (user) {
            // Clear the `company` field (set to null or use $unset)
            user.company = null; // Set to null (recommended for ObjectId fields)
            await user.save();
        }

        // If deletion is successful, return a success message
        return res.status(200).json({
            message: "Company deleted successfully.",
            success: true,
        });
    } catch (error) {
        // Log any errors and return a 500 response
        console.error("Error deleting company:", error);
        return res.status(500).json({
            message: "Internal server error. Please try again later.",
            success: false,
        });
    }
};

