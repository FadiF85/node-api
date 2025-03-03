const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
    // Log to console for development
    console.log(err.stack);

    let error = {...err};

    console.log("Fadi Error ", );

    // To check the error.name value and customize the error message based on that
    // Mongoose bad objectId
    if (err.name === "CastError") {
        const message = `Resource not found with id of ${err.value} in the database.`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        let duplicateValue = err.keyValue;
        let keys = Object.keys(duplicateValue);
        let duplicateKey = keys[0];

        const message = `Duplicate value (${duplicateValue[duplicateKey]}) for the ${duplicateKey} property.`;
        error = new ErrorResponse(message, 400);
    }

    // Models validation rules
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(item => item.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });
}

module.exports = errorHandler;
