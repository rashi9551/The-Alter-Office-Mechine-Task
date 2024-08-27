import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import MessageUseCase from '../app/use-cases/messageUseCases';
import { RetreiveChatData, StatusMessage } from '../Interfaces/interface';


const messageUseCase=new MessageUseCase()

export const setUpSocketIO = (server: HttpServer): void => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('joinPersonalRoom', (userId: string) => {
            socket.join(userId); 
            console.log(`User ${socket.id} joined personal room: ${userId}`);
        });

        socket.on('joinGroupRoom', (groupId: string) => {
            socket.join(groupId);
            console.log(`User ${socket.id} joined group room: ${groupId}`);
        });

        socket.on('sendMessage', async (message: string) => {
            try {
                const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
                console.log('Received message object:', parsedMessage);
        
                const { senderId, receiverId, content } = parsedMessage;
        
                if (!senderId || !receiverId || !content) {
                    console.error('Invalid message format:', parsedMessage);
                    return;
                }
        
                const chat :RetreiveChatData = await messageUseCase.createChat(senderId, receiverId) as RetreiveChatData
        
                if (chat) {
                    const savedMessage = await messageUseCase.sendMessage(chat.chatId.toString(), senderId, receiverId, content);
                    
                    if (savedMessage) {
                        io.to(receiverId).emit('receiveMessage', {
                            senderId,
                            content,
                            timestamp: new Date(),
                        });
        
                        console.log(`Message from ${senderId} to ${receiverId}: ${content}`);
                    } else {
                        console.error('Failed to save message:', content);
                    }
                } else {
                    console.error('Failed to create or find chat');
                }
            } catch (error) {
                console.error('Error handling sendMessage:', error);
            }
        });
        

        socket.on('sendGroupMessage', async (message: string) => {
            try {
                const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
                console.log('Received group message object:', parsedMessage);

                const { senderId, groupId, content } = parsedMessage;

                if (!senderId || !groupId || !content) {
                    console.error('Invalid group message format:', typeof parsedMessage);
                    return;
                }
                const savedMessage = await messageUseCase.sendMessage(groupId, senderId, '', content);
                    
                    if (savedMessage) {
                        io.to(groupId).emit('receiveGroupMessage', {
                            senderId,
                            content,
                            timestamp: new Date(),
                        });
                        console.log(`Message from ${senderId} to group ${groupId}: ${content}`);
                    } else {
                        console.error('Failed to save message:', content);
                    }
            } catch (error) {
                console.error('Error parsing group message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
