require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  console.error("Cloudinary environment variables are not defined!");
  process.exit(1);
}
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET    
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Airbnb_DEV',
      allowedFormats: ["png","jpg","jpeg"], 
     
    }
  });
 // console.log("Cloudinary Configuration:", cloudinary.config());
  module.exports={cloudinary,storage};