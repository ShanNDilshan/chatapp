import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";


const Login = () => {
    
    const[email, setEmail] =  useState();
    const[password, setPassword] =  useState();
    const[show, setShow] =  useState(false);
    const handleClick = () => setShow(!show);
    const[loading , setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    
    const submitHandler = async() => {
        
        setLoading(true);
        if(!email || !password){
        toast({
          title: 'Please Fill all the field!.',
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position: "bottom"
        });
        setLoading(false);
        return;

        
        } 
        try {
                const config = {
                    Headers : {
                        "Content-type" : "application/json",

                    },
                };
                const data = await axios.post("/api/user/login", {  email , password}, 
                    config);
                    
        toast({
          title: "Login Successful!.",
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: "bottom"
        });  
        localStorage.setItem('userInfo', JSON.stringify(data));
        setLoading(false);
        navigate("/chat");
                
            
    }catch(err){
        toast({
          title: "Error Occured!.",
          description : err.response.data.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: "bottom"
        }); 
            }
        
    };

  return (
    <VStack spacing= '5px' border= "black" >
        <FormControl id='name' isRequired>
            <FormLabel>Email : </FormLabel>

            <Input
            placeholder='Enter Email : '
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
        </FormControl>

        

        <FormControl id='password' isRequired>
            <FormLabel>Password : </FormLabel>

            <InputGroup>
            <Input
            type= {show? "text" : "password"}
            placeholder="Enter Your Password "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <InputRightElement width="4.5rem">
                <Button h = "1.75rem" size = "sm" onClick={handleClick} >
                    { show ? "Hide" : "Show"}
                </Button>
            </InputRightElement>

            </InputGroup>
            
        </FormControl>

        

        

        <Button
        colorScheme="blue"
        width="100%"
        style={{marginTop: 15}}
        onClick={submitHandler}
        isLoading = {loading}>
            Login
        </Button>

        <Button
        colorScheme="red"
        width="100%"
        style={{marginTop: 15}}
        onClick={()=>{
            setEmail("guest@Example.com");
            setPassword("123456");
            submitHandler();
            
        }}
        isLoading = {false}>
            Login as a Guest
        </Button>

    </VStack>
  )
}

export default Login