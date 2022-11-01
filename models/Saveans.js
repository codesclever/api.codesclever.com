const mongoose = require("mongoose");
const { Schema } = mongoose;

const Saveans = new Schema({
    email: {
        type: String,
        required: true,
    },

    qnumber: {
        type: Number,
        required: true,
    },

    ans: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("saveans", Saveans);
