import type { Request, Response } from "express";
import { getHelloMessage } from "./service.js";

export async function emptyController(_req: Request, res: Response) {
  const message = await getHelloMessage();
  res.json({ message });
}