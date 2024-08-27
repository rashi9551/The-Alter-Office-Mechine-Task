import { NextFunction ,Response,Request} from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { DecodedToken } from '../Interfaces/interface';

const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY || 'Rashid';

export default class JwtControllers {

    createToken= async (userId: ObjectId | string, expire: string): Promise<string> => {
        try {
            const token = jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: expire });
            return token;
        } catch (error) {
            console.error('Error creating token:', error);
            throw new Error('Failed to create token');
        }
    }
    isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("Token validating...");
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Token is missing" });
            }
    
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "Rashid") as DecodedToken;
            if (!decoded) {
                return res.status(401).json({ message: 'Invalid token' });
            }    
            next();
        } catch (e) {
            console.error(e);
            res.status(401).json({ message: "Something went wrong in authentication" });
        }
    };
    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshtoken = req.headers.authorization?.split(' ')[1] || ''; // Assuming Bearer token
            if (!refreshtoken) {
                return res.status(401).json({ message: 'Refresh token is missing' });
            }
    
            const decoded = jwt.verify(refreshtoken, process.env.JWT_SECRET_KEY || 'Rashid') as DecodedToken;
            if (!decoded) {
                return res.status(401).json({ message: 'Invalid refresh token' });
            }
    
            console.log('Token refreshed');
    
            const newRefreshToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET_KEY || 'Rashid', {
                expiresIn: '7d',
            });
    
            const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET_KEY || 'Rashid', {
                expiresIn: '15m',
            });
    
            res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Something went wrong in authentication' });
        }
    };
}
