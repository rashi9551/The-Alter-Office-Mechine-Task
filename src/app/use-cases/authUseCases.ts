import { StatusCode } from "../../Interfaces/enum";
import { StatusMessage, UserInterface } from "../../Interfaces/interface";
import { IUseCaseInterface } from "../../Interfaces/IUseCaseInterface";
import { sendOtp } from "../../utils/sendEmail";
import UserRepository from "../repository/userRepository";


const userRepo=new UserRepository()

export default class AuthUseCases implements IUseCaseInterface{
    
    register = async (data: UserInterface): Promise<StatusMessage | null> => {
        try {
            const existingUser = await userRepo.findUser(data.email);

            if (existingUser) return { status: StatusCode.Conflict as number, message: "User already exists" };
            
            const isOtpSended=await sendOtp(data.email,data.userName)

            if(isOtpSended)return {status:StatusCode.OK as number,message:"Otp Sended Succesfully"}

            else return { status: StatusCode.InternalServerError as number, message: "Failed to send OTP" };
            
        } catch (error) {

            console.error("Error during registration:", error);

            return { status: 500, message: "Internal Server Error" };
        }
    }

}