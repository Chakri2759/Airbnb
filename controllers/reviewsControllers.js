const listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
//create review
module.exports.review=async(req,res)=>{
       
    // console.log(id);
      const revlist= await listing.findById(req.params.id);
     //console.log(revlist);
      let newReview= new Review(req.body.Review);
      newReview.author=req.user._id;
      console.log(newReview);
      revlist.reviews.push(newReview);
      await revlist.save();
      await newReview.save();
     console.log("new review saved");
     req.flash("success","New Review Created");
     res.redirect(`/listings/${revlist._id}`);
      
}
//delete review
module.exports.deleteReview=async(req,res)=>{
    let {id,reviewID}=req.params;
    console.log(id);
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}