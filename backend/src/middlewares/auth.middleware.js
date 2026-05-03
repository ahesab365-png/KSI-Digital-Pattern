import jwt from 'jsonwebtoken';
import { UserModel } from '../DB/model/user.model.js';
import { JWT_SECRET } from '../../config/config.service.js';

export const auth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ message: "Authorization required" });
        }

        const token = authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        const decoded = jwt.verify(token, JWT_SECRET); // Use same secret as login
        const user = await UserModel.findById(decoded.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token", error: error.message });
    }
};
