const mongoose=require("mongoose");

const connectDatabase=async()=>{
    try {
     const {connection}= await mongoose.connect(process.env.MONGO_URI)
     console.log(`Database connected with ${connection.host}`)
    } catch (error) {
        console.log(`Database Error : ${error.message}`)
    }
}

module.exports=connectDatabase;