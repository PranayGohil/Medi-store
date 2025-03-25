import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import feedbackRouter from "./routes/feedbackRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import sitePreferencesRouter from "./routes/sitePreferencesRoutes.js";
import statisticsRouter from "./routes/statisticsRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import paypalRouter from "./routes/paypalRoutes.js";
import couponRouter from "./routes/couponRoutes.js";

// App config
const app = express();
const port = process.env.PORT || 3000;
connectDB();
connectCloudinary();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/category", categoryRouter);
app.use("/api/site", sitePreferencesRouter);
app.use("/api/statistics", statisticsRouter);
app.use("/api/paypal", paypalRouter);
app.use("/api/coupon", couponRouter);
app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.use((err, req, res, next) => {
  console.log("Error : ", err);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
