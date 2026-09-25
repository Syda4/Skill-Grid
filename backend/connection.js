const mongoose = require("mongoose");

async function mongoDb(url){
    return mongoose.connect(url);
};

module.exports=mongoDb;