// external imports
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";

// internal imports
import { globalErrorHandler, noMatchRoute } from "./utils/errors.js";
import appRouter from "./routes/index.js";

// create new application and config
const app = express();
dotenv.config();

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// health route
app.use("/health", (_req, res) => {
  res.status(200).json({ healthStatus: "ok" });
});

// routes ( version-1 )
app.use("/api/v1", appRouter);

// unknown route
app.use(noMatchRoute);

// global error handler
app.use(globalErrorHandler);

// database connection with application
mongoose
  .connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
  .then(() => {
    console.log("Database is connected");

    // server is created
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database is not connected");
    console.log("Error: ", error);
  });
