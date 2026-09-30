import { Request, Response } from "express";

export const postRegister = (req: Request, res: Response) => {
    res.json({
        message: "Register API"
    });
};