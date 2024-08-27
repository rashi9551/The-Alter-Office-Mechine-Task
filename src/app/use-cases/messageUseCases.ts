import { AddParticipantData, chatLists, IMessage, RemoveParticipantData, RetreiveChatData, StatusMessage } from "../../Interfaces/interface";
import messageRespository from "../repository/messageRepository";
import { GroupData } from "../../Interfaces/interface";
import { chatRepositiory } from "../repository/chatRepository";
import { StatusCode } from "../../Interfaces/enum";
import mongoose from "mongoose";
import { IMessageUseCase } from "../../Interfaces/IMessageUseCase";

const chatRepo=new chatRepositiory()
const MessageRepo= new messageRespository()
export default class MessageUseCase implements IMessageUseCase {
    getChatList= async (user: string):Promise<chatLists | null> => {
        try {
            let response = await chatRepo.getChatList(user)
            return response
        } catch (err) {
            console.log("Error while creating chats", err);
            return null
        }
    }
    createChat=async (user1: string, user2: string):Promise<RetreiveChatData | null> => {
        try {
            let response = await chatRepo.createChat(user1, user2)
            return response
        } catch (err) {
            console.log("Error while creating chats", err);
            return null
        }
    }
    sendMessage= async (chatId:string,senderId: string,recieverId:string,content:string): Promise<IMessage | null>  => {
        try {
            let response = await MessageRepo.sendMessage(chatId,senderId,recieverId,content)
            return response
        } catch (err) {
            console.log("Error while creating chats", err);
            return null
        }
    }

    getMessages= async (chatId: string): Promise<IMessage[] | null>  => {
        try {
            let response = await MessageRepo.getMessage(chatId)
            return response
        } catch (err) {
            console.error("Error while getting message", err)
            return null
        }
    }

    addGroup=async (GroupData:GroupData) :Promise<StatusMessage  | null> =>{
        try {
            const {groupName, groupAdmin } = GroupData;
            if (!groupName || !groupAdmin) {
                console.error('Missing group name or admin for group chat creation.');
                return null;
            }
            const response = await chatRepo.addGroup(GroupData)
            console.log(response,"=-=-=-=-=-");
            
            if(!response?.stat)return ({status:StatusCode.Created as number,message:"group added suuccesfully"})

            else if(response?.stat) return { status: StatusCode.Conflict as number, message: "Group already exist!" };

            else return { status: StatusCode.InternalServerError as number, message: "Failed to Group Created Successfull" };
        } catch (err) {
            console.error("Error while getting message", err)
            return { status: StatusCode.InternalServerError as number, message: "Failed to Group Created Successfull" };        }
    }
    addmembersToGroup = async (addParticipantData:AddParticipantData): Promise<StatusMessage | null> => {
        try {
            const response = await chatRepo.addmembersToGroupChat(addParticipantData)
            if(response)return ({status:StatusCode.Created as number,message:"Add members to group  Successfully "})

            else return { status: StatusCode.InternalServerError as number, message: "Failed to Add members to group" };

        } catch (err) {
            console.error(`Error adding members: ${err}`);
            return { status: StatusCode.InternalServerError as number, message: "Failed to Add members to group" };
        }
    };
    removeFromGroupResponse = async (RemoveParticipantData: RemoveParticipantData): Promise<StatusMessage | null> => {
        try {
            const response = await chatRepo.removeFromGroup(RemoveParticipantData);
            
            if (response) {
                return {
                    status: StatusCode.OK as number,
                    message: "members removed from group successfully"
                };
            } else {
                return {
                    status: StatusCode.InternalServerError as number,
                    message: "Failed to remove members from group"
                };
            }
    
        } catch (err) {
            console.error(`Error removing members: ${err}`);
            return {
                status: StatusCode.InternalServerError as number,
                message: "Failed to remove members from group"
            };        }
    };
    
} 
