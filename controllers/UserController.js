const {prisma} = require("../prisma/primaclient");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// user signup
exports.signUp = async (req,res) => {

    try{

        let {name,email,password}=req.body;

        if(!name || !email || !password){
            return res.status(400).json({success:false,message:"Name email and password is required"})
        }

        await prisma.user.create({
            data:{
                name,
                email,
                password:await bcrypt.hash(password,10),
                created_at:new Date(Date.now())
            }
        })

        return res.status(200).json({success:true,message:"User signup successfully"});

    }catch(err){
        return res.status(400).json({success:false,message:err.message})
    }
}

// user login
exports.login = async (req,res) => {

    try{

        let {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({success:false,message:"Email and password is required"})
        }
        
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            return res.status(400).json({success:false,message:"User email is invalid"})
        }

        const hashedPwd=user.password;

        if(!bcrypt.compare(password, hashedPwd)){
            return res.status(400).json({success:false,message:"Incorrect password"})
        }

        const token = jwt.sign({userId:user.id},process.env.JWT_SECRET,{expiresIn:"1 day"});
        const options={
            expires: new Date(
                Date.now() + 1 * 24 * 60 * 60 * 1000 // cookie expiry time, for now it is 1 day
            ),
            httpOnly: true
        }
        return res.status(200).cookie("token",token,options).json({
            success:true,
            message:"User logged in successfully",
            token
        })

    }catch(err){
        return res.status(400).json({success:false,message:err.message})
    }
}

// user logout
exports.logout = (req,res) => {

    try{
        res.clearCookies("token")
        return res.status(200).json({success:true,message:"User logout successfully"});
    }catch(err){
        return res.status(400).json({success:false,message:err.message})
    }
}