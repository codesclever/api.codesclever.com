const mongoose = require("mongoose");
const env = require('dotenv')
env.config();
const MONGO_URL = process.env.MONGO_URI;

const connectToMongo = () => {
    mongoose.connect(
        MONGO_URL,
        { useNewUrlParser: true, useUnifiedTopology: true},
        (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("[+]DB connect successfully");
            }
        }
    );
    
};

module.exports = connectToMongo;
