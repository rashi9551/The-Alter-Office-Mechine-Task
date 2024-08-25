import {Response,Request} from 'express'
import { StatusCode } from '../../Interfaces/enum'
import AuthUseCases from '../use-cases/authUseCases';
import { loginResponse, StatusMessage } from '../../Interfaces/interface';


const authUseCases=new AuthUseCases()

export default class AuthControllers{

    register=async(req:Request,res:Response)=>{
        try {
           const registerResponse:StatusMessage= await authUseCases.register(req.body) as StatusMessage 
           res.status(registerResponse?.status).json(registerResponse)
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' }); 
        }
    }
    verifyOtp=async(req:Request,res:Response)=>{
        try {
            const {email,otp}=req.body
           const verifyOtpResponse:StatusMessage= await authUseCases.verifyOtp(email,otp) as StatusMessage 
           res.status(verifyOtpResponse?.status).json(verifyOtpResponse)
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' }); 
        }
    }
    login=async(req:Request,res:Response)=>{
        try {
            const {email,password}=req.body
            const loginResponse:loginResponse | StatusMessage= await authUseCases.login(email,password) as loginResponse |StatusMessage
            if ('status' in loginResponse) {
                res.status(loginResponse.status).json(loginResponse);
            } else {
                res.status(StatusCode.OK).json(loginResponse);
            }       
         } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' }); 
        }
    }

}