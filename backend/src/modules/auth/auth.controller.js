import { UserModel } from "../../DB/model/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            'ksi_secret_key', // In a real app, use an env variable
            { expiresIn: '10y' } // Expires in 10 years (practically never)
        );

        return res.status(200).json({ 
            message: "Login successful", 
            token,
            user: { email: user.email, role: user.role }
        });
    } catch (error) {
        return next(error);
    }
};