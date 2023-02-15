import express from "express";
import cors from "cors";
import "./db/index";
import goalRoutes from "./routes/goalsRoute";
import userRoutes from "./routes/userRoutes";
import errorHandler from "./middleware/errormiddleware"

const app = express();

const options: cors.CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "http://localhost:3000",
  preflightContinue: false,
};

app.use(cors(options));

const port = process.env.PORT || 5000;


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/goals", goalRoutes);
app.use("/api/users", userRoutes)

// Error Handler
app.use(errorHandler)

