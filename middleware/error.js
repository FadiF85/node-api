const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
    // Log to console for development
    console.log(err.stack);

    let error = {...err};

    console.log("Error name: ",err.name)

    // To check the error.name value and customize the error message based on that
    // Mongoose bad objectId
    if (err.name === "CastError") {
        const message = `Resource not found with id of ${err.value} in the database.`;
        error = new ErrorResponse(message, 404);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });
}

module.exports = errorHandler;
