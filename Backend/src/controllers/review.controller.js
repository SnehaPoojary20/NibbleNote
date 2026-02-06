import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Review } from "../models/review.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import mongoose from "mongoose";
import redis from "../utils/redisClient.js";
import axios from "axios";



const recalculateRestaurantStats = async (restaurantId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        restaurantId: new mongoose.Types.ObjectId(restaurantId),
      },
    },
    {
      $group: {
        _id: "$restaurantId",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  await Restaurant.findByIdAndUpdate(restaurantId, {
    avgRating: stats[0]?.avgRating || 0,
    totalReviews: stats[0]?.totalReviews || 0,
  });
};



const addReview = asyncHandler(async (req, res) => {
  const { restaurantId, rating, comment } = req.body;
  const userId = req.user._id;

  if (!restaurantId || !rating || !comment) {
    throw new ApiError(400, "All fields are required");
  }

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || !restaurant.isActive) {
    throw new ApiError(404, "Restaurant not found");
  }

  const numericRating = Number(rating);
  if (numericRating < 1 || numericRating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

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

  await recalculateRestaurantStats(restaurantId);

  res.status(201).json(
    new ApiResponse(true, "Review added successfully", review)
  );
});



const getReviewsByRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  const reviews = await Review.find({ restaurantId })
    .populate("userId", "username")
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(true, "Fetched reviews successfully", reviews)
  );
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

await recalculateRestaurantStats(review.restaurantId);

 res
 .status(200)
 .json(
  new ApiResponse(true, "Review updated successfully", review)
);
});



const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this review");
  }

  const restaurantId = review.restaurantId;

  await review.deleteOne();
  await recalculateRestaurantStats(restaurantId);

  res.status(200).json(
    new ApiResponse(true, "Review deleted successfully", null)
  );
});



const getUserReviews = asyncHandler(async(req,res)=>{

    const userId = req.user._id;

    const reviews = await Review.find({ userId })
    .populate("restaurantId", "name")
    .sort({ createdAt: -1 });

   res
   .status(200)
   .json(
  new ApiResponse(true, "Fetched user reviews successfully", reviews)
);
});



const generateVibeCheck = asyncHandler(async (req, res) => {

  const { restaurantId } = req.params;

  const reviews = await Review.find({ restaurantId })
    .limit(150)
    .select("comment");

  const texts = reviews.map(r => r.comment);

  const cacheKey = `vibe:${restaurantId}`;

  const cached = await redis.get(cacheKey);

if (cached) {
  return res.json(
    new ApiResponse(true, "Vibe fetched from cache", JSON.parse(cached))
  );
}

const prompt = `
Summarize these reviews into 3 short vibe points:
${texts.join("\n")}
`;

  const llmRes = await axios.post(process.env.LLM_API_URL, {
    prompt,
    max_tokens: 120
  });

  const summary = llmRes.data.output;

  await redis.set(cacheKey, JSON.stringify(summary), "EX", 86400);

  res.json(
    new ApiResponse(true, "Vibe generated", summary)
  );
});



export{addReview,getReviewsByRestaurant,updateReview,deleteReview,getUserReviews,generateVibeCheck};

// add review
//getReviewsByRestaurant
//updateReview
//deleteReview
//getUserReviews