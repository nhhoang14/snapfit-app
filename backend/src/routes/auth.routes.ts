import { Router } from "express";
import { postRegister } from "../controllers/auth.controller";

const router = Router();

router.post("/register", postRegister);

export default router;