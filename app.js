const express=require("express");
const bodyParser= require("body-parser");
const cookieParser= require("cookie-parser");

const app=express();
app.use(express.json());
app.unsubscribe(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

const userRouter = require("./routes/userRoute");
const bookRouter = require("./routes/bookRoute");

app.use("/api/v1/users",userRouter);
app.use("/api/v1/books",bookRouter);


module.exports=app;