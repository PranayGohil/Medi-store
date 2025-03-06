import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import feedbackRouter from "./routes/feedbackRoutes.js";

// App config
const app = express();
const port = process.env.PORT || 3000;
connectDB();
connectCloudinary();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/feedback', feedbackRouter);
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