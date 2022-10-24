const mongoose = require('mongoose');
const { Schema } = mongoose;

const SendOtpSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model('sendotpschema',SendOtpSchema);