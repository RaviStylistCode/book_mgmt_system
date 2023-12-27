const mongoose=require("mongoose");
const validator=require("validator");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        unique:true,
        required:[true,"email is required"],
        validate:[validator.isEmail,"please enter a valid email"]
    },

    password:{
        type:String,
        required:true,
        minLength:[8,"password must be of 8 character"]
    },

    role:{
        type:String,
        default:"user"
    },

    otp:Number,
    otp_expire:Date,
    verified:{
        type:Boolean,
        default:false
    },
    resetOtp:Number,
    resetOtpExpire:Date,
    
    createdAt:{
        type:Date,
        default:Date.now
    }
});

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

userSchema.methods.getJwt=function(){
    return jwt.sign({_id:this._id},process.env.JWT_TOKEN);
}

userSchema.methods.comparePassword=async function(getPassword){
    return await bcrypt.compare(getPassword,this.password);
}

module.exports=mongoose.model("user",userSchema);