const mongoose=require("mongoose");

const bookSchema= new mongoose.Schema({

    name:{
        type:String,
        required:[true,"please enter name"]
    },

    title:{
        type:String,
        required:[true,"please enter title "]
    },

    description:{
        type:String,
        required:[true,"please enter description"]
    },
    
    stock:{
        type:Number,
        default:0
    },

    rating:{
        type:Number,
        default:0
    },

    comments:[
        {
           userId:{
            type:mongoose.Schema.ObjectId,
            ref:"user",
           },
           comment:{
            type:String,
            required:true
           }
        }
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports= mongoose.model("book",bookSchema);