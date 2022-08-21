const express = require("express");
const cookieParser=require("cookie-parser")
require("dotenv").config();
const app = express();

const userRoutes = require("./routes/user");

const port = 3001;
app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})

// middlewares that helps to accept request data
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use("/api",userRoutes)

app.get("/",(req,res)=>{
    res.json({message:"This is my firsst get request with prisma"})
})