 import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/layout";
import { Avatar, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "../UserAvetar/UserListItem";
import ProfileModel from "./ProfileModel";





const SideDrawer = () => {

  const [search , setSearch] = useState("");
  const [searchResult , setSearchResult] = useState([]);
  const [loading , setLoading] = useState(false);
  const [loadingChat , setLoadingChat] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { user , setSelectedChat, chats , setChats } = ChatState();
  
  

  const LogOutHandler = () => {
    
    localStorage.removeItem("userInfo");
    navigate("/")
  };

  const toast = useToast();

  const handleSearch = async() => {
      if(!search){
        toast({
          title : "Please Enter Something In Search",
          status : "warning",
          duration : 5000,
          isClosable : true,
          position : "top-left"
        });
        return;
      }
      try{
          setLoading(true)
          const config = {
            headers : {
              Authorization : `Bearer ${user.data.token}`
            },
          };
      
      const {data} = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
      }catch(err){

        toast({
          title : ` Error Occured`,
          description:err.message,
          status : "warning",
          duration : 5000,
          isClosable : true,
          position : "bottom-left"
        });
        return;
      }
  }

  const accessChat = async (user_id) => {
    console.log(user.data.token);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization:`Bearer ${user.data.token}`,
        },
      };
      
        const { data } = await axios.post("/api/chat",  {user_id} , config);
        if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      console.log("METHANATA AWA!!");
      setSelectedChat(data);
      console.log(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  


  return  <>
    <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    bg="white"
    w="100%"
    p="5px 10px 5px 10px"
    borderWidth= "5px"
    >
      <Tooltip label = "Search Users To Chat" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen}>
          <i class="fa fa-search"></i>
          <Text d={{base : "none" , md:"flex"}} px="4" >
            Search User
          </Text>
        </Button>
      </Tooltip>

      <Text fontSize="2xl" fontFamily="serif">MERN CHAAT</Text>
      <div>
        <Menu>
          <MenuButton p={1}>
            <BellIcon fontSize="2xl" margin={1}/>

          </MenuButton>
          
          {/* <MenuList></MenuList> */}
        </Menu>

        <Menu>
            <MenuButton as= {Button} rightIcon={<ChevronDownIcon/>}>
              <Avatar size="sm" cursor="pointer" name={user.data.name} src={user.data.pic}/>
          

          </MenuButton>
          <MenuList>
            <ProfileModel user = {user}>
            <MenuItem>My Profile</MenuItem>
            </ProfileModel>
            <MenuDivider/>
            <MenuItem onClick={LogOutHandler}>Log Out</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>

    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

      <DrawerBody>
        <Box display="flex" pb={2}>
          <Input 
            placeholder="Search By User Credentials"
            mr={2}
            value={search}
            onChange={(e) => setSearch(e.target.value)}/>

            <Button onClick={handleSearch}>Go</Button>
        </Box>

        { loading ? <chatLoading/> : (
          searchResult?.map(user => (
            <UserListItem
            key ={user._id}
            user = {user}
            
            handleFunction = {()=>  accessChat(user._id)}
            />
          ))
        ) }
        {loadingChat && <Spinner ml ='auto' display="flex"/>}
    </DrawerBody>


      </DrawerContent>

    </Drawer>
  </>
  
};

export default SideDrawer;