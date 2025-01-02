const listing=require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review = require("./models/reviews.js");
const isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //path(originalUrl)-->login-->path(redirect)
        //console.log(req.path,"..",req.originalUrl);
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in");
        return res.redirect("/login");
    }
    next();
}


const saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
        
    }
    next();
}
const isOwner=async(req,res,next)=>{
    let id=req.params.id;
     console.log(id);
    const Listing=await listing.findById(id);
   // console.log(Listing.owner);
   // console.log("Current User:", res.locals.currUser); 
    if(!Listing.owner.equals(res.locals.currUser._id))
    {
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error)
    {   
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error)
    {   
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
const isAuthor=async(req,res,next)=>{
    let {reviewID,id}=req.params;
    const review=await Review.findById(reviewID);
    if(!review.author.equals(res.locals.currUser._id))
    {
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports={isLoggedIn,saveRedirectUrl,isOwner,validateListing,validateReview,isAuthor}