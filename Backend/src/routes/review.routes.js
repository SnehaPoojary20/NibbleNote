import { Router } from "express";
import{addReview,getReviewsByRestaurant,updateReview,deleteReview,getUserReviews}from "../controllers/review.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, addReview);
router.get("/restaurant/:restaurantId", getReviewsByRestaurant);
router.put("/:reviewId", verifyJWT, updateReview);
router.delete("/:reviewId", verifyJWT, deleteReview);
router.get("/user", verifyJWT, getUserReviews);

export default router;