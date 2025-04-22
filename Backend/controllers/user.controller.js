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
                message: "All fields are required", 
                success: false 
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ 
                message: "User already exists with this email", 
                success: false 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePhoto = "";
        if (req.file) {
            try {
                const fileUri = getDataUri(req.file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    folder: "profile-photos",
                    resource_type: "auto"
                });
                profilePhoto = cloudResponse.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({ 
                    message: "Failed to upload profile photo", 
                    success: false,
                    error: uploadError.message 
                });
            }
        }

        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto
            }
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true,
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                role: newUser.role,
                profile: newUser.profile
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ 
            message: "Registration failed", 
            success: false,
            error: error.message 
        });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        // Validate input
        if (!email || !password || !role) {
            return res.status(400).json({ 
                message: "Email, password, and role are required", 
                success: false 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: "Invalid email format", 
                success: false 
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: "No account found with this email",
                success: false
            });
        }

        // Verify password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ 
                message: "Incorrect password",
                success: false
            });
        }

        // Verify role
        if (role !== user.role) {
            return res.status(403).json({ 
                message: `This account is registered as a ${user.role}, not a ${role}`,
                success: false
            });
        }

        // Check for JWT secret
        if (!process.env.SECRET_KEY) {
            console.error("SECRET_KEY is not defined in environment variables");
            return res.status(500).json({
                message: "Server configuration error",
                success: false
            });
        }

        // Generate token
        const tokenData = {
            userId: user._id,
            role: user.role
        };

        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { 
            expiresIn: '1d' 
        });

        // Prepare user data for response
        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: "/"
        });

        return res.status(200).json({
            message: `Welcome back ${user.fullname}`,
            user: userData,
            success: true,
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Login failed. Please try again.",
            success: false,
            error: error.message
        });
    }
};
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        // Validate required fields
        if (!fullname || !email || !phoneNumber) {
            return res.status(400).json({ 
                message: "Full name, email, and phone number are required", 
                success: false 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: "Invalid email format", 
                success: false 
            });
        }

        // Validate phone number is numeric
        if (isNaN(Number(phoneNumber))) {
            return res.status(400).json({ 
                message: "Phone number must be numeric", 
                success: false 
            });
        }

        const userId = req.id;
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                message: "User not found", 
                success: false 
            });
        }

        // Check if email is already taken by another user
        const existingUser = await User.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({ 
                message: "Email is already taken", 
                success: false 
            });
        }

        // Updating the profile
        user.fullname = fullname;
        user.email = email;
        user.phoneNumber = Number(phoneNumber);
        if (bio) user.profile.bio = bio;
        if (skills) {
            const skillsArray = skills.split(",").map(skill => skill.trim()).filter(skill => skill);
            user.profile.skills = skillsArray;
        }

        // Update the resume URL and original file name
        if (file) {
            try {
                console.log('Starting resume upload process...');
                console.log('File details:', {
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size
                });

                // Validate file type
                if (file.mimetype !== 'application/pdf') {
                    console.log('Invalid file type:', file.mimetype);
                    return res.status(400).json({ 
                        message: "Only PDF files are allowed for resumes", 
                        success: false 
                    });
                }

                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    console.log('File too large:', file.size);
                    return res.status(400).json({ 
                        message: "Resume file size must be less than 5MB", 
                        success: false 
                    });
                }

                console.log('Converting file to data URI...');
                const fileUri = getDataUri(file);
                if (!fileUri.content) {
                    console.log('Failed to get file content');
                    return res.status(400).json({ 
                        message: "Failed to process resume file", 
                        success: false 
                    });
                }

                console.log('Uploading to Cloudinary...');
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    resource_type: "raw",
                    folder: 'resumes',
                    use_filename: true,
                    unique_filename: true,
                    format: 'pdf',
                    transformation: [
                        { flags: "attachment" }
                    ]
                }).catch(error => {
                    console.error('Cloudinary upload error:', error);
                    throw error;
                });
                
                console.log('Cloudinary response:', cloudResponse);

                if (!cloudResponse.secure_url) {
                    console.log('No secure URL in Cloudinary response');
                    throw new Error("Failed to get secure URL from Cloudinary");
                }

                user.profile.resume = cloudResponse.secure_url;
                user.profile.resumeOriginalName = file.originalname;
                console.log('Resume upload successful');
            } catch (uploadError) {
                console.error('Resume upload error details:', {
                    message: uploadError.message,
                    stack: uploadError.stack,
                    response: uploadError.response?.data
                });
                return res.status(500).json({ 
                    message: "Failed to upload resume. Please try again.", 
                    success: false,
                    error: uploadError.message 
                });
            }
        }

        await user.save();

        // Prepare the user data to send in the response
        const updatedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.error('Profile update error:', error);
        return res.status(500).json({ 
            message: "Failed to update profile", 
            success: false,
            error: error.message 
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.id).select('-password');
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const serveResume = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user || !user.profile?.resume) {
            return res.status(404).json({ message: "Resume not found", success: false });
        }

        // Set proper headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${user.profile.resumeOriginalName}"`);
        
        // Fetch the PDF from Cloudinary
        const response = await fetch(user.profile.resume);
        const buffer = await response.buffer();
        
        // Send the PDF
        res.send(buffer);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: "Error serving resume", 
            success: false,
            error: error.message 
        });
    }
};