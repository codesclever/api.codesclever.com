const jwt = require('jsonwebtoken');
const env = require('dotenv');

env.config();
const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(200).send({success:false,reason:'user is unauthenticated'});
    }

    try {
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user
        next();
    } catch (error) {
        res.status(200).send({success:false,reason:'user is unauthenticated'});
    }
}

module.exports = fetchUser;