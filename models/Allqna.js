const mongoose = require("mongoose");
const { Schema } = mongoose;

const AllQnA = new Schema({
    qnumber: {
        type: Number,
        required: true,
    },

    question: {
        type: String,
        required: true,
    },

    a: {
        type: String,
        required: true,
    },

    b: {
        type: String,
        required: true,
    },

    c: {
        type: String,
        required: true,
    },
    d: {
        type: String,
        required: true,
    },

    ans: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("allqna", AllQnA);
