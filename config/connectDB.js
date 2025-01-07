const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb+srv://Kunal:f97QGdgykEHMcvhF@cluster0.wjbcb.mongodb.net/DevTinder")
    }
    catch(err){        
        console.log("Could not Estabilish Connection with DataBase: ", err)
    }
}

module.exports = connectDB