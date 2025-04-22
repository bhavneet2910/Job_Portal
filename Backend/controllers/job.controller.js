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
            created_by: userId
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
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        };
        const jobs = await Job.find(query).populate({ path: "company" }).sort({createdAt:-1});
        if (!jobs) return res.status(404).json({ message: "Jobs are not found!", success: false });

        return res.status(200).json({ jobs, success: true });
    } catch (error) {
        return res.status(400).json({ message: "Failed to get jobs" });
    }
}
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

        // Add hasApplied field to response
        const hasApplied = job.applications.some(
            app => app.applicant?._id.toString() === req.id
        );

        return res.status(200).json({
            success: true,
            job: {
                ...job.toObject(),
                hasApplied
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