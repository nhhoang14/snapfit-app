import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { RegisterRequest, RegisterResponse } from "../types/auth.types";

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
    });

    if (existingUser) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = await prisma.user.create({
        data: {
            email: data.email,
            displayName: data.displayName,
            password: hashedPassword
        }
    });

    return {
        email: user.email,
        displayName: user.displayName
    };
};