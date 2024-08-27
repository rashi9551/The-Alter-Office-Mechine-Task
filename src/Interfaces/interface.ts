import mongoose,{ Types ,Document} from 'mongoose';
import { ObjectId } from 'mongodb';

export interface UserInterface{
    userName: string;
    email: string;
    password: string;
    profilePhoto?: string;
    otp:string
}
export interface UserData{
    _id:Types.ObjectId
    userName: string;
    email: string;
    password: string;
    profilePhoto?: string;
}
export interface LoginResponse{
    data:Data
}
export interface Data{
    user:UserData
    refreshToken:string
    accessToken:string
}


export interface StatusMessage{
    status: number; 
    message: string ;
    chatId?:mongoose.Types.ObjectId
}
export interface chatLists{
    status: number; 
    message: string ;
    data?: IChatResponse[];
    chatId?:mongoose.Types.ObjectId

}
export interface RetreiveChatData{
    status: number; 
    message: string ;
    chatId:mongoose.Types.ObjectId;

}

export interface IChat extends Document {
    _id: mongoose.Types.ObjectId;
    type: 'personal' | 'group';  // Type of chat
    participants: string[];  // List of participants for personal or group chat
    groupName?: string;  // Optional group name for group chats
    groupAdmin?: string;  // Optional admin for group chats
    stat?: boolean;  // Optional stat property
    createdAt: Date;
    updatedAt: Date;
}

export interface IMessage extends Document {
    _id: mongoose.Types.ObjectId;
    chatId: mongoose.Types.ObjectId;
    senderId: string;
    receiverId?: string;  // Optional for group chats
    message?: string;
    createdAt: Date;
}

export interface GroupData  {
    participants: string[];  // List of participants for personal or group chat
    groupName: string;  // Optional group name for group chats
    groupAdmin: string; 
}
export interface AddParticipantData  {
    groupId: mongoose.Types.ObjectId,
    participantsToAdd: string[]
}
export interface RemoveParticipantData  {
    groupId: mongoose.Types.ObjectId,
    participantsToRemove: string[]
}

interface ILastMessage {
    _id: mongoose.Types.ObjectId;
    text?: string;  // Optional because there might be no message
    createdAt: Date;
    senderId: string;
}

// Interface for the chat object
interface IChatResponse {
    _id: mongoose.Types.ObjectId;
    type: 'personal' | 'group';  // Type of chat: personal or group
    participants: string[];  // List of participants
    groupName?: string;  // Optional group name for group chats
    groupAdmin?: string;  // Optional admin for group chats
    createdAt: Date;
    updatedAt: Date;
    lastMessage?: ILastMessage;  // Optional last message object
}


