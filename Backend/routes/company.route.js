import express from "express";
import { getCompanies, getCompanyById, registerCompany, updateCompanyInformation } from "../controllers/company.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// Get all companies
router.get("/getcompanies", isAuthenticated, getCompanies);

// Get company by ID
router.get("/getcompany/:id", isAuthenticated, getCompanyById);

// Register new company
router.post("/register", isAuthenticated, registerCompany);

// Update company information
router.put("/update/:id", isAuthenticated, singleUpload, updateCompanyInformation);

export default router;