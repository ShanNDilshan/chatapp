const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const {notFound , errorHandler} = require("./middleware/errorMiddleware");

dotenv.config();
const app = express();
app.use(express.json());
connectDB();


app.get("/", (req,res)=>{
    res.send("API is running successfully");
});

app.use('/api/user/', userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, console.log(`Server Started on Port ${PORT}`.yellow.bold));

