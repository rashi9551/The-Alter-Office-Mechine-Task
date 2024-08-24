import {Response,Request} from 'express'
import { StatusCode } from '../../Interfaces/enum'


export default class Controllers{

    register=async(req:Request,res:Response)=>{
        try {
           console.log(req.body);
           res.status(StatusCode.Created).json({name:"amras"})
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' }); 
        }
    }

}