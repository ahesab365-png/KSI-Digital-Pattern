import { UserModel } from "../../DB/model/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { asyncHandler, AppError } from "../../utils/error.handler.js";
import { successResponse } from "../../utils/response.util.js";
import { JWT_SECRET } from "../../../config/config.service.js";

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    
    // 1. Find User
    const user = await UserModel.findOne({ email });
    if (!user) {
        return next(new AppError("البريد الإلكتروني أو كلمة المرور غير صحيحة", 401));
    }

    // 2. Validate Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return next(new AppError("البريد الإلكتروني أو كلمة المرور غير صحيحة", 401));
    }

    // 3. Generate Token
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '10y' }
    );

    // 4. Send Response
    return successResponse(res, "تم تسجيل الدخول بنجاح", {
        token,
        user: { email: user.email, role: user.role }
    });
});