const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const env = require("dotenv");
const jwt = require("jsonwebtoken");
const sendOtp = require("../models/saveotp");
const random = require("random");
const saveOtp = require("../models/saveotp");
const SingUpSchema = require("../models/SingUpSchema");
const SaveFinalCandi = require("../models/SaveFinalCandi");
const sendOtpToUser = require("./validation/sendotptouser");
const isValidOtp = require("./validation/isvalidotp");
const SaveAuthToken = require("../models/SaveAuthToken");
const SaveMsg = require("../models/SaveMsg");
const Savepromotoken = require('../models/Savepromotoken');
const fetchuser = require("../middleware/fetchuser");
const mongo = require("mongodb");
const router = express.Router();
env.config();
const JWT_SECRET = process.env.JWT_SECRET;

router.get("/", (res, req) => {
    req.send({ status: "ok" });
});

router.post(
    "/sendotp",
    [body("email", "Enter valid mail").isEmail().exists()],
    async (req, res) => {
        let status = false;
        const validReq = validationResult(req);
        if (!validReq.isEmpty()) {
            res.status(200).json({
                success: status,
                reason: "Please Fill all Field",
            });
        } else {
            let userExist;
            if (!req.body.forgotpassword) {
                userExist = await SingUpSchema.findOne({
                    email: req.body.email,
                });
            } else {
                userExist = null;
            }

            if (userExist) {
                res.status(200).send({
                    success: true,
                    reason: "User is all ready exits",
                });
            } else {
                status = true;
                let cOtp = random.int((min = 100000), (max = 1000000));

                let data = {
                    email: req.body.email,
                    otp: cOtp.toString(),
                };

                saveOtp.create(data, (err) => {
                    if (err) {
                        res.status(200).json({
                            success: false,
                            reason: "Internal server error",
                        });
                    }
                });

                let sendOtpStatus = await sendOtpToUser(data.email, cOtp);
                // console.log(sendOtpStatus);
                if (sendOtpStatus) {
                    res.status(200).json({
                        success: status,
                        reason: "Send OTP successfully",
                    });
                } else {
                    res.status(200).json({
                        success: false,
                        reason: "Internal Server Error",
                    });
                }

                //
            }
        }

        //
    }
);

router.post(
    "/isvalidotp",
    [
        body("fullname", "enter full name").exists(),
        body("email", "enter valid email").exists(),
        body("phone", "enter phone number").exists(),
        body("password", "please enter passwoerd").exists(),
        body("otp", "send otp").exists(),
    ],
    async (req, res) => {
        let status = false;
        const validReq = validationResult(req);
        if (!validReq.isEmpty()) {
            res.status(200).json({
                success: status,
                reason: "Please Enter all fields",
            });
        } else {
            let isValid = await isValidOtp(req.body.email, req.body.otp);

            if (isValid) {
                let bySalt = await bcrypt.genSalt(10);
                let hashPassword = await bcrypt.hash(req.body.password, bySalt);
                let signUpData = {
                    fullname: req.body.fullname,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hashPassword,
                };

                SingUpSchema.create(signUpData, (err) => {
                    if (err) {
                        res.status(200).json(isValid);
                    }
                });
                const promotokenData = {
                    email:req.body.email,
                    promotoken:req.body.promotoken,
                }
                // console.log(promotokenData);

                Savepromotoken.create(promotokenData,(err)=>{
                    if(err){
                        console.log('internal server error with savepromotoken',promotokenData.email,promotokenData.promotoken);
                    }
                })
                res.send({ success: true, reason: "Sign Up Successfully " });
            } else {
                res.send({ success: false, reason: "Please enter valid OTP" });
            }
        }
    }
);

