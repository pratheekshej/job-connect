import mongoose from "mongoose";

const ROLE_ENUM = ['jobseeker', 'recruiter', 'admin'];
const APPROVAL_STATUSES = ['pending', 'approved', 'rejected'];

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ROLE_ENUM,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default: null,
        required: false
    },
    approvalStatus: {
        type: String,
        enum: APPROVAL_STATUSES,
        required: false
    },
    jobsViewed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    }],
    companiesViewed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    }],
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    }],
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String }, // URL to resume file
        resumeOriginalName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
        profilePhoto: {
            type: String,
            default: ""
        }
    },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);