import bcrypt from "bcrypt";
import { RegisterRequest, RegisterResponse } from "../types/auth.types";

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return {
        email: data.email,
        displayName: data.displayName
    };
};