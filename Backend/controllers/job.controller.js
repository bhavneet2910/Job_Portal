import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;

        const userId = req.id;

        // Validate required fields
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // Validate salary is a number
        if (isNaN(Number(salary))) {
            return res.status(400).json({
                message: "Salary must be a number",
                success: false
            });
        }

        // Validate position is a positive number
        if (position <= 0) {
            return res.status(400).json({
                message: "Number of positions must be greater than 0",
                success: false
            });
        }

        // Validate requirements is a non-empty string
        if (typeof requirements !== 'string' || !requirements.trim()) {
            return res.status(400).json({
                message: "Requirements cannot be empty",
                success: false
            });
        }

        // Calculate expiration date (20 days from now)
        const currentDate = new Date();
        const expirationDate = new Date(currentDate);
        expirationDate.setDate(currentDate.getDate() + 20);

        // Split requirements and validate
        const requirementsArray = requirements.split(',').map(req => req.trim()).filter(req => req);
        if (requirementsArray.length === 0) {
            return res.status(400).json({
                message: "At least one requirement is required",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirementsArray,
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId,
            expirationDate
        });

        return res.status(201).json({
            message: "New job created successfully",
            job,
            success: true
        });
    } catch (error) {
        console.error('Error creating job:', error);
        return res.status(500).json({ 
            message: "Failed to create job",
            success: false,
            error: error.message 
        });
    }
};

// Helper function to check if a job has expired
const isJobExpired = (expirationDate) => {
    const currentDate = new Date();
    return currentDate > new Date(expirationDate);
};

// Helper function to get remaining days until expiration
const getRemainingDays = (expirationDate) => {
    const currentDate = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate - currentDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Function to automatically deactivate expired jobs
export const deactivateExpiredJobs = async (req, res) => {
    try {
        const currentDate = new Date();
        const result = await Job.updateMany(
            { 
                expirationDate: { $lt: currentDate },
                isActive: true 
            },
            { 
                $set: { isActive: false } 
            }
        );

        return res.status(200).json({
            message: `Deactivated ${result.modifiedCount} expired jobs`,
            success: true
        });
    } catch (error) {
        console.error('Error deactivating expired jobs:', error);
        return res.status(500).json({
            message: "Failed to deactivate expired jobs",
            success: false,
            error: error.message
        });
    }
};

// Function to extend job posting duration
export const extendJobDuration = async (req, res) => {
    try {
        const { jobId, days } = req.body;
        
        if (!jobId || !days || days <= 0) {
            return res.status(400).json({
                message: "Valid job ID and number of days are required",
                success: false
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Check if user has permission to extend this job
        if (job.created_by.toString() !== req.id) {
            return res.status(403).json({
                message: "You don't have permission to extend this job",
                success: false
            });
        }

        const newExpirationDate = new Date(job.expirationDate);
        newExpirationDate.setDate(newExpirationDate.getDate() + days);

        job.expirationDate = newExpirationDate;
        job.isActive = true;
        await job.save();

        return res.status(200).json({
            message: `Job duration extended by ${days} days`,
            newExpirationDate,
            success: true
        });
    } catch (error) {
        console.error('Error extending job duration:', error);
        return res.status(500).json({
            message: "Failed to extend job duration",
            success: false,
            error: error.message
        });
    }
};

// Modified getAllJobs to include expiration status
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const showExpired = req.query.showExpired === 'true';
        
        // Build the search query
        const query = {};
        
        // If there's a keyword, search in title, description, or location
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { location: { $regex: keyword, $options: "i" } }
            ];
        }

        // Get all jobs first to calculate totals
        const allJobs = await Job.find(query)
            .populate({ path: "company" })
            .sort({ createdAt: -1 });

        // Process jobs with expiration status
        const currentDate = new Date();
        const processedJobs = allJobs.map(job => {
            const expirationDate = new Date(job.expirationDate);
            const isExpired = currentDate > expirationDate;
            const remainingDays = Math.ceil((expirationDate - currentDate) / (1000 * 60 * 60 * 24));
            
            return {
                ...job.toObject(),
                isExpired,
                remainingDays: remainingDays > 0 ? remainingDays : 0
            };
        });

        // Filter active vs expired jobs
        const activeJobs = processedJobs.filter(job => !job.isExpired);
        const expiredJobs = processedJobs.filter(job => job.isExpired);

        // Return appropriate jobs based on showExpired flag
        const jobsToReturn = showExpired ? processedJobs : activeJobs;

        return res.status(200).json({ 
            jobs: jobsToReturn,
            success: true,
            stats: {
                totalJobs: processedJobs.length,
                activeJobs: activeJobs.length,
                expiredJobs: expiredJobs.length
            }
        });
    } catch (error) {
        console.error('Error getting jobs:', error);
        return res.status(400).json({ 
            message: "Failed to get jobs",
            success: false,
            error: error.message 
        });
    }
};

