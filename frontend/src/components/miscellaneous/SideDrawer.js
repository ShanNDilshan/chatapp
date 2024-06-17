import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/layout";
import { Avatar, Button, Menu, MenuButton, Tooltip } from "@chakra-ui/react";
import React, { useState } from 'react';
const SideDrawer = () => {

  const [search , setSearch] = useState("");
  const [searchResult , setSearchResult] = useState([]);
  const [loading , setLoading] = useState(false);
  const [loadingChat , setLoadingChat] = useState();


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
              <Avatar size="sm" cursor='pointer'/>
          </MenuButton>
        </Menu>
      </div>
    </Box>
  </>
  
};

export default SideDrawer;