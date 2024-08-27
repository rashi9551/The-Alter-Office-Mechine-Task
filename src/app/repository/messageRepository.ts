import mongoose from "mongoose";
import ChatModel from "../../entities/chat";
import MessageModel from "../../entities/messages";
import { IMessage } from "../../Interfaces/interface";
import { IMessageRepo } from "../../Interfaces/IMessageRepository";


export default class messageRespository implements IMessageRepo {
    
    getMessage = async (chatId: string): Promise<IMessage[] | null> => {
        try {
            const chats: IMessage[] = await MessageModel.find({ chatId }).exec() as IMessage[]
            return chats

        } catch (err) {
            console.error("Error while getting chats", err);
            return null;
        }
    }
    sendMessage =async (
        chatId: string,
        senderId: string,
        receiverId: string | null,
        message: string
    ): Promise<IMessage | null> => {
        try {
            await ChatModel.findByIdAndUpdate(chatId, { updatedAt: new Date() })
            let response = new MessageModel({
                chatId: new mongoose.Types.ObjectId(chatId),
                senderId,
                receiverId,  // Optional for group chats
                message: message,
            });
            await response.save();
            return response;
        } catch (err) {
            console.error("Error while sending message", err);
            return null;
        }
    }
    
}