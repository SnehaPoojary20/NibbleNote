import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";
import {
  addRestaurantDetails,
  updateRestaurantDetails,
  getAllRestaurants,
  getRestaurantById,
  deleteRestaurant,
} from "../controllers/restaurant.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
 

const router = Router();

// Protected route with image upload
router.post("/", 
  verifyJWT,  
  upload.fields([{ name: "image", maxCount: 1 }]), 
  addRestaurantDetails
);

router.get("/", getAllRestaurants);
router.get("/:restaurantId", getRestaurantById);

// Protected route with image upload
router.put("/:restaurantId",
  verifyJWT, 
  upload.fields([{ name: "image", maxCount: 1 }]), 
  updateRestaurantDetails
);

router.delete("/:restaurantId", verifyJWT, deleteRestaurant);

export default router;
