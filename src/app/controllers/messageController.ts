import {Response,Request} from 'express'
import { chatLists, IMessage, StatusMessage } from '../../Interfaces/interface';
import MessageUseCase from '../use-cases/messageUseCases';
import { StatusCode } from '../../Interfaces/enum';

const messageUseCases=new MessageUseCase()

export default class MessageControllers {
    addGroup = async (req: Request, res: Response): Promise<Response>  => {
        try {
            const addGroupResponse: StatusMessage = await messageUseCases.addGroup(req.body) as StatusMessage;
            return res.status(addGroupResponse?.status).json(addGroupResponse);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' }); 
        }
    }
    addParticipantToGroup = async (req: Request, res: Response): Promise<Response>  => {
        try {
            const addParticipantToGroupResponse: StatusMessage = await messageUseCases.addmembersToGroup(req.body) as StatusMessage;
            return res.status(addParticipantToGroupResponse?.status).json(addParticipantToGroupResponse);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' }); 
        }
    }
    removeParticipantFromGroup = async (req: Request, res: Response): Promise<Response>  => {
        try {
            const removeFromGroupResponse: StatusMessage = await messageUseCases.removeFromGroupResponse(req.body) as StatusMessage;
            return res.status(removeFromGroupResponse?.status).json(removeFromGroupResponse);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' }); 
        }
    }
    getChatList = async (req: Request, res: Response): Promise<Response>  => {
        try {
            const getChatListResponse: chatLists = await messageUseCases.getChatList(req.body.userId) as chatLists;
            return res.status(getChatListResponse?.status).json(getChatListResponse);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' }); 
        }
    }
    getMessages = async (req: Request, res: Response): Promise<Response >   => {
        try {
            const getMessagesResponse: IMessage[] = await messageUseCases.getMessages(req.body.chatId) as IMessage[];
            return res.status(StatusCode.OK).json(getMessagesResponse);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' }); 
        }
    }


}