const geocoder = require("../utils/geocoder.js");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const path = require("path");

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = async (req, res, next) => {
    try {
        res.status(200).json(res.advancedResults);
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
        const bootcamp = await Bootcamp.findById(req.params.id);

        // In case there is no user with the passed ID
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));
        }

        // Remove the bootcamp
        // We do it this way to trigger the pre/remove hook that applies the cascade/delete
        await bootcamp.deleteOne();

        res.status(200).json({success: true, data: bootcamp});
    } catch (err) {
        next(err);
    }
}


// @desc Get Bootcamps within a radius
// @route DELETE /api/v1/bootcamps/radius/:postalcode/:distance
// @access private
exports.getBootcampsInRadius = async (req, res, next) => {
    try {
        const {postalcode, distance} = req.params;

        // Get lat/lng from geocoder
        const location = await geocoder.geocode(postalcode);
        const lat = location[0].latitude;
        const lng = location[0].longitude;

        // Calculate the radius using radians
        // Divide the distance by the radius of Earth
        // Earth radius = 6,378 KM
        const radius = distance/6378;

        const bootcamps = await Bootcamp.find({
            location: { $geoWithin: {$centerSphere: [ [lng, lat], radius] } },
        });

        res.status(200).json({success: true, count: bootcamps.length, data: bootcamps});
    } catch (err) {
        next(err);
    }
}


// @desc Upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access private
exports.bootcampPhotoUpload = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        // In case there is no user with the passed ID
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));
        }

        if (!req.files) {
            return next(new ErrorResponse("Please upload a file.", 400));
        }

        const file = req.files.file;
        console.log("FILE: ", file);

        // Make sure the file is an image
        if (!file.mimetype.startsWith("image/")) {
            return next(new ErrorResponse("Please upload an image file.", 400));
        }

        // Check file size
        if (file.size > process.env.MAX_FILE_SIZE) {
            return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_SIZE}`, 400));
        }

        // Create a custom file name
        file.name = `photo_${Date.now()}${path.parse(file.name).ext}`;

        // Upload the file
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (error) => {
            if (error) {
                console.error(error);
                return next(new ErrorResponse("Something went wrong.", 500));
            }

            await Bootcamp.findByIdAndUpdate(req.params.id, {
                photo: file.name
            });

            res.status(200).json({success: true, data: bootcamp});
        });

    } catch (err) {
        next(err);
    }
}
