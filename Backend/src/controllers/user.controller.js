import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate empty fields
  if ([username, email, password].some(field => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Get local path of uploaded file
  const profilePicLocalPath = req.files?.profilePic?.[0]?.path;

  if (!profilePicLocalPath) {
    throw new ApiError(400, "Profile picture is required");
  }

  // Upload to Cloudinary
  const uploadedProfilePic = await uploadOnCloudinary(profilePicLocalPath);

  if (!uploadedProfilePic) {
    throw new ApiError(500, "Profile picture upload failed");
  }

  // Create user
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    profilePic: uploadedProfilePic.url
  });

  const createdUser = await User.findOne(user._id).select(
   "-password -refreshToken"
);

  if(! createdUser){
    throw new ApiError(500,"Something went wrong while regestering the user");
  }


  return res.status(201).json(
    new ApiResponse(200, createdUser,"User Registered Sucessfully")
  );
});

export { registerUser };


// email password 
//validation - not empty
// check user already exits
//