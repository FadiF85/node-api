const express = require('express');
// We add the mergeParams here
const router = express.Router({mergeParams: true});

// Import the controller functions
const {getCourses, getCourse, createCourse} = require("../controllers/courses");

router.route("/")
    .get(getCourses)
    .post(createCourse);

router.route("/:id")
    .get(getCourse);

module.exports = router;
