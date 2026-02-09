import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
    userId?: string;
    userRole?: string; 
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ message: 'No authentication token, access denied' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
        const decoded = jwt.verify(token, jwtSecret) as { userId: string };

        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is invalid or expired' });
    }
};

export const adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.findById(req.userId);

        if (!user || user.role !== 'admin') {
            res.status(403).json({ message: 'Access denied. Admin privileges required.' });
            return;
        }

        req.userRole = user.role;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error checking admin privileges' });
    }
};
