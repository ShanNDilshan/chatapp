import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvetar/UserBadgeItem';

const UpdateGroupChatModal = ({fetchAgain , setFetchAgain}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {selectedChat , setSelectedChat , user} = ChatState();
    const[groupChatName , setGroupChatName] = useState()
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast = useToast();

    const handleRemove = () => {};

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
          setFetchAgain(!fetchAgain);
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

    const handleSearch = () => {};

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
                     <UserBadgeItem key = {user._id} user={u} handleFunction={() => handleRemove(u)}/>
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