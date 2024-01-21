import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes';
import { db } from '../lib/db.js'

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'No token provided' });

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]
        jwt.verify(
            token,
            process.env.JWT,
            async (err, decoded) => {
                if (err) return res.status(StatusCodes.FORBIDDEN).json({ error: 'Invalid token provided' })
                req.user = await db.user.findUnique({
                    where: {
                        id: decoded.id,
                    },
                });
                next();
            }
        );
    } else {
        return res.status(StatusCodes.FORBIDDEN).json({ error: 'Invalid token provided' })
    }
}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        // If there is no req.user, it means the user is not authenticated
        if (!req.user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'You are not authorized' });
        }

        // For all requests, proceed without throwing an error
        next();
    });
};