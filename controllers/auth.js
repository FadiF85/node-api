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
