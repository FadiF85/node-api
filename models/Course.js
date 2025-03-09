const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    weeks: {
        type: String,
        required: [true, "Weeks number is required"],
    },
    tuition: {
        type: Number,
        required: [true, "Tuition cost is required"],
    },
    minimumSkill: {
        type: String,
        required: [true, "Minimum Skill is required"],
        enum: ["beginner", "intermediate", "advanced"],
    },
    scholarship: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: "Bootcamp",
        required: true
    }
});

// Static method to get average of course
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId },
        },
        {
            $group: {
                _id: "$bootcamp",
                avgCost: { $avg: "$tuition"}
            }
        }
    ]);

    try {
        // Get the related Bootcamp and update its avgCost
        await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
            avgCost: Math.ceil(obj[0].avgCost / 10) * 10
        });
    } catch (err) {
        console.log(err);
    }
}

// Call getAverageCost after save
CourseSchema.post("save", function () {
    this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.post("deleteOne", { document: true, query: false }, async function () {
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
