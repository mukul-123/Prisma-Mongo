const jwt = require("jsonwebtoken");
const {prisma} = require("../prisma/primaclient");

exports.IsLoggedInMiddleware = async (req,res,next) => {

    try{

        const token = req.cookie.token;

        if(!token){
            return res.status(401).json({success:false,message:"You are not authorized"})
        }
    
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        
        const {userId}=decoded;

       const userInfo = await prisma.user.findUnique({
            where:{
                id:userId
            }
        })

        if(!userInfo){
            return res.status(400).json({success:false,message:"User info not found"})
        }

        next()

    }catch(err){
        return res.status(400).json({success:false,message:"Internal server error",error:err.message})
    }
}