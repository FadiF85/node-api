const express = require('express');
const dotenv = require('dotenv');
// const logger = require("./middleware/logger");
const morgan = require("morgan");

// Load env vars
dotenv.config( {path: "./config/config.env"});

// Get the database connection
const connectDB = require('./config/db');
connectDB();

// Initiate app
const app = express();
// Set the port
const PORT = process.env.PORT || 5000;

// Route files
const bootcamps = require("./routes/bootcamps");

// Use the middlewares
// app.use(logger);
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}


// Mount routes
app.use("/api/v1/bootcamps", bootcamps);


const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
   console.log(`Database error: ${err.message}`);
   // Close server & exit process
    server.close(() => process.exit(1));
});
