import { Box } from "@chakra-ui/layout";
import React, { useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";

const Chatpage = () => { 

  const { user } = ChatState();
  const[fetchAgain , setFetchAgain] = useState(false);
    
  return <div style={{width : "100%"}}>
      { user && <SideDrawer/> }

      <Box  display ="flex" justifyContent="space-between" w= "100%" h = "91.5vh" p= "10px">
      { user && <MyChats fetchAgain={fetchAgain} /> }
      { user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> }
      </Box>
   </div> 
   
  
}

export default Chatpage