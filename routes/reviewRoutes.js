const express=require("express");
const router=express.Router({mergeParams : true}); 
const WrapAsync = require("../utils/WrapAsync.js");

const {validateReview,isAuthor, isLoggedIn}=require("../middlewares.js");
const reviewsControllers=require("../controllers/reviewsControllers.js");


//review route
router.post("/",validateReview,WrapAsync(reviewsControllers.review));

//delete review route
router.delete("/:reviewID",isLoggedIn,isAuthor,WrapAsync(reviewsControllers.deleteReview));

module.exports=router;