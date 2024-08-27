import { Socket, Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import MessageUseCase from '../app/use-cases/messageUseCases';
import JwtControllers from '../services/jwt';
import jwt from 'jsonwebtoken';
import { RetreiveChatData } from '../Interfaces/interface';

interface DecodedToken {
    clientId: string;
}

export interface AuthenticatedSocket extends Socket {
    decoded?: DecodedToken;
}

const messageUseCase = new MessageUseCase();
const jwtController = new JwtControllers();

// Centralized token verification function
const verifyToken = (token: string, refreshToken: string, socket: AuthenticatedSocket, next: (err?: any) => void) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY as string, async (err: any, decoded: any) => {
        if (err) {
            if (refreshToken) {
                try {
                    const tokens = await jwtController.socketRefresh(refreshToken);
                    if (tokens) {
                        socket.emit('tokens-updated', tokens);
                        jwt.verify(tokens.accessToken, process.env.JWT_SECRET_KEY as string, (err: any, decoded: any) => {
                            if (err) return next(new Error('Failed to verify new access token'));
                            socket.decoded = decoded;
                            next();
                        });
                    } else {
                        return next(new Error('Failed to refresh token'));
                    }
                } catch (error) {
                    console.error('Error refreshing token:', error);
                    return next(new Error('Failed to refresh token'));
                }
            } else {
                return next(new Error('Invalid token'));
            }
        } else {
            socket.decoded = decoded;
            next();
        }
    });
};

export const setUpSocketIO = (server: HttpServer): void => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: '*', // Restrict to your domain
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.use(async (socket: AuthenticatedSocket, next) => {
        const token: string | undefined = socket.handshake.query.token as string | undefined;
        const refreshToken: string | undefined = socket.handshake.query.refreshToken as string | undefined;

        if (!token) return next(new Error('Token is missing'));

        try {
            verifyToken(token, refreshToken || '', socket, next);
        } catch (error) {
            console.error('Authentication error:', error);
            next(new Error('Authentication error'));
        }
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
                const { senderId, receiverId, content } = parsedMessage;

                if (!senderId || !receiverId || !content) {
                    console.error('Invalid message format:', parsedMessage);
                    return;
                }

                const chat: RetreiveChatData = await messageUseCase.createChat(senderId, receiverId) as RetreiveChatData;

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
                const { senderId, groupId, content } = parsedMessage;

                if (!senderId || !groupId || !content) {
                    console.error('Invalid group message format:', parsedMessage);
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
