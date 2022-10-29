const mongoose = require('mongoose');
const { Schema } = mongoose;

const Savepromotoken = new Schema({
    email:{
        type:String,
        require:true
    },
    promotoken:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model('savepromotoken',Savepromotoken);