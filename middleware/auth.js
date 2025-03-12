const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorResponse");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");


// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    // Get the token value
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }

    if (!token) {
        return next(new ErrorResponse("Not authorized to access this resource.", 401));
    }

    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Add the user to the request
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        console.log(err);
        return next(new ErrorResponse("Invalid token.", 400));
    }
}
