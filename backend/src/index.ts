import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Sample Route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
