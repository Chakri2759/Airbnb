const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middlewares.js");
const userControllers=require("../controllers/userControllers.js");

router.route("/signup")
    .get(userControllers.renderSignup)
    .post(WrapAsync(userControllers.signup));

router.route("/login")
    .get(userControllers.renderLogin)
    .post( saveRedirectUrl,passport.authenticate(
    'local', { failureRedirect: '/login', failureFlash:true}),
    userControllers.login
    );

//logout
router.get("/logout",userControllers.logout);

module.exports=router;