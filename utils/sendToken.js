
const sendToken=(user,res,statusCode,message)=>{
    const token=user.getJwt();

   const option={
    maxAge:5 * 60 * 1000,
    httpOnly:true
   }

   res.status(statusCode).cookie("token",token,option).json({
    success:true,
    message,
    user,
    token
   })


}

module.exports=sendToken;