const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config( {path: "./config/config.env"});

// Initiate app
const app = express();
// Set the port
const PORT = process.env.PORT || 5000;

// Route files
const bootcamps = require("./routes/bootcamps");

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);


app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
