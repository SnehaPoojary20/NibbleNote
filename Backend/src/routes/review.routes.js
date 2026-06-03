import { Router } from "express";
import{addReview,getReviewsByRestaurant,updateReview,deleteReview,getUserReviews}from "../controllers/review.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Static routes first
router.get("/user", verifyJWT, getUserReviews);
router.get("/restaurant/:restaurantId", getReviewsByRestaurant);

// Param routes after
router.post("/", verifyJWT, addReview);
router.put("/:reviewId", verifyJWT, updateReview);
router.delete("/:reviewId", verifyJWT, deleteReview);

export default router;