const otpGenerator= require('otp-generator');

const generatorOtp=()=>{
    return otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
};

module.exports=generatorOtp;