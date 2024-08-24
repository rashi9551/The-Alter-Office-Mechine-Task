import mongoose, { Document, Schema } from "mongoose";

export interface UserInterface extends Document {


}


const UserSchema: Schema = new Schema({
    
})


const userModel=mongoose.model<UserInterface>("User", UserSchema);

export default  userModel