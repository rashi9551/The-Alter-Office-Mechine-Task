import { StatusCode } from "../../Interfaces/enum";
import { loginResponse, StatusMessage, UserData, UserInterface } from "../../Interfaces/interface";
import { IUseCaseInterface } from "../../Interfaces/IUseCaseInterface";
import { createToken } from "../../services/jwt";
import { comparePassword } from "../../utils/passwordHashing";
import { getUserData, otpSetData } from "../../utils/redis";
import { sendOtp } from "../../utils/sendEmail";
import UserRepository from "../repository/userRepository";


const userRepo=new UserRepository()

export default class AuthUseCases implements IUseCaseInterface{
    
    register = async (data: UserInterface): Promise<StatusMessage | null> => {
        try {
            const existingUser = await userRepo.findUser(data.email);

            if (existingUser) return { status: StatusCode.Conflict as number, message: "User already exists" };
            
            const isOtpSended=await sendOtp(data.email,data.userName)

            if(isOtpSended){
                await otpSetData(data,isOtpSended)
                return {status:StatusCode.OK as number,message:"Otp Sended Succesfully"}
            }

            else return { status: StatusCode.InternalServerError as number, message: "Failed to send OTP" };
            
        } catch (error) {

            console.error("Error during registration:", error);

            return { status: StatusCode.InternalServerError as number, message: "Internal Server Error" };
        }
    }
    verifyOtp = async (email:string,otp:string): Promise<StatusMessage | null> => {
        try {
            const userData = await getUserData(email);
            
            if (userData) {
                if (otp === userData.otp) {
                    const saveUser = await userRepo.saveUser(userData);
                    if (saveUser) {
                        return { status: StatusCode.Created as number, message: "User created successfully" };
                    } else {
                        return { status: StatusCode.InternalServerError as number, message: "Failed to save user" };
                    }
                } else {
                    return { status: StatusCode.BadRequest as number, message: "OTP does not match" };
                }
            } else {
                return { status: StatusCode.NotFound as number, message: "User not found" };
            }
        } catch (error) {
            console.error("Error during OTP verification:", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal Server Error" };
        }
    }
    
    login = async (email:string,password:string): Promise<loginResponse | StatusMessage | null> => {
        try {
            const existingUser = await userRepo.findUser(email) as UserData
            if(existingUser){
                const isPasswordMatch=await comparePassword(password,existingUser.password)
                if(isPasswordMatch){
                    const accessToken = await createToken(existingUser._id.toString(), '15m');
                    const refreshToken = await createToken(existingUser._id.toString(), '7d');
                    return {
                        status: StatusCode.OK as number,
                        message: "Login successful",
                        data: {
                            user: existingUser,
                            accessToken,
                            refreshToken
                        }
                    };
                    }else{
                    return { status: StatusCode.BadRequest as number, message: "Password does not match" }
                }
            }else{
                return { status: StatusCode.NotFound as number, message: "User Not Found" }
            }
        } catch (error) {
            console.error("Error during registration:", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal Server Error" };
        }
    }
}