const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({success: true, count: bootcamps.length, data: bootcamps});
    } catch (err) {
        next(err);
    }
}

// @desc Get a single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        // In case there is no user with the passed ID
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));
        }

        res.status(200).json({success: true, data: bootcamp});
    } catch (err) {
        next(err);
    }
}

// @desc Create a new single bootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = async (req, res, next) => {
    try {
        const data = await Bootcamp.create(req.body);
        res.status(201).json({success: true, data: data});
    } catch (err) {
        next(err);
    }
}

// @desc Update a single bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // In case there is no user with the passed ID
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));
        }

        res.status(200).json({success: true, data: bootcamp});
    } catch (err) {
        next(err);
    }
}

// @desc Delete a single bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        // In case there is no user with the passed ID
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));
        }

        res.status(200).json({success: true, data: bootcamp});
    } catch (err) {
        next(err);
    }
}
