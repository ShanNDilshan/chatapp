const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const app = express();
dotenv.config();

app.get("/", (req,res)=>{
    res.send("API is running Succesfully");
});

app.get("/api/chat", (req, res) => {
    res.send(chats)
});

app.get("/api/chat/:id", (req, res) =>{
   // res.send(console.log(req.params.id));
   const singleChat = chats.find(c => c._id === req.params.id);
   res.send(singleChat);
})

const PORT = process.env.PORT;
app.listen(PORT, console.log(`Server Started on Port ${PORT}`));

