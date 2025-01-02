const express=require("express");
const { default: mongoose } = require("mongoose");
const app=express();
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=Schema({
    email:{
        type:String,
        required:true
    }

});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);