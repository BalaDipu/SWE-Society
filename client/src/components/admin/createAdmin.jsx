import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/authContext";

const CreateAdmin = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reg_no, setReg_no] = useState("");
  const [requestStatus, setRequestStatus] = useState("none");
  const toast = useToast();
  const { unauthorizedHandler } = useContext(AuthContext);

  const handleSubmit = () => {
    setRequestStatus("loading");
    axios
      .patch("/api/user/setadmin/", {
        reg_no,
        role: "admin",
      })
      .then((res) => {
        setRequestStatus("none");
        onClose();
        toast({
          title: "Admin Created",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        unauthorizedHandler(err);
        onClose();
        toast({
          title: "Something Went Wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setRequestStatus("error");
      });
  };

  return (
    <>
      <Center
        textAlign="center"
        minW="150px"
        bg="green.600"
        color="white"
        _hover={{ bg: "green.800", color: "white", textDecoration: "none" }}
        transition="ease 0.3s"
        shadow="xl"
        borderRadius="md"
        flexGrow="1"
        onClick={onOpen}
        m={3}
        p={3}
      >
        <Text fontSize="xl">Create Admin</Text>
      </Center>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Registration No</FormLabel>
              <Input
                placeholder="Registration No"
                onChange={(e) => setReg_no(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" onClick={handleSubmit}>
              {requestStatus === "loading" && <Spinner mr={1} />}Create Admin
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateAdmin;
