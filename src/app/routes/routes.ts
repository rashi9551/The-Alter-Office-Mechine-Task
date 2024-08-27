import express, { Router, Request, Response } from 'express';
import AuthControllers from '../controllers/authController';
import MessageControllers from '../controllers/messageController';
import JwtControllers from '../../services/jwt';

// Initialize the router instead of an application
const route: Router = express.Router();

const jwtController=new JwtControllers()

const authController = new AuthControllers();
const messageController = new MessageControllers();

// Define your routes using the router
route.post('/register', authController.register);
route.post('/verifyOtp', authController.verifyOtp);
route.post('/login', authController.login);



route.post('/addGroup',jwtController.isAuthenticated,messageController.addGroup);
route.patch('/addParticipantToGroup', jwtController.isAuthenticated,messageController.addParticipantToGroup);
route.delete('/removeParticipant',jwtController.isAuthenticated, messageController.removeParticipantFromGroup);


route.get('/getChatList',jwtController.isAuthenticated, messageController.getChatList);
route.get('/getMessages',jwtController.isAuthenticated, messageController.getMessages);

route.get('/refresh',jwtController.refreshToken);


export default route;