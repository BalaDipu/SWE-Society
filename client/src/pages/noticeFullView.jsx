import React from 'react';
import { EditIcon } from "@chakra-ui/icons";
import { Box, Button, Center, Flex, FormControl, FormLabel, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, Textarea, toast, useDisclosure, useToast } from "@chakra-ui/react"
import { useHistory, useLocation, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { AuthContext } from '../contexts/authContext';

const NoticeFullView = (notice) => {
    let location = useLocation();
    const { unauthorizedHandler } = useContext(AuthContext);
    const [editedNotice, setEditedNotice] = useState({});
    const [requestState, setRequestState] = useState("none");
    const toast = useToast();
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef();

    const [loadPromise, setLoadPromise] = useState(false);
    const key = useParams().id

    useEffect(() => {
        const loadFirst = async () => {
            axios
                .get(`/api/announcement/${key}`)
                .then((res) => {
                    setEditedNotice(res.data);
                    setLoadPromise(true);
                }).catch((err) => {
                    console.log('fuck too')
                    console.log(err);
                })
        }
        loadFirst();
    }, [key, loadPromise]);



    const handleSubmit = (e) => {
        e.preventDefault();
        setRequestState("loading");

        axios
            .patch("/api/announcement/" + editedNotice.id, editedNotice)
            .then((res) => {
                setRequestState("success");
                onClose();
                history.go(0);
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
                setRequestState("error");
            });
    };

    return (
        <Center bg="grey" minH="75vh">
            <Box bg="white" w="50%" p={4} marginTop="5" marginBottom="5">
                <Flex>
                    <Text fontSize="3xl" fontWeight="bold" textColor="red">Notice Board</Text>
                    <Spacer />
                    <IconButton onClick={onOpen} onClose={onClose} icon={<EditIcon />}>Edit</IconButton>
                </Flex>
                <Text fontSize="2xl" fontWeight="bold" textColor="black" >{editedNotice.title}</Text>
                <Text fontSize="xl" fontWeight="bold" textColor="black" >Date : {new Date(editedNotice.createdAt).getUTCDate()}/
                {new Date(editedNotice.createdAt).getUTCMonth() + 1}/
                {new Date(editedNotice.createdAt).getUTCFullYear()} -  {new Date(editedNotice.deadline).getUTCDate()}/
                {new Date(editedNotice.deadline).getMonth() + 1}/
                {new Date(editedNotice.deadline).getUTCFullYear()}
                </Text>
                <Text marginTop="5" fontSize="lg" textColor="black" >
                    {editedNotice.content}
                </Text>
                <Button marginTop="3" bg="blue.500">View Attachment</Button>

                <Modal
                    initialFocusRef={initialRef}
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Create your account</ModalHeader>
                        <ModalCloseButton />
                        <form onSubmit={handleSubmit}>
                        <ModalBody pb={6}>
                            <FormControl>
                                <FormLabel>Title</FormLabel>
                                <Input
                                 type="text"
                                 value={editedNotice.title}
                                 ref={initialRef}
                                 onChange ={(e) =>
                                        setEditedNotice({
                                          ...editedNotice,
                                          title: e.target.value,
                                        })
                                }  placeholder="First name" />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Body</FormLabel>
                                <Textarea
                                value={editedNotice.content}
                                 onChange={(e) => setEditedNotice({
                                    ...editedNotice,
                                    content: e.target.value
                                })} />

                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Deadline</FormLabel>
                                <Input
                                    as={DatePicker}
                                    isClearable
                                    placeholder="Deadline"
                                    minDate={new Date(editedNotice.createdAt)}
                                    selected={new Date(editedNotice.deadline)}
                                    onChange={(date) => setEditedNotice({
                                        ...editedNotice,
                                        deadline: date
                                    })
                                    }
                                />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button type="submit" colorScheme="blue" mr={3}>
                                Save
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                        </form>
                    </ModalContent>
                </Modal>
            </Box>
        </Center>
    )
}

export default NoticeFullView;