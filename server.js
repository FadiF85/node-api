const express = require('express');
const dotenv = require('dotenv');
// const logger = require("./middleware/logger");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
const fileUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");

// Load env vars
dotenv.config( {path: "./config/config.env"});

// Get the database connection
const connectDB = require('./config/db');
connectDB();

// Initiate app
const app = express();
// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());

// Set the port
const PORT = process.env.PORT || 5000;

// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");

// Use the middlewares
// app.use(logger);
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Use express-fileupload
app.use(fileUpload());
// Set a static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

// Error handler (it has to be called after the routes have been mounted
app.use(errorHandler);

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
   console.log(`Database error: ${err.message}`);
   // Close server & exit process
    server.close(() => process.exit(1));
});
