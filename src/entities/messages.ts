import mongoose, { Document, Schema } from "mongoose";
import { IMessage } from "../Interfaces/interface";

const MessageSchema: Schema<IMessage> = new Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String },  // Optional for group chats
    message: { type: String },
}, { timestamps: true });

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);
export default MessageModel;