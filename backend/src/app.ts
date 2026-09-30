import express from "express";
import authRouter from "./routes/auth.routes";

const app = express();

app.use(express.json());

const PORT = 3000;

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});