const saveOtp = require("../../models/saveotp");
const SignUpSchema = require("../../models/SingUpSchema");

isValidOtp = async (email,otp)=>{

    let isValid = await saveOtp.findOne({email:email,otp:otp});
    try {
        if(isValid.otp === otp){
            saveOtp.deleteMany({email:email},(err)=>{console.log('delete otp successfully form database')});
            return true
        }
        else{
            return false
        }
    } catch (error) {
        return false
    }
 
}

module.exports = isValidOtp;