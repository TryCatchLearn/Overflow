import cloudinary from "cloudinary";
import {cloudinaryConfig} from "@/lib/config";

cloudinary.v2.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.apiKey,
    api_secret: cloudinaryConfig.apiSecret,
});

export { cloudinary };