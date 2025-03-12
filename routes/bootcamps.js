const express = require("express");
const router = express.Router();
const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResults");
const { protect } = require("../middleware/auth");

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
    .get(advancedResults(Bootcamp, "courses"), getBootcamps)
    .post(protect, createBootcamp);

router.route("/:id")
    .get(getBootcamp)
    .put(protect, updateBootcamp)
    .delete(protect, deleteBootcamp);

router.route("/:id/photo")
    .put(bootcampPhotoUpload);

module.exports = router;
