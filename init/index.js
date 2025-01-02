
const mongoose=require("mongoose");
const initData=require("./data.js");
const listing=require("../models/listing.js");
const mongoUrl="mongodb://127.0.0.1:27017/Airbnb";
//const dbUrl=process.env.ATLASDB_URL;
main().then(console.log("connected to DB")).catch(err=>{console.log(err)});
async function main(){
    await mongoose.connect(mongoUrl);
}

const initDB=async ()=>{
   await listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        geometry: obj.geometry || {
            type: "Point",
            coordinates: [0, 0]},
            category: obj.category || "Trending", 
        owner: new mongoose.Types.ObjectId("6746c51508de2b26fd998752"),
    }));
   // console.log(initData.data);
    await listing.insertMany(initData.data);
    console.log("data was initilaized");
}
initDB();