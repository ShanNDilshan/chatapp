import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvetar/UserBadgeItem';
import UserListItem from '../UserAvetar/UserListItem';

const UpdateGroupChatModal = ({  fetchAgain, setFetchAgain , fetchMessages }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {selectedChat , setSelectedChat , user} = ChatState();
    const[groupChatName , setGroupChatName] = useState()
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast = useToast();

    const handleRemove = async(user1) => {
        if (selectedChat.groupAdmin._id !== user.data._id && user1._id !== user.data._id) {
             toast({
                title: "Admin can't leave!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                    });
                    return;
    }
    try{
        setLoading(true);
        const config = {
            headers : {
              Authorization : `Bearer ${user.data.token}`
            },
          };

          const { data } = await axios.put('api/chat/groupremove', {
            chatId : selectedChat._id,
            userId : user1._id,
          }, config);

          user1._id === user.data._id ? setSelectedChat() : setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          fetchMessages()
          setLoading(false);

    }catch(err){
        toast({
          title : "Error Ocuured!",
          description : `This Error is : ${err.message}`,
          status : "error",
          duration : 5000,
          isClosable : true,
          position : "bottom-left"
        });
        setLoading(false);
    }
    };

    const handleRename = async() =>{
        if(!groupChatName) return;


        try{
            setRenameLoading(true);

            const config = {
            headers : {
              Authorization : `Bearer ${user.data.token}`,
            },
          };

          const {data} = await axios.put('/api/chat/rename', {
            chatId: selectedChat._id,
            chatName: groupChatName,
          }, config)

          setSelectedChat(data);
          //setFetchAgain(!fetchAgain);
          setRenameLoading(false);

        }catch(err){

        toast({
          title : "Error Ocuured!",
          description : `This Error is : ${err.message}`,
          status : "error",
          duration : 5000,
          isClosable : true,
          position : "bottom-left"
        });
        setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleSearch = async(query) => {
        setSearch()
        if(!query){
            console.log("Nothing Inside The Query")
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
      console.log("Data is : ", data);
      setLoading(false);
      setSearchResult(data);

        } catch(err){

    toast({
        title: "Error Occured!",
        description: `Failed to Load the Search Results Error is : ${err}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });

        }
    };

    const handleAddUser = async(user1) => {
        if(selectedChat.users.find((u) => u._id === user1._id)){
            toast({
                title: "User Already in the group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
                 });
                 return;
        }

        if (selectedChat.groupAdmin._id !== user.data._id) {
             toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                    });
                    return;
    }
        try{
            setLoading(true);

        const config = {
            headers : {
              Authorization : `Bearer ${user.data.token}`
            },
          };

          const { data } = await axios.put('api/chat/groupadd', {
            chatId : selectedChat._id,
            userId : user1._id,
          }, config);

          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setLoading(false);

        }catch(err){

            toast({
                title: "Error Occured!",
                description: `Error Is : ${err.message}`,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                    });
                    setLoading(false);
                    
        }

    }

  return (
    <>
      <IconButton display={{base : "flex"}} icon={<ViewIcon/>} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

            <Box display="flex" flexDir="column" alignItems="center">
                {selectedChat.users.map(u => (
                     <UserBadgeItem key = {user.data._id} user={u} handleFunction={() => handleRemove(u)}/>
                ))}
            </Box>

            <FormControl display="flex">
                <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />

               <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            

            {
                loading? (
                    <Spinner size='lg'/>

                ):(
                    searchResult?.map((user)=>(
                        <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={()=>{handleAddUser(user)}}
                        />
                    ))
                )
            }
            
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )

}

export default UpdateGroupChatModal