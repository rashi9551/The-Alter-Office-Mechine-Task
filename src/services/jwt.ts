import { NextFunction ,Response,Request} from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { StatusCode } from '../Interfaces/enum';
import { AuthenticatedSocket, DecodedToken } from '../Interfaces/interface';

const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY || 'Rashid';

export default class JwtControllers {

    createToken= async (userId: ObjectId | string, expire: string,secret:string): Promise<string> => {
        try {
            const token = jwt.sign({ userId }, secret, { expiresIn: expire });
            return token;
        } catch (error) {
            console.error('Error creating token:', error);
            throw new Error('Failed to create token');
        }
    }
    isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            console.log(token,"Token validating...");
            if (!token) {
                return res.status(401).json({ message: "Token is missing" });
            }
    
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "Rashid") as DecodedToken;
            if (!decoded) {
                return res.status(StatusCode.Unauthorized).json({ message: 'Invalid token' });
            }    
            next();
        } catch (e) {
            console.error(e);
            res.status(StatusCode.Unauthorized).json({ message: "token authentication failed" });
        }
    };
    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshtoken = req.headers.authorization?.split(' ')[1] || ''; // Assuming Bearer token
            if (!refreshtoken) {
                return res.status(401).json({ message: 'Refresh token is missing' });
            }
    
            const decoded = jwt.verify(refreshtoken, process.env.JWT_REFRESH_SECRET_KEY || 'rashi123') as DecodedToken;
            if (!decoded) {
                return res.status(401).json({ message: 'Invalid refresh token' });
            }
    
            console.log('Token refreshed');
    
            const newRefreshToken = jwt.sign({ id: decoded.userId }, process.env.JWT_REFRESH_SECRET_KEY || 'rashi123', {
                expiresIn: '7d',
            });
    
            const newAccessToken = jwt.sign({ id: decoded.userId }, process.env.JWT_SECRET_KEY || 'Rashid', {
                expiresIn: '15m',
            });
    
            res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Something went wrong in authentication' });
        }
    };

    socketRefresh = async (refreshtoken: string): Promise<{ accessToken: string; refreshToken: string } | null> => {
        try {
            // Verify the refresh token
            const decoded = jwt.verify(refreshtoken, process.env.JWT_REFRESH_SECRET_KEY || 'rashi123') as DecodedToken;
            if (!decoded) {
                throw new Error('Invalid refresh token');
            }
    
            console.log('Token refreshed');
    
            // Generate new tokens
            const newRefreshToken = jwt.sign({ id: decoded.userId }, process.env.JWT_REFRESH_SECRET_KEY || 'rashi123', {
                expiresIn: '7d',
            });
    
            const newAccessToken = jwt.sign({ id: decoded.userId }, process.env.JWT_SECRET_KEY || 'Rashid', {
                expiresIn: '15m',
            });
    
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (e) {
            console.error(e);
            return null;
        }
    };
    verifyToken = (token: string, refreshToken: string, socket: AuthenticatedSocket, next: (err?: any) => void) => {
        jwt.verify(token, process.env.JWT_SECRET_KEY as string, async (err: any, decoded: any) => {
            if (err) {
                if (refreshToken) {
                    try {
                        const tokens = await this.socketRefresh(refreshToken);
                        if (tokens) {
                            socket.emit('tokens-updated', tokens);
                            jwt.verify(tokens.accessToken, process.env.JWT_SECRET_KEY as string, (err: any, decoded: any) => {
                                if (err) return next(new Error('Failed to verify new access token'));
                                socket.decoded = decoded;
                                next();
                            });
                        } else {
                            return next(new Error('Failed to refresh token'));
                        }
                    } catch (error) {
                        console.error('Error refreshing token:', error);
                        return next(new Error('Failed to refresh token'));
                    }
                } else {
                    return next(new Error('Invalid token'));
                }
            } else {
                socket.decoded = decoded;
                next();
            }
        });
    };
    
}
