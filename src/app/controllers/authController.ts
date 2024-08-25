import {Response,Request} from 'express'
import { StatusCode } from '../../Interfaces/enum'
import AuthUseCases from '../use-cases/authUseCases';
import { StatusMessage } from '../../Interfaces/interface';


const authUseCases=new AuthUseCases()

export default class AuthControllers{

    register=async(req:Request,res:Response)=>{
        try {
           const registerResponse:StatusMessage= await authUseCases.register(req.body) as StatusMessage 
           res.status(registerResponse?.status).json(registerResponse.message)
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' }); 
        }
    }

}