import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import io from "socket.io-client";
import { ChatState } from '../Context/ChatProvider';
import animationData from '../animation/typing.json';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ScrollableChat from './ScrollableChat';
import ProfileModel from './miscellaneous/ProfileModel';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import './styles.css';

const ENDPOINT = "http://localhost:5000"; 
var socket, selectedChatCompare;

//notification , setNotification

const SingleChat = ({fetchAgain, setFetchAgain}) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const toast = useToast();

   const { user , selectedChat , setSelectedChat , notification , setNotification } =  ChatState();

   const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };


   const fetchMessages = async() => {
    if(!selectedChat)return;

    try{
        const config = {
          headers: {
            Authorization: `Bearer ${user.data.token}`
          },
        };
        setLoading(true);
        const { data } = await axios.get(`/api/message/${selectedChat._id}`,config);
        
        setMessages(data);
        setLoading(false);
        socket.emit('join chat', selectedChat._id);
        
    }catch(err){
        toast({
          title: "Error Occured!",
          description: `Failed to send the Message : ${err.message}`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right"
        })
    }
   };

   useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

   useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;

   } ,[selectedChat]);

   console.log(notification , "------?");

   useEffect(() => {
    socket.on("message recieved",(newMessageRecieved)=> {
      
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
        // notify
        if(!notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved , ...notification]);
          setFetchAgain(!fetchAgain);

        }

      }else{
        setMessages([...messages , newMessageRecieved])
      }
    })
   });

   const sendMessage = async(event) => {
    if(event.key === "Enter" && newMessage){
      socket.emit("stop typing", selectedChat._id);
        try{
            const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.data.token}`,
          },
        };
        setNewMessage(""); 
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
       // console.log(data);

       socket.emit("new message", data);
           
        setMessages([...messages , data]);  
        }catch(err){
        toast({
          title: "Error Occured!",
          description: `Failed to send the Message : ${err.message}`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right"
        })
    }
    }
   };

    

   const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //Typing indicator logic
    if(!socketConnected) return;

    if(!typing){
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;

        if(timeDiff>= timerLength && typing){
          socket.emit('stop typing', selectedChat._id);
          setTyping(false);
        }
    }, timerLength);
   };

   
  return ( <>

  
    
    {selectedChat?(
        <>
        <Text
        fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
        >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            { (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModel
                    user={getSenderFull(user, selectedChat.users)}
                  />

                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal 
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}

                /> 
                  
                  
                  
                  
                </>
              ))}
        </Text>

        <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />

              </div>
            )}
            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              { istyping?<div>
                <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div>: (<></>) }
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>

          </Box>
        </>
    ):(
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
    )}
   </>
  );
} ;

export default SingleChat;