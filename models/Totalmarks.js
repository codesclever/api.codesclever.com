const mongoose = require("mongoose");
const { Schema } = mongoose;

const Totalmarks = new Schema({
    email: {
        type: String,
        required: true,
    },

    marks: {
        type: Number,
        required: true,
    },

    startTime: {
        type: Number,
    },
    endTime: {
        type: Number,
    },

    timeRequired:
    {
        type:Number
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("totalmarks", Totalmarks);
