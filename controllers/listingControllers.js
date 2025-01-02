const listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
//index
module.exports.index=async(req,res)=>{
    let allListings=await listing.find({});
    res.render("./listings/index.ejs",{allListings})
}
//new
module.exports.renderNewPage=(req,res)=>{
    res.render("./listings/new.ejs");
}

//show (individual listing)
module.exports.showSingleListing=async(req,res)=>{
    let id=req.params.id;
    const singleListing=await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    //console.log(singleListing);
    if(!singleListing){
        req.flash("error","Listing doesnot exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{singleListing});
}

//create new listing
module.exports.createListing=async(req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
   // console.log(response.body.features[0].geometry);
   // res.send("done");
    let url=req.file.path;
    let filename=req.file.filename;
    //console.log(url,"...",filename);
    let newListing=new listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing Created");
    res.redirect("/listings");
    
}

//edit
module.exports.editListing=async(req,res)=>{
    let id=req.params.id;

    const Listing=await  listing.findById(id);
    req.flash("success","New Listing Updated");
    if(!Listing){
        req.flash("error","Listing doesnot exist");
        res.redirect("/listings");
    }
    let originalImageUrl=Listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_300");
    res.render("./listings/edit.ejs",{Listing,originalImageUrl});
}

//update
module.exports.updateListing=async(req,res)=>{
    let id=req.params.id;
    const updatedListing= await listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(req.body);
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        updatedListing.image={url,filename};
        await updatedListing.save();
    }
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
    // let location=updatedListing.location;
    updatedListing.geometry=response.body.features[0].geometry;
    // console.log(req.body.listing.location);
    // console.log(response.body.features[0].geometry);
    await updatedListing.save();
   // res.redirect(`/listings/${id}`);
   res.render("./listings/show.ejs",{singleListing : updatedListing})
}

//delete
module.exports.deleteListing=async(req,res)=>{
    let id=req.params.id;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings");
}