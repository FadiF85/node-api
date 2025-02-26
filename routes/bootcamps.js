const express = require('express');
const router = express.Router();

// Import the controller functions
const {getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp} = require("../controllers/bootcamps");

router.route("/")
    .get(getBootcamps)
    .post(createBootcamp);

router.route("/:id")
    .post(createBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;
