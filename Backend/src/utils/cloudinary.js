// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// // Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Upload function
// const uploadOnCloudinary = async (localFilePath) => {

//   localFilePath = localFilePath.replace(/\\/g, '/');

//   try {
//     if (!localFilePath) return null;

//     // Upload to cloudinary
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });

//     console.log("File uploaded on Cloudinary:", response.url);

//     // remove file after successful upload
//     fs.unlinkSync(localFilePath);

//     return response;
//   } catch (error) {
//     console.error("Cloudinary upload error:", error);

//     // Remove temp file if upload fails
//     if (localFilePath && fs.existsSync(localFilePath)) {
//       fs.unlinkSync(localFilePath);
//     }

//     return null;
//   }
// };
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  localFilePath = localFilePath.replace(/\\/g, '/');

  if (!fs.existsSync(localFilePath)) {
    console.error("File not found:", localFilePath);
    return null;
  }

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // console.log("File uploaded on Cloudinary:", response.secure_url);

    // remove temp file after successful upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };



