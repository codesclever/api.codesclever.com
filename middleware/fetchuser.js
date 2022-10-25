const jwt = require("jsonwebtoken");
const env = require("dotenv");
const SaveAuthToken = require("../models/SaveAuthToken");

env.config();
const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        res.status(200).send({
            success: false,
            reason: "user is unauthenticated",
        });
    } else {
        try {
            const data = jwt.verify(token, JWT_SECRET);
            const checkInDB = await SaveAuthToken.findOne({ authToken: token });
            if (checkInDB) {
                req.user = data.user;
                next();
            } else {
                res.status(200).send({
                    success: false,
                    reason: "user is unauthenticated",
                });
            }
        } catch (error) {
            res.status(200).send({
                success: false,
                reason: "user is unauthenticated",
            });
        }
    }
    //
};

module.exports = fetchUser;
