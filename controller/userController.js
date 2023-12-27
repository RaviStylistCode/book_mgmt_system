const User=require("../models/userModel");
const asyncError=require("../middleware/asyncError");
const sendMail=require("../utils/sendMail");
const sendToken=require("../utils/sendToken");

exports.register=asyncError(async(req,res)=>{

    const {name,email,password}=req.body;
    if(!name || !email || !password){
        return res.status(400).json({
            success:false,
            message:"please enter all fields "
        })
    }
    const otp=Math.floor(Math.random() * 1000000);
    const user= await User.create({
        name,
        email,
        password,
        otp,
        otp_expire:new Date(Date.now() + 5 * 60 * 1000)
    });

    await sendMail(email,"OTP VERIFICATION MAIL", `This is email verification otp : ${otp}`);
    sendToken(user,res,200,`Mail is sent on ${email} || please verify your account`);
});


// login 

exports.login=asyncError(async(req,res)=>{

    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"please enter all fields"
        })
    }

    const user= await User.findOne({email}).select("+password");
    if(!user){
        return res.status(404).json({
            success:false,
            message:"user not found"
        })
    }

    const isMatch= await user.comparePassword(password);
    if(!isMatch){
        return res.status(404).json({
            success:false,
            message:"Invalid username or password"
        })
    }

    sendToken(user,res,200,`Welcome back ${user.name}`);

});

// verify otp

exports.verifyEmail=asyncError(async(req,res)=>{

    const otp=Number(req.body.otp);
    // console.log(otp)
    if(!otp){
        return res.status(400).json({
            success:false,
            message:"invalid otp"
        })
    }

    const user = await User.findById(req.user._id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:"Invalid user"
        })
    }
    
    if(user.otp !== otp || user.otp_expire< Date.now()){
        return res.status(404).json({
            success:false,
            message:"Invalid otp or has been expired"
        })
    }

    user.verified=true;
    user.otp=null;
    user.otp_expire=null;
    await user.save();
    sendToken(user,res,200,"Account Verified");
})

// Logout

exports.logout=asyncError((req,res)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    });
})

// Profile 

exports.Profile=asyncError(async(req,res)=>{

    const user= await User.findById(req.user._id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:"user does not exist"
        })
    }
    const userData={
        _id:req.user._id,
        name:req.user.name,
        email:req.user.email,
        verified:req.user.verified
    }

    res.status(200).json({
        success:true,
        message:"user profile",
        userData
    })
});


// update profile name

exports.updateprofile= asyncError(async(req,res)=>{

    const {name}=req.body;
    if(!name){
        return res.status(400).json({
            success:false,
            message:"please enter your name"
        })
    }
    const user= await User.findById(req.user._id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:"user not found",
            user
        })
    }

    user.name=name;
    await user.save();
    sendToken(user,res,205,"Profile Updated");
})

// forget Password

exports.forgetpassword=asyncError(async(req,res)=>{

    const {email}=req.body;
    if(!email){
        return res.status(400).json({
            success:false,
             message:"Invalid Email"
        })
    }
    const user= await User.findOne({email});
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User does not exist"
        })
    }

    const otp= Math.floor(Math.random() * 1000000);
    user.resetOtp=otp;
    user.resetOtpExpire= new Date(Date.now() + 5 * 60 * 1000);
    await user.save();
    await sendMail(email,"For Resetting Password",`This ${otp} for resetting password`);

    res.status(200).json({
        success:false,
        message:`mail sent to ${email}`
    });
})

// resetPassword

exports.resetpassword= asyncError(async(req,res)=>{

    const {otp,newPassword}=req.body;
    if(!otp || !newPassword){
        return res.status(400).json({
            success:false,
            message:"please enter all fields"
        })
    }
    const user = await User.findOne({
        resetOtp:otp,
        resetOtpExpire:{$gt:Date.now()}
    });

    if(!user){
        return res.status(404).json({
            success:false,
            message:"user does not exist"
        })
    }

    user.password=newPassword;
    user.resetOtp=null;
    user.resetOtpExpire=null;
    await user.save();
    sendToken(user,res,200,"Password Updated successfully");
})

// Single user

exports.getSingleUser = asyncError(async(req,res)=>{

    const {id}=req.params;
    const user= await User.findById(id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:"user does not exist"
        })
    }

    res.status(200).json({
        success:true,
        message:"User found",
        user
    });

})

// Delete User

exports.deleteUser= asyncError(async(req,res)=>{

    const {id}=req.params;
    const user= await User.findById(id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:"user does not exist"
        })
    }
    await user.deleteOne();
    res.status(200).json({
        success:true,
        message:"user deleted successfully"
    });

})


// All user

exports.allUsers=asyncError(async(req,res)=>{

    const user = await User.find();
    if(!user){
        return res.status(404).json({
            success:false,
            message:"user not found"
        });
    }

    res.status(200).json({
        success:true,
        message:"All users details",
        user
    })
})


// All verifed User

exports.VerifiedUsers= asyncError(async(req,res)=>{

    const user =await User.find({verified:true});
    if(!user){
        return res.status(404).json({
            success:false,
            message:"user not found"
        });
    }
    
    res.status(200).json({
        success:true,
        message:"Alll Verified Users",
        user
    })
})

// All unverified users

exports.UnverifiedUsers= asyncError(async(req,res)=>{

    const user = await User.find({verified:false});
    if(!user){
        return res.status(404).json({
            success:false,
            message:"user not found"
        });
    }

    res.status(200).json({
        success:true,
        message:"All Unverified Users",
        user
    })
})


