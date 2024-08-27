import { createClient } from 'redis'; 
import { UserInterface } from '../Interfaces/interface';

const client = createClient(); 
client.on('error', (err) => {
    console.error('Redis Client Error', err);
});
client.connect().catch(console.error);
export const otpSetData=async(data:UserInterface,otp:string)=>{
    const userData = {
        userName: data.userName,
        email: data.email,
        password: data.password,
        otp: otp
    };

    await Promise.all([
        client.hSet(`user:${data.email}`, userData),
        client.expire(`user:${data.email}`, 300) 
    ]);

}

 
export const getUserData= async(email: string): Promise<UserInterface | null> =>{
    try {
        const userData = await client.hGetAll(`user:${email}`);
        if (Object.keys(userData).length === 0) {
            return null; 
        }
        const user: UserInterface = {
            userName: userData.userName,
            email: userData.email,
            password: userData.password,
            otp: userData.otp || ''
        };
        return user;
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return null;
    }
}
