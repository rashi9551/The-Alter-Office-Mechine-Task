import {  GroupData, IMessage,  StatusMessage } from "./interface";

export interface IMessageRepo {
    getMessage(chatId: string): Promise<IMessage[] | null>;
    sendMessage(chatId: string, senderId: string, receiverId: string | null, message: string): Promise<IMessage | null>;
}
