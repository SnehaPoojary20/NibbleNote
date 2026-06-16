import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Restaurant } from "../models/restaurant.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const addRestaurantDetails = asyncHandler(async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

  const { name, address, cuisine } = req.body;

  const latRaw = String(
    req.body.lat ??
      req.body["coordinates[lat]"] ??
      req.body.coordinates?.lat ??
      ""
  ).trim();

  const lngRaw = String(
    req.body.lng ??
      req.body["coordinates[lng]"] ??
      req.body.coordinates?.lng ??
      ""
  ).trim();

  const lat = Number(latRaw);
  const lng = Number(lngRaw);

  if (!name?.trim()) {
    throw new ApiError(400, "Restaurant name is required");
  }

  if (!address?.trim()) {
    throw new ApiError(400, "Address is required");
  }

  if (!cuisine?.trim()) {
    throw new ApiError(400, "Cuisine is required");
  }

  if (latRaw === "" || Number.isNaN(lat)) {
    throw new ApiError(400, "Valid latitude is required");
  }

  if (lngRaw === "" || Number.isNaN(lng)) {
    throw new ApiError(400, "Valid longitude is required");
  }

  const existingRestaurant = await Restaurant.findOne({
    name: name.trim(),
    "coordinates.lat": lat,
    "coordinates.lng": lng,
  });

  if (existingRestaurant) {
    throw new ApiError(409, "Restaurant already exists at this location");
  }

  if (!req.files?.image?.length) {
    throw new ApiError(400, "Restaurant image is required");
  }

  const uploadedImage = await uploadOnCloudinary(
    req.files.image[0].buffer,
    "restaurant_images"
  );

  if (!uploadedImage?.secure_url) {
    throw new ApiError(500, "Failed to upload restaurant image");
  }

  const restaurant = await Restaurant.create({
    name: name.trim(),
    address: address.trim(),
    cuisine: cuisine.trim(),
    coordinates: {
      lat,
      lng,
    },
    image: uploadedImage.secure_url,
    createdBy: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      restaurant,
      "Restaurant added successfully"
    )
  );
});



const updateRestaurantDetails = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { name, address, cuisine } = req.body;

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  if (restaurant.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized");
  }

  const updateFields = {};

  if (name?.trim()) updateFields.name = name.trim();
  if (address?.trim()) updateFields.address = address.trim();
  if (cuisine?.trim()) updateFields.cuisine = cuisine.trim();

  const latRaw = String(
    req.body.lat ??
      req.body["coordinates[lat]"] ??
      req.body.coordinates?.lat ??
      ""
  ).trim();

  const lngRaw = String(
    req.body.lng ??
      req.body["coordinates[lng]"] ??
      req.body.coordinates?.lng ??
      ""
  ).trim();

  const lat = Number(latRaw);
  const lng = Number(lngRaw);

  if (
    latRaw !== "" &&
    lngRaw !== "" &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng)
  ) {
    updateFields.coordinates = {
      lat,
      lng,
    };
  }

  if (req.files?.image?.length) {
    const uploadedImage = await uploadOnCloudinary(
      req.files.image[0].buffer,
      "restaurant_images"
    );

    if (!uploadedImage?.secure_url) {
      throw new ApiError(500, "Failed to upload restaurant image");
    }

    updateFields.image = uploadedImage.secure_url;
  }

  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    { $set: updateFields },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedRestaurant,
      "Restaurant updated successfully"
    )
  );
});



const getAllRestaurants = asyncHandler(async (req, res) => {
  const { name, cuisine, search, page = 1, limit = 10 } = req.query;

  const filter = {
    isActive: true,
  };

  if (name) {
    filter.name = {
      $regex: name,
      $options: "i",
    };
  }

  if (cuisine) {
    filter.cuisine = {
      $regex: cuisine,
      $options: "i",
    };
  }

  if (search && typeof search === "string") {
    const words = search.trim().split(/\s+/);

    if (words.length > 0) {
      filter.$and = words.map((word) => ({
        $or: [
          { name: { $regex: word, $options: "i" } },
          { cuisine: { $regex: word, $options: "i" } },
          { address: { $regex: word, $options: "i" } },
        ],
      }));
    }
  }

  const total = await Restaurant.countDocuments(filter);

  const restaurants = await Restaurant.find(filter)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: restaurants,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
    message: "Restaurants fetched successfully",
  });
});

const getRestaurantById = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant || !restaurant.isActive) {
    throw new ApiError(404, "Restaurant not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      restaurant,
      "Restaurant fetched successfully"
    )
  );
});



const deleteRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant || !restaurant.isActive) {
    throw new ApiError(404, "Restaurant not found");
  }

  if (restaurant.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to delete this restaurant"
    );
  }

  restaurant.isActive = false;
  await restaurant.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Restaurant deleted successfully"
    )
  );
});



const searchRestaurants = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q?.trim()) {
    throw new ApiError(400, "Search query required");
  }

  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const restaurants = await Restaurant.aggregate([
    {
      $match: {
        isActive: true,
        $or: [
          { name: { $regex: escaped, $options: "i" } },
          { cuisine: { $regex: escaped, $options: "i" } },
          { address: { $regex: escaped, $options: "i" } },
        ],
      },
    },
    {
      $addFields: {
        score: {
          $cond: [
            {
              $regexMatch: {
                input: "$name",
                regex: `^${escaped}`,
                options: "i",
              },
            },
            10,
            1,
          ],
        },
      },
    },
    {
      $sort: {
        score: -1,
        avgRating: -1,
      },
    },
    {
      $project: {
        name: 1,
        cuisine: 1,
        address: 1,
        image: 1,
        avgRating: 1,
      },
    },
    {
      $limit: 8,
    },
  ]);

  return res.status(200).json({
    success: true,
    results: restaurants,
  });
});

export {
  addRestaurantDetails,
  updateRestaurantDetails,
  getAllRestaurants,
  getRestaurantById,
  deleteRestaurant,
  searchRestaurants,
};