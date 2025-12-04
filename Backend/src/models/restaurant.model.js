import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    cuisine: {
      type: String,
      required: true,
    },

    image: {
      type: String, 
      default: "",
    },

    avgRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, 
  }
);

restaurantSchema.plugin(mongooseAggregatePaginate);

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
