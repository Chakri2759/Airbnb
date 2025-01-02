const express=require("express");
const router=express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middlewares.js");
const listingControllers=require("../controllers/listingControllers.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage });

router.route("/")
    .get(WrapAsync(listingControllers.index))
     .post(isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        WrapAsync(listingControllers.createListing));
    

//new route
router.get("/new",isLoggedIn,listingControllers.renderNewPage);

router.route("/:id")
    .get(WrapAsync(listingControllers.showSingleListing))
    .put(isLoggedIn,isOwner, upload.single('listing[image]'),validateListing,WrapAsync(listingControllers.updateListing)) 
    .delete(isLoggedIn,isOwner,WrapAsync(listingControllers.deleteListing))

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,WrapAsync(listingControllers.editListing));

module.exports=router;