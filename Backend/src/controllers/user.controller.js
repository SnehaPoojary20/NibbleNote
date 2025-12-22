import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";



const generateAccessAndRefreshTokens = async(userId)=>
  {
   try {

    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false });

    return{accessToken,refreshToken}

   } catch (error) {
    throw new ApiError(500,"Something Went Wrong while generating refresh and access token")
   }
}



const registerUser = asyncHandler(async (req, res) => {

  console.log("req.body:", req.body);
  console.log("req.files:", req.files);

  const normalizedBody = {};

for (let key in req.body) {
  normalizedBody[key.trim()] = req.body[key];
}

  // const { username, email, password } = req.body;
  const { username, email, password } = normalizedBody;

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
  // const profilePicLocalPath = req.files?.profilePic?.[0]?.path;
  let profilePicLocalPath;

// Multer with .fields() creates an object with arrays
if (req.files && req.files.profilePic && req.files.profilePic.length > 0) {
  profilePicLocalPath = req.files.profilePic[0].path;
}

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



const loginUser =asyncHandler(async(req,res)=>{

  // const{ username, email, password}=req.body
  const { username, email, password } = req.body || {};

  if(!(username || email) || !password){
    throw new ApiError(400,"username or password is required")
  }

  const user= await User.findOne({
    $or: [
    { username: username?.toLowerCase() },
    { email: email?.toLowerCase() }
  ]
  })

  if(!user){
  throw new ApiError(404,"User does not exist")
}

  const isPasswordValid = await user.isPasswordCorrect(password)

  if(! isPasswordValid){
    throw new ApiError(401,"Invalid User Credentials");
  }

  const{accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

  const loggegInUser = await User.findById(user._id).select("-password -refreshToken")

  const options ={
    httpOnly: true,    // prevents JS from reading cookie
    secure: false,     // must be false on localhost
    sameSite: "lax"    // prevents some CSRF, works fine locally
  }

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,{
         user:loggegInUser , accessToken,
         refreshToken
      },
      "User Logged In Sucessfully"
    )
  )
});



//logout user
const logoutUser=asyncHandler (async(req,res)=>{
  await User.findByIdAndUpdate(
   req.user._id,
   {
     $set:{
      refreshToken:undefined
     }
   },{
       new:true
   }
 )

const options = {
  httpOnly: true,
  secure: false,
  sameSite: "lax"
};

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User Logged Out"))
})

const refreshAccessToken =asyncHandler(async(req,res)=>{
  const incomingRefreshToken= req.cookies.refreshToken ||
  req.body.refreshToken

  if(!incomingRefreshToken){
    throw new ApiError(401,"Unauthorized request")
  }

 try {
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
   )
 
   const user = await User.findById(decodedToken?._id)
 
    if(!user){
     throw new ApiError(401,"Invalid refresh token")
   }
 
   if(incomingRefreshToken !== user?.refreshToken){
     throw new ApiError(401,"Refresh Token is expired or used")
   }
 
  const options = {
  httpOnly: true,
  secure: false,
  sameSite: "lax"
};

 
  const { accessToken, refreshToken } =
  await generateAccessAndRefreshTokens(user._id);

return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      { accessToken, refreshToken },
      "Access token refreshed successfully"
    )
  );

  } catch (error) {
   throw new ApiError(401,error?.message || "Invalid refresh token");
   
 }
})



const changeCurrentPassword = asyncHandler(async(req,res)=>{

  const{oldPassword,newPassword}= req.body;

  const user=await User.findById(req.user?._id )

 const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

 if(!isPasswordCorrect){
  throw new ApiError(400,"Invalid Old Password");
 }

 user.password= newPassword
 await user.save({validateBeforeSave:false})

 return res
 .status(200)
 .json(new ApiResponse(200,{},"Password changed sucessfully"))
});



const getCurrentUser= asyncHandler(async(req,res)=>{

return res
.status(200)
.json(
  new ApiResponse(200, req.user, "Current user fetched successfully")
);


});



const updateAccountDetails = asyncHandler(async(req,res)=>{

  const{username, email}= req.body

  if(!username || ! email){
    throw new ApiError(400, "All feilds are required")
  }

  const user = awaitUser.findByIdAndUpdate(
         req.user?._id,
         {
          $set:{
            username:username,
            email:email
          }
         },
         { new:true}
  ).select("-password -refreshToken")


  return res
  .status(200)
  .json(new ApiResponse(200, user, "Account details updated successfully"))
});



const updateUserProfilePic = asyncHandler(async(req,res)=>{

  const profilePicLocalPath = req.file?.path

  if(!profilePicLocalPath){
    throw new ApiError(400,"Profile picture is missing")
  }

 const profilePic= await uploadOnCloudinary(profilePicLocalPath)

  if(!profilePic.url){
     throw new ApiError(400,"Error while uploading Profile Picture ")
  }

const user = await User.findByIdAndUpdate
(
    req.user?._id,
    {
      $set:{
        profilePic:profilePic.url
      }
    },
    {new:true}
  ).select("-password -refreshToken")


  return res
  .status(200)
  .json(
  new ApiResponse(200, user, "Profile picture updated successfully")
);

})



export { registerUser,loginUser,logoutUser ,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails, updateUserProfilePic};





// email password 
//validation - not empty
// check user already exits
//