import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Authentication/Login';
import SignUp from '../components/Authentication/SignUp';

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        
       

        if(user){
            navigate("/chat");
            
            
        }

    } , [navigate])
     
  return (
    <Container maxW = 'xl' centerContent>
        <Box
        d = "flex"
        justifyContent="center"
        p = {3}
        bg = "white"
        w ="100%"
        m = "40px 0 15px 0"
        borderRadius= "lg"
        borderWidth= "1px"
        >
            <Text
            fontSize="x-large" fontFamily="Work sans" color= "black" textAlign= "center"
            >MERN-CHAAT</Text>
        </Box>
        <Box bg = "white" width="100%" p={4} borderRadius="lg" color= "black" borderWidth= "1px" >
 <Tabs variant='soft-rounded' colorScheme='green'>
  <TabList mb="1em">
    <Tab width= "50%">Login</Tab>
    <Tab width= "50%">SignUp</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <SignUp/>
    </TabPanel>
  </TabPanels>
</Tabs>
        </Box>
    </Container>
    )
}

export default Homepage