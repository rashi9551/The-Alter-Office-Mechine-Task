import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

interface DecodedToken extends JwtPayload {
    id: string;
    role: string;
}

const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY || 'Rashid';


export const createToken= async (userId: ObjectId | string, expire: string): Promise<string> => {
    try {
        const token = jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: expire });
        return token;
    } catch (error) {
        console.error('Error creating token:', error);
        throw new Error('Failed to create token');
    }
}

export const verifyOtpToken = (token: string): DecodedToken | null => {
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET_KEY) as DecodedToken;
        console.log(decodedToken, 'Decoded token');
        return decodedToken;
    } catch (error: any) {
        console.error('Token verification failed:', error.message);
        return null;
    }
}

