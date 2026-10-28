import { Router } from "express";
import { emptyController } from "./controller.js";

const fundamentalsRouter = Router();

fundamentalsRouter.get("/", emptyController);

export default fundamentalsRouter;