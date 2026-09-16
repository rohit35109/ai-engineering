import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { askOllama } from "./ollama";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/api/chat", async (req: Request, res: Response) => {
    const prompt = req.body.prompt || null;
    console.log(prompt);
    const result = await askOllama(req.body.prompt);
    res.json(result);
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
