require('dotenv').config();

const express= require('express');
const cors= require('cors');
const cookieParser= require('cookie-parser');
const helmet= require('helmet');

const mongoDb= require('./connection');
const signin_upRoute=require('./routes/signin_up');
const adminRoutes = require("./routes/admin.route");
const candidateRoutes = require("./routes/candidate.route");
const examinerRoutes = require("./routes/examiner.route");
const questionRoutes = require("./routes/question.route");
const attemptRoute = require("./routes/attempt.route");
const resultRoutes = require("./routes/result.route");
const certificateRoute=require("./routes/certificate.route");
const skillRoute = require("./routes/skill");
const reportRoute = require("./routes/report");

const app=express();
const port= process.env.PORT;
const mongo_url=process.env.MONGO_URI;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(cookieParser());
app.use(helmet());
app.use('/auth',signin_upRoute);
app.use("/admin", adminRoutes);
app.use("/candidate", candidateRoutes);
app.use("/examiner", examinerRoutes);
app.use("/question", questionRoutes);
app.use("/attempt", attemptRoute);
app.use("/result", resultRoutes);
app.use("/certificate",certificateRoute);
app.use("/skill", skillRoute);
app.use("/analytics", reportRoute);

app.get('/',(req,res)=>{
    res.send("Page under process...");
});

mongoDb(mongo_url)
    .then(()=>console.log("Database is running..."))
    .catch((err)=>console.log("Error occurs..."));

app.listen(port,()=>{
    console.log("Server is running...");
});