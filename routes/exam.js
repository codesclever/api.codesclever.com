const express = require("express");
const mongo = require("mongodb");
const AllQnA = require("../models/Allqna");
const fetchuser = require("../middleware/fetchuser");
const SingUpSchema = require("../models/SingUpSchema");
const Saveans = require("../models/Saveans");
const Totalmarks = require("../models/Totalmarks");
const RewardForm = require("../models/RewardForm");
const SaveFinalCandi = require("../models/SaveFinalCandi");
const Setdata = require("../models/Setdata");

const router = express.Router();

router.post("/startexam", fetchuser, async (req, res) => {
    const dt = await SingUpSchema.findOne({ _id: mongo.ObjectId(req.user.id) });
    const cTime = new Date().getTime();
    const Cdata = {
        email: dt._doc.email,
        marks: 0,
        startTime: cTime,
        endTime: 0,
        timeRequired: 0,
    };

    const userExist = await Totalmarks.findOne({ email: Cdata.email });
    if (userExist) {
        res.send({
            success: false,
            reason: "You have all ready submit the test",
        });
    } else {
        Totalmarks.create(Cdata, (err) => {
            if (err) {
                res.send({ success: false, reason: "internal server error" });
            } else {
                res.send({ success: true, reason: "Start Exam" });
            }
        });
    }
});

router.post("/endexam", fetchuser, async (req, res) => {
    const dt = await SingUpSchema.findOne({ _id: mongo.ObjectId(req.user.id) });
    const cTime = new Date().getTime();
    const Cdata = {
        email: dt._doc.email,
        endTime: cTime,
    };
    Totalmarks.updateOne(
        { email: Cdata.email },
        { $set: { endTime: Cdata.endTime } },
        (err) => {
            if (err) {
                console.log(err, cTime, Cdata.email);
            }
        }
    );

    const getTotalmarks = await Totalmarks.findOne({ email: Cdata.email });
    const st = getTotalmarks._doc.startTime;
    const et = getTotalmarks._doc.endTime;
    const tr = et - st;

    Totalmarks.updateOne(
        { email: Cdata.email },
        { $set: { timeRequired: eval(et - st) } },
        (err) => {
            if (err) {
                console.log(err, cTime, Cdata.email);
                res.send({ success: false, reason: "internal server error" });
            } else {
                res.send({
                    success: true,
                    reason: "Submit Answers Successfully",
                });
            }
        }
    );
});

router.post("/getquestions", fetchuser, async (req, res) => {
    const cuQ = req.body.currentQN + 1;
    // console.log(req.body.currentQN);
    // const cuQ = 5;
    const q = await AllQnA.find({ qnumber: cuQ }, { ans: false });
    res.send(q[0]);
});

router.post("/saveans", fetchuser, async (req, res) => {
    const dt = await SingUpSchema.findOne({ _id: mongo.ObjectId(req.user.id) });
    if (dt) {
        const ansData = {
            email: dt._doc.email,
            qnumber: req.body.qnumber,
            ans: req.body.ans,
        };

        const fAns = await AllQnA.findOne(
            { qnumber: ansData.qnumber },
            { ans: true }
        );
        const currentMarks = await Totalmarks.findOne(
            { email: ansData.email },
            { marks: true }
        );

        // console.log(ansData.qnumber, fAns._doc.ans, ansData.ans);

        if (fAns._doc.ans === ansData.ans) {
            Totalmarks.updateOne(
                { email: ansData.email },
                { $set: { marks: currentMarks._doc.marks + 1 } },
                (err) => {
                    if (err) {
                        console.log(err);
                    }
                }
            );
        }

        Saveans.create(ansData, (err) => {
            if (err) {
                res.send({ success: false, reason: "Internal server error" });
            } else {
                res.send({ success: true, reason: "Save ans successfully" });
            }
        });
    } else {
        res.send({ success: false, reason: "user not exits" });
    }
});

// for testing localhost
router.post("/saveqna", (req, res) => {
    const fD = {
        qnumber: req.body.qnumber,
        question: req.body.question,
        a: req.body.a,
        b: req.body.b,
        c: req.body.c,
        d: req.body.d,
        ans: req.body.ans,
    };
    AllQnA.create(fD, (err) => {
        if (err) {
            res.send({ success: false, reason: "internal server error" });
        } else {
            res.send({ success: true, reason: "save successfully" });
        }
    });
});

router.post("/liveboard", async (req, res) => {
    const livedata = await Setdata.find()
        .limit(100)
        .sort({ marks: -1, timeRequired: 1 });
    res.send(livedata);
});

router.get("/liveboard", async (req, res) => {
    const livedata = await Totalmarks.find()
        .limit(100)
        .sort({ marks: -1, timeRequired: 1 });
    res.send(livedata);
});

router.post("/getvalid", fetchuser, async (req, res) => {
    const dt = await SingUpSchema.findOne({
        _id: mongo.ObjectId(req.user.id),
    });

    // console.log(dt._doc.email);

    const dt1 = await SaveFinalCandi.findOne({
        username: dt._doc.email,
    });

    // console.log(dt1);

    if (dt1) {
        const userExist = await Totalmarks.findOne({ email: dt._doc.email });
        if (userExist) {
            res.send({
                success: false,
                reason: "You have all ready submit the test",
            });
        } else {
            res.send({ success: true, reason: "Start The Test" });
        }
    } else {
        res.send({ success: false, reason: "enroll and get the test" });
    }
});

router.post("/updatelive", (req, res) => {
    data = {
        email: req.body.email,
        marks: req.body.marks,
        timeRequired: req.body.timetaken,
    };

    Setdata.create(data, (err) => {
        if (err) {
            res.send({ success: false, reason: "internal server error" });
        } else {
            res.send({ success: true, reason: "update successfully" });
        }
    });
});

router.post("/rewardform", fetchuser, (req, res) => {
    const rewardData = {
        officialname: req.body.officialname,
        email: req.body.email,
        contact: req.body.contact,
        street1: req.body.street1,
        street2: req.body.street2,
        city: req.body.city,
        postalcode: req.body.postalcode,
        state: req.body.state,
        tshirtsize: req.body.tshirtsize,
    };

    RewardForm.create(rewardData, (err) => {
        if (err) {
            res.send({
                success: false,
                reason: "please check all fields are filled internal server error",
            });
        } else {
            res.send({
                success: true,
                reason: "Your information save successfully",
            });
        }
    });
});

router.get("/", (req, res) => {
    res.send({ status: "ok" });
});

module.exports = router;
