import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
// import cloudinary from "../utils/cloudinary.js";


export const registerCompany = async (req, res) => {
    try {
        // Check if user is a recruiter
        const user = await User.findById(req.id);
        if (!user || user.role !== 'recruiter') {
            return res.status(403).json({
                message: "Only recruiters can register companies",
                success: false
            });
        }

        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "Company with this name already exists.",
                success: false
            });
        }

        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.error("Company registration error:", error);
        return res.status(500).json({ 
            message: "Failed to register company",
            success: false,
            error: error.message 
        });
    }
};

export const getCompanies = async (req, res) => {
    try {
        // Check if user is a recruiter
        const user = await User.findById(req.id);
        if (!user || user.role !== 'recruiter') {
            return res.status(403).json({
                message: "Only recruiters can access companies",
                success: false
            });
        }

        const userId = req.id;
        const companies = await Company.find({ userId });
        
        return res.status(200).json({ 
            companies: companies || [], 
            success: true,
            message: "Companies fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching companies:", error);
        return res.status(500).json({ 
            message: "Failed to fetch companies",
            success: false,
            error: error.message 
        });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        // Check if user is a recruiter
        const user = await User.findById(req.id);
        if (!user || user.role !== 'recruiter') {
            return res.status(403).json({
                message: "Only recruiters can access company details",
                success: false
            });
        }

        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        
        if (!company) {
            return res.status(404).json({ 
                message: "Company not found!", 
                success: false 
            });
        }

        // Check if the company belongs to the current user
        if (company.userId.toString() !== req.id) {
            return res.status(403).json({
                message: "You don't have permission to access this company",
                success: false
            });
        }

        return res.status(200).json({
            company,
            success: true,
            message: "Company details fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching company:", error);
        return res.status(500).json({ 
            message: "Failed to fetch company details",
            success: false,
            error: error.message 
        });
    }
};

export const updateCompanyInformation = async (req, res) => {
    try {
        // Check if user is a recruiter
        const user = await User.findById(req.id);
        if (!user || user.role !== 'recruiter') {
            return res.status(403).json({
                message: "Only recruiters can update company information",
                success: false
            });
        }

        const { name, description, website, location } = req.body;
        const companyId = req.params.id;

        // Find the company first
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ 
                message: "Company not found!", 
                success: false 
            });
        }

        // Check if the company belongs to the current user
        if (company.userId.toString() !== req.id) {
            return res.status(403).json({
                message: "You don't have permission to update this company",
                success: false
            });
        }

        // Prepare update data
        const updateData = { 
            name: name || company.name,
            description: description || company.description,
            website: website || company.website,
            location: location || company.location
        };

        // Handle file upload if a file is provided
        if (req.file) {
            try {
                const fileUri = getDataUri(req.file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    folder: "company-logos",
                    resource_type: "auto"
                });
                updateData.logo = cloudResponse.secure_url;
            } catch (uploadError) {
                console.error("Error uploading logo:", uploadError);
                return res.status(500).json({
                    message: "Error uploading company logo",
                    success: false,
                    error: uploadError.message
                });
            }
        }

        // Update the company
        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            updateData,
            { new: true }
        );

        if (!updatedCompany) {
            return res.status(500).json({
                message: "Failed to update company information",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated successfully",
            company: updatedCompany,
            success: true
        });
    } catch (error) {
        console.error("Error updating company:", error);
        return res.status(500).json({ 
            message: "Failed to update company information",
            success: false,
            error: error.message 
        });
    }
};