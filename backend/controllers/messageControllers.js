const expressAsyncHandler = require("express-async-handler");

const Message = require('../Models/messageModel');
const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");

const sendMessage = expressAsyncHandler(async(req , res) => {
    const { content , chatId } = req.body;

    if( !content || !chatId ){
        console.log("Invalied data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender : req.user._id,
        content:content,
        chat: chatId,
    };

    try{

        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic")
        message = await message.populate("chat");
        message = await User.populate(message , {
            path:"chat.users",
            select:"name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage:message
        });
        
        res.json(message);

    }catch(err){
        res.status(400);
        console.log(`Error is ${err}`);
        throw new Error(err.Message);
    }

});

const allMessages = expressAsyncHandler(async(req , res)=>{
    try{
        const message = await Message.find({chat: req.params.chatId})
        .populate("sender"," name pic email")
        .populate("chat");

        res.json(message);
    }catch(err){
        res.status(400);
        console.log(`Read Error is ${err}`);
        throw new Error(err.message);
    }
})

module.exports = { sendMessage , allMessages };