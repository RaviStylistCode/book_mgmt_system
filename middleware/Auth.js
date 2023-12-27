const jwt=require("jsonwebtoken");
const User=require("../models/userModel");

exports.isAuthenticated=async(req,res,next)=>{

    const {token}=req.cookies;
    if(!token){
        return res.status(400).json({
            success:false,
            message:"cookie not found "
        });
    }
    const decoded= jwt.verify(token,process.env.JWT_TOKEN);
    req.user= await User.findById(decoded._id);
    next();
}