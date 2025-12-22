import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Review } from "../models/review.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"



const addReview = asyncHandler(async(req,res)=>{

  const { restaurantId, rating, comment } = req.body;
  const userId = req.user._id;

   // Validate input
   if (!restaurantId || !rating || !comment) {
    throw new ApiError(400, "All fields are required");
  }

  const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

    // Prevent multiple reviews by same user
  const existingReview = await Review.findOne({ userId, restaurantId });
  if (existingReview) {
    throw new ApiError(409, "You have already reviewed this restaurant");
  }

  const review = await Review.create({
    userId,
    restaurantId,
    rating: numericRating,
    comment,
  });

    //update restuarant stats
    const stats = await Review.aggregate([  
        {$match:{restaurantId:review.restaurantId}},
        {
            $group:{
            _id:"$restaurantId",
            avgRating:{$avg:"$rating"},
            totalReviews:{$sum:1}
            }
        }
    ]); 

    await Restaurant.findByIdAndUpdate(restaurantId,{
        avgRating:stats[0]?.avgRating ,
        totalReviews:stats[0]?.totalReviews ,
    });

    res
    .status(201)
    .json(new ApiResponse(201, review, "Review added successfully") )

});



const getReviewsByRestaurant = asyncHandler(async(req,res)=>{

    const restaurantId = req.params;

    if(!restaurantId){
        throw new ApiError(400,"Restaurant ID is required");
    }

    const reviews = await Review
                       .find({restaurantId})
                       .populate('userId','username')
                       .sort({ createdAt: -1 });;

    if(!reviews || reviews.length===0){
        throw new ApiError(404,"No reviews found for this restaurant");
    }

    res
    .status(200)
    .json({success:true,
        message:"Fetched reviews successfully",});
});



const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this review");
  }

  if (!comment) {
    throw new ApiError(400, "Comment cannot be empty");
  }

  const numericRating = Number(rating);
  if (numericRating < 1 || numericRating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  review.rating = numericRating;
  review.comment = comment;
  await review.save();

  res.status(200).json(
    new ApiResponse(200, review, "Review updated successfully")
  );
});



const deleteReview = asyncHandler(async(req,res)=>{
     const { reviewId } = req.params;

     const review = await Review.findById(reviewId);

    if(!review){
        throw new ApiError(400,"Review not found");
    }

    if(review.userId.toString() !== req.user._id.toString()){
        throw new ApiError(403,"You are not authorized to delete this review");
    }

    await review.deleteOne();

     res
     .status(200)
     .json(
    new ApiResponse(200, null, "Review deleted successfully")
  );
});



const getUserReviews = asyncHandler(async(req,res)=>{

    const userId = req.user._id;

    const reviews = await Review.find({ userId })
    .populate("restaurantId", "name")
    .sort({ createdAt: -1 });

    res
    .status(200)
    .json(new ApiResponse(200, reviews, "Fetched user reviews successfully")
  );
});




export{addReview,getReviewsByRestaurant,updateReview,deleteReview,getUserReviews};

// add review
//getReviewsByRestaurant
//updateReview
//deleteReview
//getUserReviews