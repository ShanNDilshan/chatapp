import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/layout";
import { Avatar, Button, Drawer, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Tooltip, useDisclosure } from "@chakra-ui/react";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./ProfileModel";


const SideDrawer = () => {

  const [search , setSearch] = useState("");
  const [searchResult , setSearchResult] = useState([]);
  const [loading , setLoading] = useState(false);
  const [loadingChat , setLoadingChat] = useState();
  const navigate = useNavigate();
  const { user } = ChatState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  

  const LogOutHandler = () => {
    
    localStorage.removeItem("userInfo");
    navigate("/")
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
        <Button variant="ghost">
          <i class="fa fa-search" aria-hidden="true"></i>
          <Text display={{base : "none" , md:"flex"}} px="4" >

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

    <Drawer placement="left" >

    </Drawer>
  </>
  
};

export default SideDrawer;