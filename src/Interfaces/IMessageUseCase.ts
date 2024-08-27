import { AddParticipantData, chatLists, GroupData, IMessage, RemoveParticipantData, RetreiveChatData, StatusMessage } from "./interface";

export interface IMessageUseCase{
    getChatList(user:string):Promise<chatLists | null>
    getMessages(chatId:string):Promise<IMessage[] | null>
    addmembersToGroup(addParticipantData:AddParticipantData):Promise<StatusMessage | null>
    removeFromGroupResponse(RemoveParticipantData:RemoveParticipantData):Promise<StatusMessage | null>
    addGroup(GroupData:GroupData):Promise<StatusMessage | null>
    createChat(user1:string,user2:string):Promise<RetreiveChatData | null>
    sendMessage(chatId:string,senderId:string,receiverId:string,content:string):Promise<IMessage | null>
}