import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        if (!process.env.SECRET_KEY) {
            console.error("SECRET_KEY is not defined in environment variables");
            return res.status(500).json({
                message: "Server configuration error",
                success: false
            });
        }

        try {
            const decoded = await jwt.verify(token, process.env.SECRET_KEY);
            req.id = decoded.userId;
            next();
        } catch (err) {
            console.error("Token verification error:", err);
            return res.status(401).json({ 
                message: "Invalid token", 
                success: false 
            });
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export default isAuthenticated;