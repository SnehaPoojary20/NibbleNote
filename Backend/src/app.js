import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middlewares/error.middleware.js";

import userRoutes from "./routes/user.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import reviewRoutes from "./routes/review.routes.js";

const app = express();

app.use(cors({
  origin: [
    "https://nibble-note.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({
  extended: true,
  limit: "16kb"
}));

app.use(express.static("public"));

app.use(cookieParser());


// HOME ROUTE
app.get("/", (req, res) => {
  res.send("NibbleNote API Running 🚀");
});


// ROUTES
app.use(
  "/api/v1/users",
  (req, res, next) => {
    console.log(
      "Users route hit:",
      req.method,
      req.url
    );

    next();
  },
  userRoutes
);

app.use(
  "/api/v1/restaurants",
  restaurantRoutes
);

app.use(
  "/api/v1/reviews",
  reviewRoutes
);


// GLOBAL ERROR HANDLER
// MUST BE LAST
app.use(errorHandler);

export { app };