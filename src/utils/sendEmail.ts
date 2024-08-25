import generateOTP from "./generateOtp";
import { sendMail } from "../services/nodeMailer";


export const sendOtp=async(email:string,name:string)=>{
    try {
        const otp = generateOTP();
        console.log("this is otp ",otp);
        const subject = "Otp Verification";
        const text = `Hello ${name},\n\nThank you for registering with real Time application!, your OTP is ${otp}\n\nHave a nice day!!!`;
        await sendMail(email, subject, text);
        return true
    } catch (error) {
        console.log(error);
        return null
    }
}