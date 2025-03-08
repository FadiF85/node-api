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
