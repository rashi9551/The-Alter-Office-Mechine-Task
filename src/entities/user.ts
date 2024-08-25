import mongoose, { Document, Schema } from "mongoose";

export interface UserInterface extends Document {
    userName: string;
    email: string;
    password: string;
    profilePhoto?: string;
}

const UserSchema: Schema<UserInterface> = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    profilePhoto: {
        type: String,
        required: false,
    },
}, {
    timestamps: true
});

const UserModel = mongoose.model<UserInterface>("User", UserSchema);

export default UserModel;
