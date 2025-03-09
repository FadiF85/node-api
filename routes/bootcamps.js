const express = require('express');
const router = express.Router();

// Import the controller functions
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require("../controllers/bootcamps");

// Include other models routes
const courseRouter = require("./courses");

// Re-route into other resource routes
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:postalcode/:distance").get(getBootcampsInRadius);

router.route("/")
    .get(getBootcamps)
    .post(createBootcamp);

router.route("/:id")
    .get(getBootcamp)
    .post(createBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

router.route("/:id/photo")
    .put(bootcampPhotoUpload);

module.exports = router;
