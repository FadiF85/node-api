const express = require('express');
// We add the mergeParams here
const router = express.Router({ mergeParams: true });

// Import the controller functions
const {getCourses} = require("../controllers/courses");

router.route("/")
    .get(getCourses);

// router.route("/:id")
//     .get(getBootcamp)
//     .post(createBootcamp)
//     .put(updateBootcamp)
//     .delete(deleteBootcamp);

module.exports = router;
