const mongoose = require('mongoose');
const { Schema } = mongoose;

const SavePaymentReq = new Schema({
    paymentId:{
        type:String,
        required:true
    },
    username:{
        type:String,
        require:true
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


module.exports = mongoose.model('SavePaymentReq',SavePaymentReq);