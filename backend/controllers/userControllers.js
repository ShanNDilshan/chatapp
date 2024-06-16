const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const genarateToken = require("../config/genarateToken");


const registerUser = asyncHandler(async(req , res) => {
    const {name , email , password , pic} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please Enter All The Fields");

    }
    const userExists = await User.findOne({email})

    if(userExists){
       
        res.status(400);
        throw new Error("User Exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
        
    });

    if(user){

        user.token = genarateToken(user._id);
        await user.save();
        res.status(201).json({
            _id:user._id,
            name: user.name,
            email: user.email,
            pic : user.pic,
        })
    }else {
        res.status(400);
        throw new Error("Fail to Create a User");

    }
});

const authUser = asyncHandler(async (req,res) => {
    const { email , password } = req.body;

    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))){
        
        res.json({
            _id:user._id,
            name: user.name,
            email: user.email,
            pic : user.pic,
            token : genarateToken(user._id),
        });
        
        
    } else {
        res.status(401);
        throw new Error("Invalid User Or Password");
    }

});

// /api/user?
const allUsers = asyncHandler(async(req , res) => {
    const keyword = req.query.search 
    ? {
        $or:[
            {name: {$regex: req.query.search, $options: "i"}},
            {email : {$regex : req.query.search, $options:"i"}},
        ], }
        : {};

        const users = await User.find(keyword).find( {_id: {$ne : req.user._id}})
        res.send(users);
    });

module.exports = {registerUser , authUser , allUsers};