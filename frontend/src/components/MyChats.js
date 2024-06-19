import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';

const MyChats = () => {
  const [loggedUser , setLoggedUser] = useState();
  const {selectedChat , setSelectedChat , user , chats , setChats } = ChatState();


  const toast = useToast();
  
  const fetchChats = async() => {
    //console.log(user.data._id);
    try{
      const config = {
            headers : {
              Authorization : `Bearer ${user.data.token}`,
            },
          };

          const { data } = await axios.get("/api/chat" , config);
          setChats(data);
          console.log("Data is : " ,data);
    }catch(err){
        toast({
          title : "Error Ocuured!",
          description : "Failed to load the chats",
          status : "error",
          duration : 5000,
          isClosable : true,
          position : "bottom-left"
        });
        return;
        
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);

  return <div>MyChats</div>
  
};

export default MyChats;