import { Types } from 'mongoose';

export interface UserInterface{
    userName: string;
    email: string;
    password: string;
    profilePhoto?: string;
    otp:string
}
export interface UserData{
    _id:Types.ObjectId
    userName: string;
    email: string;
    password: string;
    profilePhoto?: string;
}
export interface loginResponse{
    data:data
}
export interface data{
    user:UserData
    refreshToken:string
    accessToken:string
}


export interface StatusMessage{
    status: number; 
    message: string 
}

