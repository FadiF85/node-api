const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please use a valid email address"
        ]
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
    createdAt: Date.now
});

module.exports = mongoose.model("User", UserSchema);
