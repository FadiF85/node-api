const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// @desc Register user
// @route POST /api/v1/auth/register
// @access public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Create user
        const user = await User.create({
            name,
            email,
            password, role
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
}


// @desc Login user
// @route POST /api/v1/auth/login
// @access public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return next(new ErrorResponse(`Email and password are required`, 400));
        }

        // Check if the user exists
        const user = await User.findOne({ email }).select("+password"); // we select the password here because it's emitted in the User model

        if (!user) {
            return next(new ErrorResponse(`Invalid credentials`, 401));
        }

        // Check if the password matches
        const isMatched = await user.matchPassword(password);

        if (!isMatched) {
            return next(new ErrorResponse(`Invalid credentials`, 401));
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
}


// Get token from model, create cookie and send response
// This function returns a token and a cookie, and it's up to the client what to use for authentication
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJWTToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res.status(statusCode).cookie('token', token, options).json({success: true, token});
}
