const mongoose = require("mongoose");
require("dotenv").config();

const MongoURI = process.env.DB_URL;

const connectToMongo = async ()=>{
    try {
        await mongoose.connect(MongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("connected to mongo successfully");

    } catch (error) {
        console.log("mongo connection error", error.message);
        
    }
}

module.exports = connectToMongo;