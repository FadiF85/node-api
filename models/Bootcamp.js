const mongoose = require("mongoose");
const slugify = require("slugify");

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
        trim: true,
        maxLength: [50, "Name can not be more than 50 characters"],
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        maxLength: [500, "Description can not be more than 500 characters"],
    },
    website: {
        type: String,
        match: [/^(https?:\/\/)[^\s/$.?#].[^\s]*$/i, "Please use a valid URL with HTTPS or HTTPS"]
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
        maxLength: [20, "Phone number can not be longer than 20 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please use a valid email address"],
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: false
        },
        coordinates: {
            type: [Number],
            required: false,
            index: "2dsphere"
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            "Web Development",
            "Mobile Development",
            "UI/UX",
            "Data Science",
            "Business",
            "Other"
        ]
    },
    averageRating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [10, "Rating can not be more than 10"],
    },
    averageCost: Number,
    photo: {
        type: String,
        default: "no-photo.jpg",
    },
    housing: {
        type: Boolean,
        default: false,
    },
    jobAssistance: {
        type: Boolean,
        default: false,
    },
    jobGuarantee: {
        type: Boolean,
        default: false,
    },
    acceptGi: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Create bootcamp slug from the name
BootcampSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
