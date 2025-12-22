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

router.post("/", verifyJWT, addRestaurantDetails);
router.get("/", getAllRestaurants);
router.get("/:restaurantId", getRestaurantById);
router.put("/:restaurantId", verifyJWT, updateRestaurantDetails);
router.delete("/:restaurantId", verifyJWT, deleteRestaurant);

export default router;
