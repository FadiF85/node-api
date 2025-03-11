const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please use a valid email address"]
    },
    role: {
        type: String,
        enum: ["user", "publisher", "admin"],
        default: "user"
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 6,
        select: false, // That will prevent to return the password with the user fields in API results
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Encrypt the password before storing the User into the database
UserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Sign JWT and return
UserSchema.methods.getSignedJWTToken = function () {
    return jwt.sign({ id:this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
}

module.exports = mongoose.model("User", UserSchema);
