import express from "express";
import "dotenv/config";
import fundamentalsRouter from "./modules/fundamentals/router.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/fundamentals", fundamentalsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});







