if(process.env.NODE_ENV !="production"){
     require('dotenv').config() //.env not used in production or deployment
}   

//console.log(process.env.SECRET);
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const bodyParser = require('body-parser');
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const flash=require("connect-flash");
const listing=require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
const listingRoutes=require("./routes/listingRoutes.js");
const reviewRoutes=require("./routes/reviewRoutes.js");
const userRoutes=require("./routes/userRoutes.js");
const passport=require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const MongoStore = require('connect-mongo');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'public')));

//const mongoUrl="mongodb://127.0.0.1:27017/Airbnb";
const dbUrl=process.env.ATLASDB_URL;
//mongo sessions
const store= MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret: process.env.SECRET
      },
      touchAfter:24*3600 //seconds=1day
  });

  store.on("error",()=>{
    console.log("error in mongo store",err);
})
  //express sessions
const sessionOptions={
    
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true

    }
    
}

app.use(flash());
app.use(session(sessionOptions));

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main().then(console.log("connected to DB")).catch(err=>{console.log(err)});
async function main(){
    await mongoose.connect(dbUrl);                                   
}
//locals middleware
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
   // console.log(req.user);
    res.locals.currUser=req.user;
    next();
})
// //demo user
// app.get("/demouser",async(req,res)=>{
//     const demouser=new User({
//         username:"demouser",
//         email:"student@gmail.com"
//     });
//     let regiseredUser= await User.register(demouser,"123456");
//     res.send(regiseredUser);
// })

app.use("/listings",listingRoutes);
app.use("/listings/:id/reviews",reviewRoutes);
app.use("/",userRoutes);
//home
app.get("/",async(req,res)=>{
    let allListings=await listing.find({});
    res.render("./listings/index.ejs",{allListings});
})

app.get("/testListing",(req,res)=>{
    let samplelisting=new listing({
        title:"resort",
        description:"beside beach nice waether",
        price:1000,
        location:"chennai",
        country:"india"
    });
    samplelisting.save() 
    .then(console.log("data saved"),
     res.send("saving successful"))
    .catch(err=>{console.log(err)});
})

//category
app.get("/category/:type",async(req,res)=>{
    let type=req.params.type;
    let filteredLists=await listing.find({category:type});
    console.log(filteredLists);
    res.render("./listings/filter.ejs",{filteredLists}) 
});


//page not found
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})
//Error handling middle ware
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    //res.status(statusCode).send({message});
   
})
app.listen(4232,()=>{
    console.log("server is listening on the port 4232");
});