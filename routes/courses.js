const express = require('express');
// We add the mergeParams here
const router = express.Router({mergeParams: true});

// Import the controller functions
const {getCourses, getCourse, createCourse, updateCourse, deleteCourse} = require("../controllers/courses");

router.route("/")
    .get(getCourses)
    .post(createCourse);

router.route("/:id")
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);

module.exports = router;
