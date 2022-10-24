const saveOtp = require("../../models/saveotp");
const SignUpSchema = require("../../models/SingUpSchema");

isValidOtp = async (email,otp,isFirst=false)=>{
    if(isFirst){
        let getU = await SignUpSchema.findOne({email:email});
        if(getU){
            return {success:false,reason:'User is all ready exist'};
        }
    }

    let isValid = await saveOtp.findOne({email:email,otp:otp});
    try {
        if(isValid.otp === otp){
            saveOtp.deleteMany({email:email},(err)=>{console.log('delete otp successfully form database')});
            return {success:true,reason:"Sign in successfully"};
        }
        else{
            return {success:false,reason:"Please enter valid otp"};
        }
    } catch (error) {
        return {success:false,reason:"User not exits"};
    }
 
}

module.exports = isValidOtp;