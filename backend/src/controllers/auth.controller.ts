import { Request, Response } from "express";
import { register } from "../services/auth.service";
import { RegisterRequest } from "../types/auth.types";
import { registerSchema } from "../validators/auth.validator";

export const postRegister = async (req: Request, res: Response) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ message: "Invalid request data" });
    }

    const data: RegisterRequest = result.data;

    try {
        const response = await register(data);
        res.status(201).json(response);
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Registration failed" });
    }
};