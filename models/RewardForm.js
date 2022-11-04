const mongoose = require("mongoose");
const { Schema } = mongoose;

const RewardForm = new Schema({
    officialname: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    contact: {
        type: String,
        required: true,
    },

    street1: {
        type: String,
        required: true,
    },

    street2: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        required: true,
    },

    postalcode: {
        type: String,
        required: true,
    },

    state: {
        type: String,
        required: true,
    },

    tshirtsize: {
        type: String,
        required: true,
    },

    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("rewardform", RewardForm);
