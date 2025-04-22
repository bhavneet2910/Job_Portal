import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import cloudinary from '../utils/cloudinary.js';

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const { id: jobId } = req.params;

        if (!jobId) {
            return res.status(400).json({ 
                message: "Job Id required", 
                success: false 
            });
        }

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({ 
            job: jobId, 
            applicant: userId 
        }).populate('job');

        if (existingApplication) {
            return res.status(400).json({ 
                message: "You have already applied for this job.", 
                success: false,
                hasApplied: true
            });
        }

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ 
                message: "Job not found", 
                success: false 
            });
        }

        // Create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            status: 'pending'
        });

        // Add the application to the job's applications array
        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job Applied successfully.",
            success: true,
            hasApplied: true,
            application: newApplication
        });
    } catch (error) {
        console.error('Error applying for job:', error);
        return res.status(500).json({
            message: 'Failed to apply for the job.',
            success: false,
            error: error.message
        });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path:"job",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"company",
                options:{sort:{createdAt:-1}}
            }
        });
        if (!application) return res.status(404).json({ message: "No Application", success: false });
        

        return res.status(200).json({
            application,
            success: true
        });
    } catch (error) {
        return res.status(400).json({ message: "Failed to get applied jobs" });
    }
}

export const getApplicants = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id).populate({
            path: "applications",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "applicant",
                select: "fullname email phoneNumber profile",
                populate: {
                    path: "profile",
                    select: "resume resumeOriginalName"
                }
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.error('Error getting applicants:', error);
        return res.status(500).json({
            message: "Failed to get job applicants",
            success: false,
            error: error.message
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!status || !['accepted', 'rejected'].includes(status.toLowerCase())) {
            return res.status(400).json({ 
                message: "Invalid status. Must be 'accepted' or 'rejected'", 
                success: false 
            });
        }

        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ 
                message: "Application not found", 
                success: false 
            });
        }

        // Update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: `Application ${status} successfully`,
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        return res.status(500).json({
            message: "Failed to update application status",
            success: false,
            error: error.message
        });
    }
};

export const getResume = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await Application.findById(id)
            .populate('applicant', 'resume resumeName');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (!application.applicant?.resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Generate a signed URL for the resume
        const resumeUrl = cloudinary.url(application.applicant.resume, {
            resource_type: 'raw',
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + 3600, // URL expires in 1 hour
            type: 'authenticated',
            secure: true
        });

        console.log('Generated resume URL:', resumeUrl); // Debug log

        res.json({
            success: true,
            resumeUrl,
            resumeName: application.applicant.resumeName
        });
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching resume',
            error: error.message
        });
    }
};