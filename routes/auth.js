const express = require("express");
const router = express.Router();
// const User = require("../models/User");

// Import the controller functions
const {register} = require("../controllers/auth");

router.route("/register")
    .post(register);


module.exports = router;
