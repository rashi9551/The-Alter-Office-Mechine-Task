import mongoose, { Document, Schema } from "mongoose";
import { IChat } from "../Interfaces/interface";

const ChatSchema: Schema<IChat> = new Schema({
    type: { type: String, enum: ['personal', 'group'], required: true },
    participants: [{ type: String, required: true }],
    groupName: { type: String },  // Optional group name
    groupAdmin: { type: String },  // Optional group admin
}, { timestamps: true });

const ChatModel = mongoose.model<IChat>("Chat", ChatSchema);
export default ChatModel;