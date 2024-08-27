import mongoose from "mongoose";
import ChatModel from "../../entities/chat";
import { AddParticipantData, chatLists, GroupData, IChat, RemoveParticipantData, RetreiveChatData, StatusMessage } from "../../Interfaces/interface";
import { StatusCode } from "../../Interfaces/enum";
import { IChatRepository } from "../../Interfaces/IChatRepository";

export class chatRepositiory implements IChatRepository {
    
    createChat = async (
        user1: string,
        user2: string
    ): Promise<RetreiveChatData | null> => {
        try {
            // Check if the chat already exists
            const existingChat = await ChatModel.findOne({
                type: 'personal',
                members: { $all: [user1, user2] },
            }).exec();

            if (existingChat) {
                console.log('Chat already exists:', existingChat);
                return { status: StatusCode.Conflict as number, chatId: existingChat._id, message: "Chat already exists" };
            }

            // Create a new chat
            const newChat = new ChatModel({
                type: 'personal',
                members: [user1, user2],
            });

            await newChat.save();
            console.log('New chat added:', newChat);

            return { status: StatusCode.Created as number, chatId: newChat._id, message: "Chat created successfully" };
        } catch (err) {
            console.error(`Error creating personal chat: ${err}`);
            return null;
        }
    };
            
    addGroup = async (
        GroupData: GroupData
    ): Promise<IChat | null> => {
        try {
            const { members, groupName, groupAdmin } = GroupData;

            const existingChat = await ChatModel.findOne({
                type: 'group',
                groupName: groupName,
            }).lean() as IChat | null;

            if (existingChat) {
                console.log('Group chat already exists:', existingChat);
                return { ...existingChat, stat: true } as IChat;
            }

            const newChat = new ChatModel({
                type: 'group',
                members: members, 
                groupName: groupName,
                groupAdmin: groupAdmin,
            });

            await newChat.save();
            console.log('New group chat added:', newChat);

            return { ...newChat.toObject(), stat: false } as IChat;

        } catch (err) {
            console.error(`Error creating group chat: ${err}`);
            return null;
        }
    };

    addmembersToGroupChat = async (addParticipantData:AddParticipantData): Promise<IChat | null> => {
        try {
            const{groupId,membersToAdd}=addParticipantData
            const chat: IChat | null = await ChatModel.findById(groupId);
            if (!chat) {
                console.error('Group chat not found');
                return null;
            }
            console.log(membersToAdd);
            
            const newmembers = membersToAdd.filter(participant => !chat.members.includes(participant));
            chat.members.push(...newmembers);
            await chat.save();
            console.log('members added:', newmembers);
            return chat;
            
        } catch (error) {
            console.log(error);
            return null
        }
    };

    removeFromGroup = async (RemoveParticipantData:RemoveParticipantData): Promise<IChat | null> => {
        try {
            const { groupId, membersToRemove } = RemoveParticipantData;            
            const chat: IChat | null = await ChatModel.findById(groupId);
            if (!chat) {
                console.error('Group chat not found');
                return null;
            }

            chat.members = chat.members.filter(members => !membersToRemove.includes(members));
            await chat.save();
            console.log('members removed:', membersToRemove);
            return chat;

        } catch (err) {
            console.error(`Error removing members from group: ${err}`);
            return null;
        }
    };

    
    getChatList = async (userId: string): Promise<chatLists> => {
    try {
        const chatlist = await ChatModel.aggregate([
            {
                $match: { members: userId } 
            },
            {
                $lookup: {
                    from: "messages",  
                    localField: "_id",  
                    foreignField: "chatId",  
                    as: "messages"
                }
            },
            {
                $unwind: {
                    path: "$messages",
                    preserveNullAndEmptyArrays: true 
                }
            },
            {
                $sort: { "messages.createdAt": -1 } 
            },
            {
                $group: {
                    _id: "$_id",  
                    members: { $first: "$members" }, 
                    createdAt: { $first: "$createdAt" },  
                    updatedAt: { $first: "$updatedAt" }, 
                    lastMessage: { $first: "$messages" }, 
                    groupName: { $first: "$groupName" },  
                    groupAdmin: { $first: "$groupAdmin" }, 
                    type: { $first: "$type" }  
                }
            },
            {
                $sort: { "updatedAt": -1 }  
            }
        ]);
        console.log(chatlist, '===============chatlist');
        return {
            status: 200,
            message: "Chat list retrieved successfully",
            data: chatlist
        };
    } catch (err) {
        console.error("Error while getting list of chats", err);
        return {
            status: 500,
            message: "Internal Server Error"
        };
    }
}

}