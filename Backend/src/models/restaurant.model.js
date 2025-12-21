import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },

    cuisine: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    image: {
      type: String,
      required: true,
    },

    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true, // soft delete support
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate restaurants at same location 
restaurantSchema.index(
  { name: 1, "coordinates.lat": 1, "coordinates.lng": 1 },
  { unique: true }
);

// Enable search by name, cuisine, address 
restaurantSchema.index({
  name: "text",
  cuisine: "text",
  address: "text",
});

// Pagination support 
restaurantSchema.plugin(mongooseAggregatePaginate);

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);


