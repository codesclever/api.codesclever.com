const mongoose = require("mongoose");
const { Schema } = mongoose;

const Setdata = new Schema({
    email: {
        type: String,
        required: true,
    },

    marks: {
        type: Number,
        required: true,
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

module.exports = mongoose.model("setdata", Setdata);
