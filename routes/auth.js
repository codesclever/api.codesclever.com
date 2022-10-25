const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const env = require("dotenv");
const jwt = require("jsonwebtoken");
const sendOtp = require("../models/saveotp");
const random = require("random");
const saveOtp = require("../models/saveotp");
const SingUpSchema = require("../models/SingUpSchema");
const sendOtpToUser = require("./validation/sendotptouser");
const isValidOtp = require("./validation/isvalidotp");
const SaveAuthToken = require("../models/SaveAuthToken");
const fetchuser = require('../middleware/fetchuser');
const mongo = require("mongodb");
const router = express.Router();
env.config();
const JWT_SECRET = process.env.JWT_SECRET;


router.get('/',(res,req)=>{
    req.send({status:'ok'});
})


router.post(
    "/sendotp",
    [body("email", "enter valid mail").isEmail().exists()],
    async (req, res) => {
        let status = false;
        const validReq = validationResult(req);
        if (!validReq.isEmpty()) {
            res.status(200).json({
                success: status,
                reason: "Please Fill all Field",
            });
        } else {
            status = true;
        }

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


        let sendOtpStatus = await sendOtpToUser(data.email,cOtp);
        // console.log(sendOtpStatus);
        if(sendOtpStatus){
            res.status(200).json({
                success: status,
                reason: "Send OTP successfully",
            });
        }
        else{
            res.status(200).json({
                success: false,
                reason: "Internal Server Error",
            });
        }
    }
);

router.post(
    "/isvalidotp",
    [
        body("fullname", "enter full name").exists(),
        body("email", "enter valid email").exists(),
        body("phone", "enter phone number").exists(),
        body("password","please enter passwoerd").exists(),
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
        }
        let isValid = await isValidOtp(req.body.email, req.body.otp, true);
        if (isValid.success) {
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
        }

        res.send(isValid);
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
        }

        let req_data = {
            email: req.body.email,
            password: req.body.password,
        };
        let User = null;
        let passwordCompare = null;

        try {
            User = await SingUpSchema.findOne({ email: req_data.email });
            if (!User) {
                res.status(200).send({
                    success: false,
                    reason: "Please enter valid password",
                });
            }
            passwordCompare = await bcrypt.compare(
                req_data.password,
                User.password
            );

            if (!passwordCompare) {
                res.status(200).send({
                    success: false,
                    reason: "Please enter valid password",
                });
            }

            let data = {
                user:{
                    id: User.id,
                }
            };

            const authtoken = jwt.sign(data, JWT_SECRET);
            const auData = {authToken:authtoken};
            SaveAuthToken.create(auData,(err)=>{
                if(err){
                    console.log(err);
                }
            })

            
            status = true;
            res.status(200).send({
                success: status,
                "authToken": authtoken,
                reason: "login successfully",
            });
        } catch (error) {
            console.log("Password Invalid");
            // res.status(200).send({success:status,reason:'Please check password'});
        }
    }
);

router.post("/getuserinfo", fetchuser, async (req, res) => {
    // let req_data = req.user;
    const dt = await SingUpSchema.findOne({_id:mongo.ObjectId(req.user.id)},{email:true,fullname:true,phone:true,_id:false});
    res.status(200).send(dt);
});

router.post('/getvaliduser',fetchuser,async (req,res)=>{
    res.send({success:true,reason:'User Is Know'});
})

router.post('/logout',fetchuser,(req,res)=>{
    const authToken = req.header('auth-token');
    SaveAuthToken.deleteOne({authToken:authToken},(err)=>{
        if(err){
            console.log(err);
            res.status(200).send({success:false,reason:'Something went wrong'});
        }
        else{
            res.status(200).send({success:true,reason:'Logout'});
        }
    });
})



module.exports = router;
