import { AddParticipantData, chatLists, GroupData, IChat, RemoveParticipantData, RetreiveChatData } from "./interface";

export interface IChatRepository {
    getChatList(userId: string): Promise<chatLists>;  // Updated parameter name to match your usage
    addmembersToGroupChat(addParticipantData: AddParticipantData): Promise<IChat | null>;
    removeFromGroup(RemoveParticipantData: RemoveParticipantData): Promise<IChat | null>;
    addGroup(GroupData: GroupData): Promise<IChat | null>;
    createChat(user1: string, user2: string): Promise<RetreiveChatData | null>;
}