router.post(
    "/login",
    [
        body("email", "please enter email").exists(),
        body("password", "please enter password").exists(),
    ],
    async (req, res) => {
        let status = false;
        const validReq = validationResult(req);
        if (!validReq.isEmpty()) {
            res.status(200).json({
                success: status,
                reason: "Please Enter all fields",
            });
        } else {
            let req_data = {
                email: req.body.email,
                password: req.body.password,
            };

            try {
                User = await SingUpSchema.findOne({ email: req_data.email });
                if (!User) {
                    res.status(200).send({
                        success: false,
                        reason: "Please enter valid password",
                    });
                } else {
                    const passwordCompare = await bcrypt.compare(
                        req_data.password,
                        User.password
                    );

                    if (!passwordCompare) {
                        res.status(200).send({
                            success: false,
                            reason: "Please enter valid password",
                        });
                    } else {
                        let data = {
                            user: {
                                id: User.id,
                            },
                        };

                        const authtoken = jwt.sign(data, JWT_SECRET);
                        const auData = { authToken: authtoken };
                        SaveAuthToken.create(auData, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });

                        status = true;
                        res.status(200).send({
                            success: status,
                            authToken: authtoken,
                            reason: "login successfully",
                        });
                    }
                }
            } catch (error) {
                console.log("Password Invalid");
                res.status(200).send({
                    success: status,
                    reason: "Please check password",
                });
            }

            //
        }
        //
    }
);

router.post("/getuserinfo", fetchuser, async (req, res) => {
    // let req_data = req.user;

    let dt = await SingUpSchema.findOne(
        { _id: mongo.ObjectId(req.user.id) },
        { email: true, fullname: true, phone: true, _id: false }
    );

    if (dt) {
        enrollS = await SaveFinalCandi.findOne({ username: dt._doc.email });
        if (enrollS) {
            dt._doc.enroll = true;
        } else {
            dt._doc.enroll = false;
        }

        res.status(200).send(dt);
    } else {
        dt._doc.enroll = false;
        res.status(200).send(dt);
    }
});

router.post("/getvaliduser", fetchuser, async (req, res) => {
    res.send({ success: true, reason: "User Is Know" });
});

router.post("/logout", fetchuser, (req, res) => {
    const authToken = req.header("auth-token");
    SaveAuthToken.deleteOne({ authToken: authToken }, (err) => {
        if (err) {
            console.log(err);
            res.status(200).send({
                success: false,
                reason: "Something went wrong",
            });
        } else {
            res.status(200).send({ success: true, reason: "Logout" });
        }
    });
});

router.post(
    "/forgotpass",
    [
        body("email", "Enter valid mail").isEmail().exists(),
        body("otp", "Please enter all fields").exists(),
        body("password", "Please enter all fields").exists(),
    ],
    async (req, res) => {
        let status = false;
        const validReq = validationResult(req);
        if (!validReq.isEmpty()) {
            res.status(200).json({
                success: status,
                reason: "Please Enter all fields",
            });
        } else {
            const userExist = await SingUpSchema.findOne({
                email: req.body.email,
            });
            if (userExist) {
                const isValid = await isValidOtp(req.body.email, req.body.otp);

                if (isValid) {
                    const bySalt = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(
                        req.body.password,
                        bySalt
                    );

                    SingUpSchema.updateOne(
                        { email: req.body.email },
                        { $set: { password: hashPassword } },
                        (err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.status(200).send({
                                    success: true,
                                    reason: "Password Change Successfully",
                                });
                            }
                        }
                    );
                }
            } else {
                res.status(200).send({
                    success: false,
                    reason: "Please Enter Valid OTP",
                });
            }
        }
    }
);

router.post(
    "/sendmsg",
    [
        body("name", "please enter name").exists(),
        body("email", "please enter email").exists(),
        body("msg", "please enter msg").exists(),
    ],
    (req, res) => {
        const validReq = validationResult(req);
        if (!validReq.isEmpty()) {
            res.status(200).json({
                success: false,
                reason: "Please Enter all fields",
            });
        } else {
            svData = {
                name: req.body.name,
                email: req.body.email,
                msg: req.body.msg,
            };

            SaveMsg.create(svData, (err) => {
                if (err) {
                    console.log(err);
                    res.send({
                        success: false,
                        reason: "Internal server error",
                    });
                } else {
                    res.send({
                        success: true,
                        reason: "Save msg successfully",
                    });
                }
            });
        }
    }
);

// for getting information
router.get("/get", async (req, res) => {
    let a = null;
    let b = null;

    a = await SingUpSchema.countDocuments({});
    b = await SaveFinalCandi.countDocuments({});
    m = await SaveMsg.countDocuments({});

    res.status(200).send({ a: a, b: b, m: m });
});

module.exports = router;
