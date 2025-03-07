const express = require('express');
const router = express.Router();

// Import the controller functions
const {getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius} = require("../controllers/bootcamps");

router.route("/radius/:postalcode/:distance").get(getBootcampsInRadius);

router.route("/")
    .get(getBootcamps)
    .post(createBootcamp);

router.route("/:id")
    .get(getBootcamp)
    .post(createBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;
