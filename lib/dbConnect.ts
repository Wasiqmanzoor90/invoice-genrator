import mongoose from "mongoose";

export const dbConnect = async () => {
    if(mongoose.connections[0].readyState )
    {
        console.log("already connected to db")
        
    }
    try{
        await mongoose.connect("mongodb://localhost:27017/PdfDb");
        console.log("connected to db");
    }
    catch(error) {
        console.log(error);
    }
}