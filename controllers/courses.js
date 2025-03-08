const ErrorResponse = require("../utils/errorResponse");
const Course = require("../models/Course");

// @desc Get courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public
exports.getCourses = async (req, res, next) => {
    try {
        let query;

        if (req.params.bootcampId) {
            query = Course.find({ bootcamp: req.params.bootcampId });
        } else {
            query = Course.find().populate({
                path: "bootcamp",
                select: "name description"
            });
        }

        const courses = await query;

        res.status(200).json({success: true, count: courses.length, data: courses});
    } catch (err) {
        next(err);
    }
}


// @desc Get a single course
// @route GET /api/v1/courses/:id
// @access public
exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id).populate({
            path: "bootcamp",
            select: "name description"
        });

        // In case there is no user with the passed ID
        if (!course) {
            return next(new ErrorResponse(`Course not found with the id of ${req.params.id}`, 404));
        }

        res.status(200).json({success: true, data: course});
    } catch (err) {
        next(err);
    }
}
