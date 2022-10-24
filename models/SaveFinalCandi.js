const mongoose = require('mongoose');
const { Schema } = mongoose;

const SaveFinalChandi = new Schema({
    username:{
        type:String,
        required:true
    },
    paymentDetails:{
        type:Object,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model('SaveFinalChandi',SaveFinalChandi);