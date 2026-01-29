import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Restaurant } from "../models/restaurant.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"



const addRestaurantDetails = asyncHandler(async (req, res) => {
  const { name, address, coordinates, cuisine } = req.body;

  if (!name || !address || !coordinates || !cuisine) {
    throw new ApiError(400, "All fields are required");
  }

  const existingRestaurant = await Restaurant.findOne({
    name,
    "coordinates.lat": coordinates.lat,
    "coordinates.lng": coordinates.lng,
  });

  if (existingRestaurant) {
    throw new ApiError(409, "Restaurant already exists at this location");
  }

  if (!req.files?.image?.length) {
    throw new ApiError(400, "Restaurant image is required");
  }

  const imageLocalPath = req.files.image[0].path;
  const uploadedImage = await uploadOnCloudinary(
    imageLocalPath,
    "restaurant_images"
  );

  if (!uploadedImage?.secure_url) {
    throw new ApiError(500, "Failed to upload restaurant image");
  }

  const restaurant = await Restaurant.create({
    name,
    address,
    coordinates,
    cuisine,
    image: uploadedImage.secure_url,
    createdBy: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(true, "Restaurant added successfully", restaurant));
});



 const updateRestaurantDetails = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { name, address, coordinates, cuisine } = req.body;

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) throw new ApiError(404, "Restaurant not found");

  if (restaurant.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized");
  }

  let imageUrl = restaurant.image;

  if (req.files?.image?.length) {
    const uploadedImage = await uploadOnCloudinary(
      req.files.image[0].path,
      "restaurant_images"
    );
    imageUrl = uploadedImage.secure_url;
  }

  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    {
      $set: {
        name,
        address,
        coordinates,
        cuisine,
        image: imageUrl,
      },
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(true, "Restaurant updated successfully", updatedRestaurant));
});



const getAllRestaurants = asyncHandler(async (req, res) => {
  try {
    const { name, cuisine, search, page = 1, limit = 10 } = req.query;

    const filter = { isActive: true };

    if (name) filter.name = { $regex: name, $options: "i" };
    if (cuisine) filter.cuisine = { $regex: cuisine, $options: "i" };

    if (search && typeof search === "string") {
      const words = search.trim().split(/\s+/);
      if (words.length > 0) {
        filter.$and = words.map(word => ({
          $or: [
            { name: { $regex: word, $options: "i" } },
            { cuisine: { $regex: word, $options: "i" } },
            { address: { $regex: word, $options: "i" } },
          ],
        }));
      }
    }

    const restaurants = await Restaurant.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: restaurants,
      message: "Restaurants fetched successfully",
    });
  } catch (err) {
    console.error("Error in getAllRestaurants:", err);
    throw new ApiError(500, "Failed to fetch restaurants");
  }
});



const getRestaurantById = asyncHandler(async(req,res,next)=>{

   const {restaurantId} = req.params;

   const restaurant = await Restaurant.findById(restaurantId);

   if(!restaurant || !restaurant.isActive){
      throw new ApiError(404, "Restaurant not found");
   } 

   res
   .status(200)
   .json(new ApiResponse(true, "Restaurant fetched successfully", restaurant));
});



const deleteRestaurant = asyncHandler(async(req,res,next)=>{   
   const { restaurantId } = req.params;

   const restaurant = await Restaurant .findById(restaurantId);

   if(!restaurant){
      throw new ApiError(404, "Restaurant not found");
   }  

   if(restaurant.createdBy.toString() !== req.user._id.toString()){
      throw new ApiError(403, "You are not authorized to delete this restaurant")
   };

   restaurant.isActive = false;  

   await restaurant.save();

   res
   .status(200)
   .json(new ApiResponse(true, "Restaurant deleted successfully"));  
});



export {
  addRestaurantDetails,
  updateRestaurantDetails,
  getAllRestaurants,
  getRestaurantById,
  deleteRestaurant
};




// add restaurant:address,location,cuisine,images
// create rating options
//comment section
// crud operations for comments section

