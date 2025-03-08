const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder")

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
        number: Number,
        city: String,
        province: String,
        postalCode: String,
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
    avgCost: {
        type: Number,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Create bootcamp slug from the name
BootcampSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// Populate Location fields
BootcampSchema.pre("save", async function (next) {
    const loc = await geocoder.geocode(this.address);

    console.log(loc);

    this.location = {
        type: "Point",
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        number: loc[0].streetNumber,
        city: loc[0].city,
        province: loc[0].state,
        zipcode: loc[1].zipcode,
        country: loc[0].country,
    }

    // Don't save address in DB
    this.address = undefined;
    next();
});

// Cascade delete courses when a bootcamp is deleted
BootcampSchema.pre("deleteOne", { document: true }, async function (next) {
    await this.model("Course").deleteMany({ bootcamp: this._id });
    next();
});

// Reverse populate with virtuals (includes related courses with every bootcamp)
BootcampSchema.virtual("courses", {
    ref: "Course",
    localField: "_id",
    foreignField: "bootcamp",
    justOne: false,
});


module.exports = mongoose.model("Bootcamp", BootcampSchema);
