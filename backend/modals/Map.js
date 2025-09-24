const mongoose = require("mongoose");
const {Schema} = mongoose;

const mapSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
     },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    placeName:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    imageURL:{
        type: String,
    },
    rating:{
        type: Number
    },
    visited:{
        type: Boolean,
        required: true
    },
    description:{
        type: String
    }
    

}, {timestamps: true});

module.exports = mongoose.model("map", mapSchema);