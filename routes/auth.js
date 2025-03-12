const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth")

// Import the controller functions
const {register, login, getLoggedInUser} = require("../controllers/auth");

router.route("/register")
    .post(register);

router.route("/login")
    .post(login);

router.route("/get-logged-in-user")
    .get(protect, getLoggedInUser);

module.exports = router;
