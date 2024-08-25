import mongoose, { Document, Schema } from "mongoose";

// Define the User interface, extending Document
export interface UserInterface extends Document {
    userName: string;
    email: string;
    password: string;
    profilePhoto?: string;
}

// Define the User schema
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

// Create the User model with the UserInterface
const UserModel = mongoose.model<UserInterface>("User", UserSchema);

export default UserModel;
