const User=require("../models/user.js");
//rener signup
module.exports.renderSignup=(req,res)=>{
    res.render("user/signup.ejs");
}
//signup
module.exports.signup=async(req,res)=>{
    try{
    const {username,email,password}=req.body;
    const newUser={username,email};
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser, function(err) {
        if (err) { return next(err); }
        req.flash("success","Welcome to Airbnb!");
        res.redirect("/listings");
      });
    console.log("new user registered");
    
    }catch(err){
          req.flash("error",err.message);
          res.redirect("/signup");
    }

}
//render login
module.exports.renderLogin=(req,res)=>{
    res.render("user/login.ejs");
}
//login
module.exports.login= async(req,res)=>{
    req.flash("success","Welcome back to Airbnb");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
}
//logout
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","you are logged out successfully!");
    res.redirect("/listings");
    })

    
}