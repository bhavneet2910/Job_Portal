import {v2 as cloudinary} from 'cloudinary';
import dotenv from "dotenv";
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('Missing required Cloudinary environment variables:', missingVars);
    throw new Error('Cloudinary configuration is incomplete. Please check your environment variables.');
}

console.log('Initializing Cloudinary with config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? '***' : undefined,
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : undefined,
    secure: true
});

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export default cloudinary;