// Modified getJobById to include expiration status
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate({
                path: "applications",
                populate: {
                    path: "applicant",
                    select: "_id fullname email"
                }
            })
            .populate({
                path: "company",
                select: "name logo"
            });
        
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Add hasApplied and expiration status to response
        const hasApplied = job.applications.some(
            app => app.applicant?._id.toString() === req.id
        );

        return res.status(200).json({
            success: true,
            job: {
                ...job.toObject(),
                hasApplied,
                isExpired: isJobExpired(job.expirationDate),
                remainingDays: getRemainingDays(job.expirationDate)
            }
        });
    } catch (error) {
        console.error('Error fetching job:', error);
        return res.status(500).json({
            message: "Failed to get job",
            success: false,
            error: error.message
        });
    }
};

// admin
export const getJobByLoggedAdminUser = async (req, res) => {
    try {
        const userId = req.id;
        const jobs = await Job.find({ created_by: userId }).populate({path:'company', createdAt:-1});
        if (!jobs) return res.status(404).json({ message: "Jobs are not found", success: false });
        
        return res.status(200).json({
            jobs,
            success:true
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error });
    }
}

export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position,
            companyId,
            expirationDate
        } = req.body;

        // Validate required fields
        if (!title || !description || !requirements || !salary || !location || 
            !jobType || !experience || !position || !companyId || !expirationDate) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // Validate salary is a number
        if (isNaN(Number(salary))) {
            return res.status(400).json({
                message: "Salary must be a number",
                success: false
            });
        }

        // Validate position is a positive number
        if (position <= 0) {
            return res.status(400).json({
                message: "Number of positions must be greater than 0",
                success: false
            });
        }

        // Validate expiration date is not in the past
        const selectedDate = new Date(expirationDate);
        const currentDate = new Date();
        if (selectedDate < currentDate) {
            return res.status(400).json({
                message: "Expiration date cannot be in the past",
                success: false
            });
        }

        // Find the job
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Check if user has permission to update this job
        if (job.created_by.toString() !== req.id) {
            return res.status(403).json({
                message: "You don't have permission to update this job",
                success: false
            });
        }

        // Split requirements and validate
        const requirementsArray = requirements.split(',').map(req => req.trim()).filter(req => req);
        if (requirementsArray.length === 0) {
            return res.status(400).json({
                message: "At least one requirement is required",
                success: false
            });
        }

        // Update the job
        job.title = title;
        job.description = description;
        job.requirements = requirementsArray;
        job.salary = Number(salary);
        job.location = location;
        job.jobType = jobType;
        job.experienceLevel = experience;
        job.position = position;
        job.company = companyId;
        job.expirationDate = new Date(expirationDate);
        job.isActive = true;

        await job.save();

        return res.status(200).json({
            message: "Job updated successfully",
            job,
            success: true
        });
    } catch (error) {
        console.error('Error updating job:', error);
        return res.status(500).json({
            message: "Failed to update job",
            success: false,
            error: error.message
        });
    }
};