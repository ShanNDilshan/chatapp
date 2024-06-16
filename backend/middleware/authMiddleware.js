
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async(req , res , next) => {
    let token;

    if(req.headers.authorization && 
       req.headers.authorization.startsWith("Bearer") 
    ){
        try{
            token = req.headers.authorization.split(" ")[1];

            // Await the import of jsonwebtoken and User model
            const { default: jwt } = await import('jsonwebtoken');
            const { default: User } = await import('../Models/userModel.js');

            //decode the token id

            const decoded =  jwt.verify(token , process.env.JWT_SECRET);
            
            req.user = await User.findById(decoded.id).select("-password");
            next();
        }catch(err){
            res.status(401);
            throw new Error(`Not autherized, token faild Error is ${err}`);
        }
    }
    if(!token){
        res.status(401);
            throw new Error("Not autherized, no token");
    }
})

module.exports = { protect };