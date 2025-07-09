const mongoose = require("mongoose")
const mongodb = require("mongodb")

module.exports.connect = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connect Success =)))")
    } catch (error) {
        console.log("Connect Error!! :(((")
    }
}