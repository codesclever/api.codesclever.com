const mongoose = require('mongoose');
const { Schema } = mongoose;

const SaveAuthToken = new Schema({
    authToken:{
        type:String,
        required:true
    },

    date:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model('saveauthtoken',SaveAuthToken);