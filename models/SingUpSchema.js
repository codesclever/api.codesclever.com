const mongoose = require('mongoose');
const { Schema } = mongoose;

const signUpUser = new Schema({
    email:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model('signUpUser',signUpUser);