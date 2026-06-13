import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/user.model.js";
import { Restaurant } from "../src/models/restaurant.model.js";
import { DB_NAME } from "../src/constants.js";
import connectDB from "../src/db/index.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
  console.log("Connected to DB");

  // Fix users
  const users = await User.find({
    profilePic: { $regex: "^http://res.cloudinary.com" },
  });

  for (const user of users) {
    user.profilePic = user.profilePic.replace("http://", "https://");
    await user.save({ validateBeforeSave: false });
    console.log(`Fixed user: ${user.username}`);
  }

  // Fix restaurants
  const restaurants = await Restaurant.find({
    image: { $regex: "^http://res.cloudinary.com" },
  });

  for (const r of restaurants) {
    r.image = r.image.replace("http://", "https://");
    await r.save({ validateBeforeSave: false });
    console.log(`Fixed restaurant: ${r.name}`);
  }

  console.log(`Done. Fixed ${users.length} users, ${restaurants.length} restaurants.`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});