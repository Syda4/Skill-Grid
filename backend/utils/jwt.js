const jwt= require('jsonwebtoken');

const generateToken=(user)=>{
    return jwt.sign({
        id:user._id,
        email: user.email,
        role:user.role
    },process.env.SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE,
    });
};

module.exports=generateToken;