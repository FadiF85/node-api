const express = require("express");
// We add the mergeParams here
const router = express.Router({mergeParams: true});
const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Import the controller functions
const {getCourses, getCourse, createCourse, updateCourse, deleteCourse} = require("../controllers/courses");

router.route("/")
    .get(advancedResults(Course, {
        path: "bootcamp",
        select: "name description"
    }), getCourses)
    .post(protect, authorize(["admin", "publisher"]), createCourse);

router.route("/:id")
    .get(getCourse)
    .put(protect, authorize(["admin", "publisher"]), updateCourse)
    .delete(protect, authorize(["admin", "publisher"]), deleteCourse);

module.exports = router;
