const cloudinary = require('cloudinary').v2;
require("dotenv").config();

// Configuration
cloudinary.config({ 
    cloud_name: process.env.Cloudinary_Cloud_Name, 
    api_key: process.env.Cloudinary_Api_Key, 
    api_secret: process.env.Cloudinary_Secret_Key
});


const uploadFile = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'auto' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }).end(fileBuffer);
    });
};

module.exports = {
    uploadFile
}