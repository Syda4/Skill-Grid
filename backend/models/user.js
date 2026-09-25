const mongoose= require('mongoose');

const educationSchema=new mongoose.Schema({
    degree:String,
    institute:String,
    specialization:String,
    cgpa:Number,
    startYear:Number,
    endYear:Number,
},{_id:false});

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    role:{
        type:String,
        enum:['candidate','examiner','admin'],
        default:'candidate'
    },
    phone_no:{
        type:String,
        default:""
    },
    skills:[{type:String}],
    education: [educationSchema],
    isVerified:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    },
    // --- AC-02: LOGIN SECURITY FIELDS ---
    loginAttempts: {
        type: Number,
        required: true,
        default: 0
    },
    lockUntil: {
        type: Date
    }

},{timestamps:true});

const user= mongoose.model('user',userSchema);

module.exports=user;