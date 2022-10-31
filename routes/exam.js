const express = require("express");
const router = express.Router();
const AllQnA = require('../models/Allqna');
const fetchuser = require("../middleware/fetchuser");


router.post('/getquestions',fetchuser,(req,res)=>{
    AllQnA.find({qnumber:req.body.currentqn+1});
    // 
    
})

// router.post('/saveans',fetchuser,(req,res)=>{
     

// })

router.post('/saveqna',(req,res)=>{
    const fD = {
        qnumber:req.body.qnumber,
        question:req.body.question,
        a:req.body.a,
        b:req.body.b,
        c:req.body.c,
        d:req.body.d,
        ans:req.body.ans,
    }
    AllQnA.create(fD,(err)=>{
        if(err){
            res.send({success:false,reason:'internal server error'});
        }
        else{
            res.send({success:true,reason:'save successfully'});
        }
    })
    
})


router.get('/',(req,res)=>{
    res.send({'status':'ok'});
})

module.exports = router;


