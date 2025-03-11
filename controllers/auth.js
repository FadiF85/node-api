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

        // Create token
        const token = user.getSignedJWTToken();

        res.status(201).json({success: true, token, data: user});
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

        // Create token
        const token = await user.getSignedJWTToken();

        res.status(201).json({success: true, token});
    } catch (err) {
        next(err);
    }
}
