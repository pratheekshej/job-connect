import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();
const app = express();
const API = (api) => `/api/v1/${api}`;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration
const corsOptions = {
    origin: ['https://jobconnect-hag.netlify.app', 'http://localhost:5173'], // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, etc.)
};

// Use CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions)); // This is fine for handling preflight

const PORT = process.env.PORT || 8000;

// API Routes
app.use(API('user'), userRoute);
app.use(API('company'), companyRoute);
app.use(API('job'), jobRoute);
app.use(API('application'), applicationRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
