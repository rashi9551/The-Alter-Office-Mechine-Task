import express, { Router, Request, Response } from 'express';
import AuthControllers from '../controllers/authController';
import MessageControllers from '../controllers/messageController';

// Initialize the router instead of an application
const route: Router = express.Router();

const authController = new AuthControllers();
const messageController = new MessageControllers();

// Define your routes using the router
route.post('/register', authController.register);
route.post('/verifyOtp', authController.verifyOtp);
route.post('/login', authController.login);



route.post('/addGroup', messageController.addGroup);
route.patch('/addParticipantToGroup', messageController.addParticipantToGroup);
route.delete('/removeParticipant', messageController.removeParticipantFromGroup);


route.get('/getChatList', messageController.getChatList);
route.get('/getMessages', messageController.getMessages);


export default route;