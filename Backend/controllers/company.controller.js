// company.controller.js
import { company as CompanyModel } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
// Register Company
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        console.log("Request body:", req.body);

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        let existingCompany = await CompanyModel.findOne({ name: companyName });
        if (existingCompany) {
            return res.status(400).json({
                message: "You can't register the same company.",
                success: false
            });
        }

        const newCompany = await CompanyModel.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company: newCompany,
            success: true
        });

    } catch (error) {
        console.error("Error in registerCompany:", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Get Companies by User
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged-in user id
        const companies = await CompanyModel.find({ userId });
        if (!companies || companies.length === 0) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            });
        }
        return res.status(200).json({
            companies,
            success: true
        });

    } catch (error) {
        console.error("Error in getCompany:", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Get Company by ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await CompanyModel.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).json({
            company,
            success: true
        });

    } catch (error) {
        console.error("Error in getCompanyById:", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Update Company
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;

        const updateData = { name, description, website, location,logo };
        const company = await CompanyModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated.",
            company,
            success: true
        });

    } catch (error) {
        console.error("Error in updateCompany:", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
