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
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    cuisine: {
      type: String,
      required: true,
      index: true,
    },

    image: {
      type: String,
      default: "",
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

//Prevent duplicate restaurants near same location
restaurantSchema.index(
  { name: 1, "coordinates.lat": 1, "coordinates.lng": 1 },
  { unique: true }
);

restaurantSchema.plugin(mongooseAggregatePaginate);

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);

