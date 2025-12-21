import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Restaurant } from "../models/restaurant.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"



const addRestaurantDetails = asyncHandler(async(req,res,next)=>{

    const {name, address, location, cuisine , image } = req.body;

    if(!name || !address || !location || !cuisine){
        throw new ApiError(400, "All fields are required");
    }

    const existingRestaurant = await Restaurant.findOne({ name, "coordinates.lat": location.lat, "coordinates.lng": location.lng });

   if (existingRestaurant) {
      throw new ApiError(409, "Restaurant already exists at this location");
   }

 let imageLocalPath;

   if (req.files?.image?.length > 0) {
     imageLocalPath = req.files.image[0].path;
   }

   if(!imageLocalPath){
        throw new ApiError(400, "Restaurant image is required");
   }

   const uploadedImage= await uploadOnCloudinary(imageLocalPath,"restaurant_images");

   if(!uploadedImage?.secure_url ){
        throw new ApiError(500, "Failed to upload restaurant image");
   }

   const restaurant = new Restaurant({
         name,
         address,
         coordinates: location,
         cuisine,
         image: uploadedImage.url,
         createdBy: req.user._id,
   });
   
   await restaurant.save();

   const savedRestaurant = await Restaurant.findById(restaurant._id);

   if(!savedRestaurant){
        throw new ApiError(500, "Failed to add restaurant");
   }

   res
   .status(201)
   .json(new ApiResponse(true, "Restaurant added successfully", savedRestaurant));
 });



 const updateRestaurantDetails = asyncHandler(async(req,res,next)=>{
      
     const { restaurantId } = req.params;

     const { name, address, location, cuisine , image } = req.body;

     const restaurant = await Restaurant.findById(restaurantId);

     if(!restaurant){
        throw new ApiError(404, "Restaurant not found");
     }

   if(restaurant.createdBy.toString() !== req.user._id.toString()){
      throw new ApiError(403, "You are not authorized to update this restaurant")
 };

   const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      {
         $set: {
            name,
            address,
            coordinates: location,
            cuisine,
            image: uploadedImage?.url || restaurant.image
         }
      },
      { new: true }
   );

   if(!updatedRestaurant){
      throw new ApiError(500, "Failed to update restaurant");
   }

   res
   .status(200)
   .json(new ApiResponse(true, "Restaurant updated successfully", updatedRestaurant));
 });



const getAllRestaurants = asyncHandler(async(req,res,next)=>{
   
   const {name , cusine,search, page = 1, limit = 10}= req.query;

   const filter = { isActive: true };

   if(name){
      filter.name = name;
   }

   if(cusine){
      filter.cusine = cusine;
   }

   if(search){
      filter.$or = [
         { name: { $regex: search, $options: "i" } },    
         { cuisine: { $regex: search, $options: "i" } }
      ];
   }

   const allRestaurants = await Restaurant.find(filter)
     .skip((page - 1) * limit)
     .limit(Number(limit))
     .sort({ createdAt: -1 });

   
   if(!allRestaurants){
      throw new ApiError(404, "Restaurants not found");
   }

   res
   .status(200)
   .json(new ApiResponse(true, "Restaurants fetched successfully",allRestaurants));


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



const updateRestuarantRating = asyncHandler(async(req,res,next)=>{

   const { restaurantId } = req.params;

   const restaurant = await Restaurant.findById(restaurantId);

   if(!restaurant){
     return
   }  

   restaurant.avgRating = (restaurant.avgRating * restaurant.totalReviews + newRating) / (restaurant.totalReviews + 1);

   restaurant.totalReviews += 1;

   await restaurant.save();
});


export {addRestaurantDetails, updateRestaurantDetails, getAllRestaurants, getRestaurantById, deleteRestaurant, updateRestuarantRating};



// add restaurant:address,location,cuisine,images
// create rating options
//comment section
// crud operations for comments section

