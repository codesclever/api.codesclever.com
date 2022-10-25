const express = require("express");
const { body, validationResult } = require("express-validator");
const mongo = require("mongodb");
const bcrypt = require("bcryptjs");
const env = require("dotenv");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Razorpay = require('razorpay');
const fetchuser = require('../middleware/fetchuser');
const shortid = require('shortid');
const SingUpSchema = require("../models/SingUpSchema");
const SavePaymentReq =  require('../models/SavePaymentReq');
const SaveFinalCandi = require('../models/SaveFinalCandi');



const razorpay = new Razorpay({
	key_id: 'rzp_live_4TbWavxZvbhMjv',
	key_secret: 'yvhjvbbVcCGy4Q4PMoOzTy6k'
});

router.post('/verification',async (req,res)=>{
    // do the verifications
    const secret = 'rbs1&gbs2=mmbs&&fbbs'; //same as rezorpaywebhook secret
    const crypto = require('crypto');

	const shasum = crypto.createHmac('sha256', secret);
	shasum.update(JSON.stringify(req.body));
	const digest = shasum.digest('hex');

	// console.log(digest, req.headers['x-razorpay-signature']);

	if (digest === req.headers['x-razorpay-signature']) {
        const patmentIDIS = req.body.payload.payment.entity.order_id;
        // console.log('patmentIDIS now is',patmentIDIS);
        const ptInfo = await SavePaymentReq.findOne({paymentId:patmentIDIS},{username:true});
        // console.log('ptmUsername',ptInfo.email);

        const saveData = {
            username:ptInfo.username,
            paymentDetails:req.body
        }

        SaveFinalCandi.create(saveData, (err) => {
            if (err) {
                console.log(err);
            }
        });
        
		// process it
        // console.log(req.body.payload.payment.entity);
		// require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))

	}
	res.json({ status: 'ok' })

})


router.post('/razorpay',fetchuser, async (req,res)=>{
    const payment_capture = 1;
	const amount = 249;
	const currency = 'INR';

    const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

    let dt = null;

    try {
        dt = await SingUpSchema.findOne({_id:mongo.ObjectId(req.user.id)},{email:true,fullname:true,phone:true,_id:false});
    } catch (error) {
        console.log(error);
    }

    try {
		const response = await razorpay.orders.create(options);
        
		// console.log(response.id);
        const resData = {
            paymentId:response.id,
            username:dt.email,
            paymentDetails:response
        }

        SavePaymentReq.create(resData, (err) => {
            if (err) {
                console.log(err);
            }
        });

		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount,
            userDetails:dt,
		})
	} catch (error) {
		console.log(error)
	}

})


module.exports = router;
