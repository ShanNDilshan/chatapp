import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react';

const ProfileModel = ({user , children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

  return <> 
        {
    children? <span onClick={onOpen}>{children}</span> : (
        <IconButton
            display={{base: "flex"}}
            icon={<ViewIcon/>}
            onClick={onOpen}
        />
    )}
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          display="flex"
          >{user.data.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
            borderRadius="full"
            boxSize="150px"
            src={user.data.pic}
            alt={user.data.name}
            />
            <Text
            fontSize={{base : "28px" , md : "30px"}}
            >
              Email : {user.data.email}
            </Text>
           
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  
};

export default ProfileModel